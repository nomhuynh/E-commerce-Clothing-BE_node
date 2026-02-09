const request = require('supertest');
const app = require('../src/app');
const promotionService = require('../src/services/promotion.service');

// Mock middlewares
jest.mock('../src/middlewares/auth.middleware', () => ({
    verifyToken: jest.fn((req, res, next) => {
        req.user = { user_id: 'admin-id', role: 'ADMIN' };
        next();
    }),
    authorize: jest.fn((...roles) => (req, res, next) => next())
}));

// Mock service
jest.mock('../src/services/promotion.service');

describe('Promotion API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/v1/promotions', () => {
        it('should return active promotions', async () => {
            const mockPromotions = [{ promotion_id: '1', name: 'Summer Sale' }];
            promotionService.getActivePromotions.mockResolvedValue(mockPromotions);

            const res = await request(app).get('/api/v1/promotions');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockPromotions);
        });
    });

    describe('GET /api/v1/admin/promotions', () => {
        it('should return all promotions', async () => {
            const mockResult = {
                promotions: [{ promotion_id: '1', name: 'Summer Sale' }],
                total: 1,
                page: 1,
                total_pages: 1
            };
            promotionService.getAllPromotions.mockResolvedValue(mockResult);

            const res = await request(app).get('/api/v1/admin/promotions');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockResult);
        });
    });

    describe('POST /api/v1/admin/promotions', () => {
        it('should create a new promotion', async () => {
            const newPromotion = { name: 'Winter Sale' };
            const createdPromotion = { promotion_id: '2', ...newPromotion };
            promotionService.createPromotion.mockResolvedValue(createdPromotion);

            const res = await request(app)
                .post('/api/v1/admin/promotions')
                .send(newPromotion);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(createdPromotion);
        });
    });
});
