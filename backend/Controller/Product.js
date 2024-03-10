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
    let cat = req.query.category.split("_")
    cat.splice(cat.length-1,1)
    query = query.find({ category: {$in : cat} });
    queryCount = queryCount.find({ category: {$in : cat} });
  }
  if (req.query.brand) {
    let brandArray = req.query.brand.split("_")
    brandArray.splice(brandArray.length-1,1)
    query = query.find({ brand: {$in : brandArray} });
    queryCount = queryCount.find({ brand: {$in : brandArray} });
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
