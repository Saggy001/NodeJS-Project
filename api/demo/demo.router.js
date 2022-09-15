const { AsyncWaterfall, AsyncParallel } = require('./demo.controller');

const router = require('express').Router();

router.get('/waterfall', AsyncWaterfall);
router.get('/parallel', AsyncParallel);

module.exports = router;