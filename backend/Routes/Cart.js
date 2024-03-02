const express = require('express');
const { addToCart, fetchCartItemsByUser } = require('../Controller/Cart');

const router = express.Router();

router.post('/' , addToCart).get("/", fetchCartItemsByUser);

exports.router = router;