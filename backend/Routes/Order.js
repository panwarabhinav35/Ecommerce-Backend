const express = require('express');
const { addtoOrder, fetchOrderByUser, updateOrder, fetchAllOrders } = require('../Controller/Order');

const router = express.Router();

router.post('/' , addtoOrder).get("/user/:userId", fetchOrderByUser).patch('/:id', updateOrder).get('/',fetchAllOrders);

exports.router = router;