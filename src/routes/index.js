const express = require('express');
const healthRoute = require('./health.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const addressRoute = require('./address.route');

const adminUserRoute = require('./admin/user.route');

const router = express.Router();

router.use('/health', healthRoute);
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/addresses', addressRoute);
router.use('/products', require('./product.route'));
router.use('/admin/users', adminUserRoute);

module.exports = router;

