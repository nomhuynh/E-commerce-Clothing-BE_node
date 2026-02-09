const request = require('supertest');
const app = require('../src/app');
const productImageService = require('../src/services/productImage.service');

// Mock middlewares
jest.mock('../src/middlewares/auth.middleware', () => require('./utils/mockAuth'));

// Mock service
jest.mock('../src/services/productImage.service');

describe('Product Image API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/v1/products/:productId/images', () => {
        it('should return images for a product', async () => {
            const mockImages = [{ image_id: '1', image_url: 'http://example.com/image.jpg' }];
            productImageService.getImagesByProduct.mockResolvedValue(mockImages);

            const res = await request(app).get('/api/v1/products/1/images');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockImages);
        });

        it('should handle errors when fetching images', async () => {
            productImageService.getImagesByProduct.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/v1/products/1/images');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/products/:productId/images', () => {
        it('should create a new image', async () => {
            const newImage = { image_url: 'http://example.com/new.jpg' };
            const createdImage = { image_id: '2', ...newImage };
            productImageService.createImage.mockResolvedValue(createdImage);

            const res = await request(app)
                .post('/api/v1/products/1/images')
                .send(newImage);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(createdImage);
        });

        it('should handle errors when creating image', async () => {
            const newImage = { image_url: 'http://example.com/new.jpg' };
            productImageService.createImage.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/api/v1/products/1/images')
                .send(newImage);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PATCH /api/v1/products/:productId/images/:id', () => {
        it('should update an image', async () => {
            const updateData = { alt_text: 'New Alt Text' };
            const updatedImage = { image_id: '2', ...updateData };
            productImageService.updateImage.mockResolvedValue(updatedImage);

            const res = await request(app)
                .patch('/api/v1/products/1/images/2')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(updatedImage);
        });

        it('should handle errors when updating image', async () => {
            const updateData = { alt_text: 'New Alt Text' };
            productImageService.updateImage.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .patch('/api/v1/products/1/images/2')
                .send(updateData);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /api/v1/products/:productId/images/:id', () => {
        it('should delete an image', async () => {
            productImageService.deleteImage.mockResolvedValue({ message: 'Image deleted successfully' });

            const res = await request(app).delete('/api/v1/products/1/images/2');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Image deleted successfully');
        });

        it('should handle errors when deleting image', async () => {
            productImageService.deleteImage.mockRejectedValue(new Error('Database error'));

            const res = await request(app).delete('/api/v1/products/1/images/2');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });
});
