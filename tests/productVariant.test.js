const request = require('supertest');
const app = require('../src/app');
const productVariantService = require('../src/services/productVariant.service');

// Mock middlewares
jest.mock('../src/middlewares/auth.middleware', () => require('./utils/mockAuth'));

// Mock service
jest.mock('../src/services/productVariant.service');

describe('Product Variant API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/v1/products/:productId/variants', () => {
        it('should return variants for a product', async () => {
            const mockVariants = [{ variant_id: '1', sku: 'SKU-123' }];
            productVariantService.getVariantsByProduct.mockResolvedValue(mockVariants);

            const res = await request(app).get('/api/v1/products/1/variants');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockVariants);
        });

        it('should handle errors when fetching variants', async () => {
            productVariantService.getVariantsByProduct.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/v1/products/1/variants');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/products/:productId/variants', () => {
        it('should create a new variant', async () => {
            const newVariant = { sku: 'SKU-456' };
            const createdVariant = { variant_id: '2', ...newVariant };
            productVariantService.createVariant.mockResolvedValue(createdVariant);

            const res = await request(app)
                .post('/api/v1/products/1/variants')
                .send(newVariant);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(createdVariant);
        });

        it('should handle errors when creating variant', async () => {
            const newVariant = { sku: 'SKU-456' };
            productVariantService.createVariant.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/api/v1/products/1/variants')
                .send(newVariant);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PATCH /api/v1/products/:productId/variants/:id', () => {
        it('should update a variant', async () => {
            const updateData = { price: 100 };
            const updatedVariant = { variant_id: '2', ...updateData };
            productVariantService.updateVariant.mockResolvedValue(updatedVariant);

            const res = await request(app)
                .patch('/api/v1/products/1/variants/2')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(updatedVariant);
        });

        it('should handle errors when updating variant', async () => {
            const updateData = { price: 100 };
            productVariantService.updateVariant.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .patch('/api/v1/products/1/variants/2')
                .send(updateData);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /api/v1/products/:productId/variants/:id', () => {
        it('should delete a variant', async () => {
            productVariantService.deleteVariant.mockResolvedValue({ message: 'Variant deleted successfully' });

            const res = await request(app).delete('/api/v1/products/1/variants/2');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Variant deleted successfully');
        });

        it('should handle errors when deleting variant', async () => {
            productVariantService.deleteVariant.mockRejectedValue(new Error('Database error'));

            const res = await request(app).delete('/api/v1/products/1/variants/2');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });
});
