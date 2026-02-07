const express = require('express');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected routes
router.post('/', verifyToken, authorize('ADMIN', 'STAFF'), productController.createProduct);
router.patch('/:id', verifyToken, authorize('ADMIN', 'STAFF'), productController.updateProduct);
router.delete('/:id', verifyToken, authorize('ADMIN', 'STAFF'), productController.deleteProduct);

module.exports = router;
