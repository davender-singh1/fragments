const { randomUUID } = require('crypto');
const contentType = require('content-type');
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data/memory/index');

class Fragment {
  constructor({
    id = randomUUID(),
    ownerId,
    created = new Date().toISOString(),
    updated = new Date().toISOString(),
    type,
    size = 0,
  }) {
    if (!ownerId) {
      throw new Error('OwnerId is required for a fragment.');
    }
    if (!type) {
      throw new Error('Type is required for a fragment.');
    }
    if (!Fragment.isSupportedType(type)) {
      throw new Error('Unsupported type.');
    }
    if (typeof size !== 'number' || size < 0) {
      throw new Error('Invalid size.');
    }

    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;
    this.size = size;
  }

  static async byUser(ownerId, expand = false) {
    const fragmentIds = await listFragments(ownerId);
    if (!expand) return fragmentIds;
    return Promise.all(fragmentIds.map((id) => Fragment.byId(ownerId, id)));
  }

  static async byId(ownerId, id) {
    const fragmentData = await readFragment(ownerId, id);
    if (!fragmentData) throw new Error(`Fragment with ID ${id} not found for user ${ownerId}.`);
    return new Fragment(fragmentData);
  }

  static async delete(ownerId, fragmentId) {
    await deleteFragment(ownerId, fragmentId);
  }

  async save() {
    console.log('Saving fragment:', this);
    this.updated = new Date().toISOString();
    await writeFragment(this.ownerId, this);
  }

  async getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error('Data should be of type Buffer');
    }
    await writeFragmentData(this.ownerId, this.id, data);
    this.size = data.length;
    this.updated = new Date().toISOString();
    await this.save();
  }

  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  get isText() {
    return this.mimeType.startsWith('text/');
  }

  get formats() {
    // Assuming only text types are supported currently
    return ['text/plain'];
  }

  static isSupportedType(value) {
    const { type } = contentType.parse(value);
    return type.startsWith('text/');
  }
}

module.exports = Fragment;
