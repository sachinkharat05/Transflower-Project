const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/:userId', cartController.getCart);
router.post('/:userId/items', cartController.addToCart);
router.patch('/:userId/items/:productId', cartController.updateCartItem);
router.delete('/:userId/items/:productId', cartController.removeCartItem);
router.delete('/:userId', cartController.clearCart);

module.exports = router;
