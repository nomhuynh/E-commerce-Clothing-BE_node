const request = require('supertest');
const app = require('../src/app');
const sizeService = require('../src/services/size.service');

// Mock middlewares
jest.mock('../src/middlewares/auth.middleware', () => require('./utils/mockAuth'));

// Mock service
jest.mock('../src/services/size.service');

describe('Size API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/v1/sizes', () => {
        it('should return all sizes', async () => {
            const mockSizes = [{ size_id: '1', name: 'M', type: 'clothing' }];
            sizeService.getSizes.mockResolvedValue(mockSizes);

            const res = await request(app).get('/api/v1/sizes');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockSizes);
        });

        it('should handle errors when fetching sizes', async () => {
            sizeService.getSizes.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/v1/sizes');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/sizes/:id', () => {
        it('should return size by id', async () => {
            const mockSize = { size_id: '1', name: 'M', type: 'clothing' };
            sizeService.getSizeById.mockResolvedValue(mockSize);

            const res = await request(app).get('/api/v1/sizes/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockSize);
        });

        it('should handle errors when fetching size by id', async () => {
            sizeService.getSizeById.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/v1/sizes/1');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/sizes', () => {
        it('should create a new size', async () => {
            const newSize = { name: 'L', type: 'clothing' };
            const createdSize = { size_id: '2', ...newSize };
            sizeService.createSize.mockResolvedValue(createdSize);

            const res = await request(app)
                .post('/api/v1/sizes')
                .send(newSize);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(createdSize);
        });

        it('should handle errors when creating size', async () => {
            const newSize = { name: 'L', type: 'clothing' };
            sizeService.createSize.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/api/v1/sizes')
                .send(newSize);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PATCH /api/v1/sizes/:id', () => {
        it('should update a size', async () => {
            const updateData = { name: 'XL' };
            const updatedSize = { size_id: '2', name: 'XL', type: 'clothing' };
            sizeService.updateSize.mockResolvedValue(updatedSize);

            const res = await request(app)
                .patch('/api/v1/sizes/2')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(updatedSize);
        });

        it('should handle errors when updating size', async () => {
            const updateData = { name: 'XL' };
            sizeService.updateSize.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .patch('/api/v1/sizes/2')
                .send(updateData);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /api/v1/sizes/:id', () => {
        it('should delete a size', async () => {
            sizeService.deleteSize.mockResolvedValue({ message: 'Size deleted successfully' });

            const res = await request(app).delete('/api/v1/sizes/2');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Size deleted successfully');
        });

        it('should handle errors when deleting size', async () => {
            sizeService.deleteSize.mockRejectedValue(new Error('Database error'));

            const res = await request(app).delete('/api/v1/sizes/2');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });
});
