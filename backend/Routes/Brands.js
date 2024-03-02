const express = require('express');
const { fetchBrands } = require('../Controller/Brand');

const router = express.Router();

router.get("/", fetchBrands);

exports.router = router;