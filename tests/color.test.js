const request = require('supertest');
const app = require('../src/app');
const colorService = require('../src/services/color.service');

// Mock middlewares
jest.mock('../src/middlewares/auth.middleware', () => require('./utils/mockAuth'));

// Mock service
jest.mock('../src/services/color.service');

describe('Color API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/v1/colors', () => {
        it('should return all colors', async () => {
            const mockColors = [{ color_id: '1', name: 'Red', hex_code: '#FF0000' }];
            colorService.getColors.mockResolvedValue(mockColors);

            const res = await request(app).get('/api/v1/colors');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockColors);
        });

        it('should handle errors when fetching colors', async () => {
            colorService.getColors.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/v1/colors');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/colors/:id', () => {
        it('should return color by id', async () => {
            const mockColor = { color_id: '1', name: 'Red', hex_code: '#FF0000' };
            colorService.getColorById.mockResolvedValue(mockColor);

            const res = await request(app).get('/api/v1/colors/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockColor);
        });

        it('should handle errors when fetching color by id', async () => {
            colorService.getColorById.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/v1/colors/1');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/colors', () => {
        it('should create a new color', async () => {
            const newColor = { name: 'Blue', hex_code: '#0000FF' };
            const createdColor = { color_id: '2', ...newColor };
            colorService.createColor.mockResolvedValue(createdColor);

            const res = await request(app)
                .post('/api/v1/colors')
                .send(newColor);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(createdColor);
        });

        it('should handle errors when creating color', async () => {
            const newColor = { name: 'Blue', hex_code: '#0000FF' };
            colorService.createColor.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/api/v1/colors')
                .send(newColor);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PATCH /api/v1/colors/:id', () => {
        it('should update a color', async () => {
            const updateData = { name: 'Dark Blue' };
            const updatedColor = { color_id: '2', name: 'Dark Blue', hex_code: '#0000FF' };
            colorService.updateColor.mockResolvedValue(updatedColor);

            const res = await request(app)
                .patch('/api/v1/colors/2')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(updatedColor);
        });

        it('should handle errors when updating color', async () => {
            const updateData = { name: 'Dark Blue' };
            colorService.updateColor.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .patch('/api/v1/colors/2')
                .send(updateData);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /api/v1/colors/:id', () => {
        it('should delete a color', async () => {
            colorService.deleteColor.mockResolvedValue({ message: 'Color deleted successfully' });

            const res = await request(app).delete('/api/v1/colors/2');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Color deleted successfully');
        });

        it('should handle errors when deleting color', async () => {
            colorService.deleteColor.mockRejectedValue(new Error('Database error'));

            const res = await request(app).delete('/api/v1/colors/2');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });
});
