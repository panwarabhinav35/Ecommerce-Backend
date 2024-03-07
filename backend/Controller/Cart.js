const { Cart } = require("../Model/Cart");

exports.fetchCartItemsByUser= async (req, res) => {
    const {id} = req.user;
  try {
    const cartItems = await Cart.find({user:id}).populate('product').exec();
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await Cart.findByIdAndUpdate(id, req.body, { new: true }).populate('product');
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.deleteCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await Cart.findByIdAndDelete(id);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToCart = (req, res) => {
  const {id} = req.user
  const cart = new Cart({...req.body, user: id});
  cart
    .save()
    .then(() => {
      res.status(201).json(cart);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
