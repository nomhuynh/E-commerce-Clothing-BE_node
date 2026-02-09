const express = require('express');
const healthRoute = require('./health.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const addressRoute = require('./address.route');
const categoryRoute = require('./category.route');
const colorRoute = require('./color.route');
const sizeRoute = require('./size.route');
const materialRoute = require('./material.route');
const usageRoute = require('./usage.route');
const promotionRoute = require('./promotion.route');
const couponRoute = require('./coupon.route');

const adminUserRoute = require('./admin/user.route');
const adminPromotionRoute = require('./admin/promotion.route');
const adminCouponRoute = require('./admin/coupon.route');

const router = express.Router();

router.use('/health', healthRoute);
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/addresses', addressRoute);
router.use('/products', require('./product.route'));
router.use('/categories', categoryRoute);
router.use('/colors', colorRoute);
router.use('/sizes', sizeRoute);
router.use('/materials', materialRoute);
router.use('/usages', usageRoute);
router.use('/promotions', promotionRoute);
router.use('/coupons', couponRoute);
router.use('/admin/users', adminUserRoute);
router.use('/admin/promotions', adminPromotionRoute);
router.use('/admin/coupons', adminCouponRoute);

module.exports = router;

