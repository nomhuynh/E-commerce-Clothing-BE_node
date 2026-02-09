const request = require('supertest');
const app = require('../src/app');
const usageService = require('../src/services/usage.service');

// Mock middlewares
jest.mock('../src/middlewares/auth.middleware', () => require('./utils/mockAuth'));

// Mock service
jest.mock('../src/services/usage.service');

describe('Usage API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/v1/usages', () => {
        it('should return all usages', async () => {
            const mockUsages = [{ usage_id: '1', name: 'Casual' }];
            usageService.getUsages.mockResolvedValue(mockUsages);

            const res = await request(app).get('/api/v1/usages');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockUsages);
        });

        it('should handle errors when fetching usages', async () => {
            usageService.getUsages.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/v1/usages');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/usages/:id', () => {
        it('should return usage by id', async () => {
            const mockUsage = { usage_id: '1', name: 'Casual' };
            usageService.getUsageById.mockResolvedValue(mockUsage);

            const res = await request(app).get('/api/v1/usages/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockUsage);
        });

        it('should handle errors when fetching usage by id', async () => {
            usageService.getUsageById.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/v1/usages/1');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/usages', () => {
        it('should create a new usage', async () => {
            const newUsage = { name: 'Formal' };
            const createdUsage = { usage_id: '2', ...newUsage };
            usageService.createUsage.mockResolvedValue(createdUsage);

            const res = await request(app)
                .post('/api/v1/usages')
                .send(newUsage);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(createdUsage);
        });

        it('should handle errors when creating usage', async () => {
            const newUsage = { name: 'Formal' };
            usageService.createUsage.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/api/v1/usages')
                .send(newUsage);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PATCH /api/v1/usages/:id', () => {
        it('should update a usage', async () => {
            const updateData = { name: 'Business Formal' };
            const updatedUsage = { usage_id: '2', ...updateData };
            usageService.updateUsage.mockResolvedValue(updatedUsage);

            const res = await request(app)
                .patch('/api/v1/usages/2')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(updatedUsage);
        });

        it('should handle errors when updating usage', async () => {
            const updateData = { name: 'Business Formal' };
            usageService.updateUsage.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .patch('/api/v1/usages/2')
                .send(updateData);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /api/v1/usages/:id', () => {
        it('should delete a usage', async () => {
            usageService.deleteUsage.mockResolvedValue({ message: 'Usage deleted successfully' });

            const res = await request(app).delete('/api/v1/usages/2');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Usage deleted successfully');
        });

        it('should handle errors when deleting usage', async () => {
            usageService.deleteUsage.mockRejectedValue(new Error('Database error'));

            const res = await request(app).delete('/api/v1/usages/2');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });
});
