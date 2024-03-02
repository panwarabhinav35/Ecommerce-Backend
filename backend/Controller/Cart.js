const { Cart } = require("../Model/Cart");

exports.fetchCartItemsByUser= async (req, res) => {
    const {user} = req.query;
  try {
    const cartItems = await Cart.find({user:user}).populate('user').populate('product').exec();
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToCart = (req, res) => {
  const cart = new Cart(req.body);
  cart
    .save()
    .then(() => {
      res.status(201).json(cart);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
