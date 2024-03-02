const express = require('express');
const { fetchCategory } = require('../Controller/Category');

const router = express.Router();

router.get("/", fetchCategory);

exports.router = router;