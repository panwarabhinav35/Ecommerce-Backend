const { Product } = require("../Model/Product");

exports.createProduct = (req, res) => {
  const product = new Product(req.body);
  product
    .save()
    .then(() => {
      res.status(201).json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.fetchAllProduct = async (req, res) => {
  // here we need all query string
  let query = null;
  let queryCount = null;
  if (req.query.isAdmin) {
    query = Product.find({});
    queryCount = Product.find({});
  } else {
    query = Product.find({ deleted: { $ne: true } });
    queryCount = Product.find({ deleted: { $ne: true } });
  }

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    queryCount = queryCount.find({ category: req.query.category });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    queryCount = queryCount.find({ brand: req.query.brand });
  }
  if (req.query._sort) {
    query = query.sort({ [req.query._sort]: "asc" });
    queryCount = queryCount.sort({ [req.query._sort]: "asc" });
  }
  if (req.query._page) {
    const pageSize = 10;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }
  try {
    const docs = await query.exec();
    const items = await queryCount.countDocuments();
    res.status(200).json({ items: items, data: docs });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await Product.findById(id);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
