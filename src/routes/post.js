const Fragment = require('../../src/model/fragment');

module.exports = async (req, res, next) => {
  try {
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).send('Invalid content type or data.');
    }

    const ownerId = req.user.id; // Assuming some authentication middleware set `req.user`
    const fragment = new Fragment({
      ownerId: ownerId,
      type: req.headers['content-type'],
      size: req.body.length,
    });

    await fragment.setData(req.body);
    await fragment.save();

    res.status(201).json({ id: fragment.id, ownerId: fragment.ownerId });
  } catch (error) {
    next(error);
  }
};
