const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/:userId', orderController.listOrders);
router.post('/:userId', orderController.createOrder);

module.exports = router;
