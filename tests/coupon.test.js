const request = require('supertest');
const app = require('../src/app');
const couponService = require('../src/services/coupon.service');

// Mock middlewares
jest.mock('../src/middlewares/auth.middleware', () => ({
    verifyToken: jest.fn((req, res, next) => {
        req.user = { user_id: 'admin-id', role: 'ADMIN' };
        next();
    }),
    authorize: jest.fn((...roles) => (req, res, next) => next())
}));

// Mock service
jest.mock('../src/services/coupon.service');

describe('Coupon API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/v1/coupons/validate', () => {
        it('should validate a coupon', async () => {
            const mockResult = {
                valid: true,
                coupon: { code: 'SAVE10', discount_value: 10 },
                discount_amount: 10,
                final_amount: 90
            };
            couponService.validateCoupon.mockResolvedValue(mockResult);

            const res = await request(app)
                .post('/api/v1/coupons/validate')
                .send({ code: 'SAVE10', order_value: 100 });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockResult);
        });
    });

    describe('POST /api/v1/coupons/apply', () => {
        it('should apply a coupon', async () => {
            const mockResult = {
                success: true,
                discount_amount: 10,
                message: 'Coupon applied successfully'
            };
            couponService.applyCoupon.mockResolvedValue(mockResult);

            const res = await request(app)
                .post('/api/v1/coupons/apply')
                .send({ code: 'SAVE10', order_id: '123', order_value: 100 });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockResult);
        });
    });

    describe('GET /api/v1/admin/coupons', () => {
        it('should return all coupons', async () => {
            const mockResult = {
                coupons: [{ coupon_id: '1', code: 'SAVE10' }],
                total: 1,
                page: 1,
                total_pages: 1
            };
            couponService.getAllCoupons.mockResolvedValue(mockResult);

            const res = await request(app).get('/api/v1/admin/coupons');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockResult);
        });
    });

    describe('POST /api/v1/admin/coupons', () => {
        it('should create a new coupon', async () => {
            const newCoupon = { code: 'NEW20' };
            const createdCoupon = { coupon_id: '2', ...newCoupon };
            couponService.createCoupon.mockResolvedValue(createdCoupon);

            const res = await request(app)
                .post('/api/v1/admin/coupons')
                .send(newCoupon);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(createdCoupon);
        });
    });
});
