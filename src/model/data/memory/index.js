const MemoryDB = require('./memory-db');

// Create two in-memory databases: one for fragment metadata and the other for raw data
const data = new MemoryDB();
const metadata = new MemoryDB();

// Write a fragment's metadata to memory db. Returns a Promise
function writeFragment(ownerId, fragment) {
  console.log('Writing fragment with ownerId:', ownerId, 'and fragment ID:', fragment.id);
  return metadata.put(ownerId, fragment.id, fragment); // Actually save the fragment metadata
}

// Read a fragment's metadata from memory db. Returns a Promise
function readFragment(ownerId, id) {
  return metadata.get(ownerId, id);
}

// Write a fragment's data buffer to memory db. Returns a Promise
function writeFragmentData(ownerId, id, buffer) {
  return data.put(ownerId, id, buffer);
}

// Read a fragment's data from memory db. Returns a Promise
function readFragmentData(ownerId, id) {
  return data.get(ownerId, id);
}

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
async function listFragments(ownerId, expand = false) {
  const fragments = await metadata.query(ownerId);
  if (expand) {
    return fragments.map((frag) => new Fragment(frag));
  }
  // Return just the IDs if not expanding
  return fragments.map((fragment) => fragment.id);
}

// Delete a fragment's metadata and data from memory db. Returns a Promise
async function deleteFragment(ownerId, id) {
  const exists = await readFragment(ownerId, id);
  if (!exists) {
    throw new Error(`Fragment not found for ownerId=${ownerId} and id=${id}`);
  }
  return Promise.all([
    // Delete metadata
    metadata.del(ownerId, id),
    // Delete data
    data.del(ownerId, id),
  ]);
}

module.exports.listFragments = listFragments;
module.exports.writeFragment = writeFragment;
module.exports.readFragment = readFragment;
module.exports.writeFragmentData = writeFragmentData;
module.exports.readFragmentData = readFragmentData;
module.exports.deleteFragment = deleteFragment;
