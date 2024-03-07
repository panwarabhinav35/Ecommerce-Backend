const { Order } = require("../Model/Order");

exports.fetchOrderByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const orderItems = await Order.find({ user: id }).populate("user").exec();
    res.status(200).json(orderItems);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.fetchAllOrders = async (req, res) => {
  let query = Order.find({  });
  let queryCount = Order.find({  });

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

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addtoOrder = (req, res) => {
  const order = new Order(req.body);
  order
    .save()
    .then(() => {
      res.status(201).json(order);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
