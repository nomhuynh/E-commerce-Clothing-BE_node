const request = require('supertest');
const app = require('../src/app');
const materialService = require('../src/services/material.service');

// Mock middlewares
jest.mock('../src/middlewares/auth.middleware', () => require('./utils/mockAuth'));

// Mock service
jest.mock('../src/services/material.service');

describe('Material API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/v1/materials', () => {
        it('should return all materials', async () => {
            const mockMaterials = [{ material_id: '1', name: 'Cotton' }];
            materialService.getMaterials.mockResolvedValue(mockMaterials);

            const res = await request(app).get('/api/v1/materials');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockMaterials);
        });

        it('should handle errors when fetching materials', async () => {
            materialService.getMaterials.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/v1/materials');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/materials/:id', () => {
        it('should return material by id', async () => {
            const mockMaterial = { material_id: '1', name: 'Cotton' };
            materialService.getMaterialById.mockResolvedValue(mockMaterial);

            const res = await request(app).get('/api/v1/materials/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockMaterial);
        });

        it('should handle errors when fetching material by id', async () => {
            materialService.getMaterialById.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/v1/materials/1');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/materials', () => {
        it('should create a new material', async () => {
            const newMaterial = { name: 'Polyester' };
            const createdMaterial = { material_id: '2', ...newMaterial };
            materialService.createMaterial.mockResolvedValue(createdMaterial);

            const res = await request(app)
                .post('/api/v1/materials')
                .send(newMaterial);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(createdMaterial);
        });

        it('should handle errors when creating material', async () => {
            const newMaterial = { name: 'Polyester' };
            materialService.createMaterial.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/api/v1/materials')
                .send(newMaterial);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PATCH /api/v1/materials/:id', () => {
        it('should update a material', async () => {
            const updateData = { name: 'Polyester Blend' };
            const updatedMaterial = { material_id: '2', ...updateData };
            materialService.updateMaterial.mockResolvedValue(updatedMaterial);

            const res = await request(app)
                .patch('/api/v1/materials/2')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(updatedMaterial);
        });

        it('should handle errors when updating material', async () => {
            const updateData = { name: 'Polyester Blend' };
            materialService.updateMaterial.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .patch('/api/v1/materials/2')
                .send(updateData);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /api/v1/materials/:id', () => {
        it('should delete a material', async () => {
            materialService.deleteMaterial.mockResolvedValue({ message: 'Material deleted successfully' });

            const res = await request(app).delete('/api/v1/materials/2');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Material deleted successfully');
        });

        it('should handle errors when deleting material', async () => {
            materialService.deleteMaterial.mockRejectedValue(new Error('Database error'));

            const res = await request(app).delete('/api/v1/materials/2');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });
});
