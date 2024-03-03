const express = require('express');
const { addToCart, fetchCartItemsByUser, updateCart, deleteCartItem } = require('../Controller/Cart');

const router = express.Router();

router.post('/' , addToCart).get("/", fetchCartItemsByUser).patch('/:id', updateCart).delete("/:id" , deleteCartItem);

exports.router = router;