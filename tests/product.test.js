const request = require('supertest');
const app = require('../src/app');
const productService = require('../src/services/product.service');

// Mock middlewares
jest.mock('../src/middlewares/auth.middleware', () => ({
    verifyToken: jest.fn((req, res, next) => {
        req.user = { user_id: 'admin-id', role: 'ADMIN' };
        next();
    }),
    authorize: jest.fn((...roles) => (req, res, next) => next())
}));

// Mock service
jest.mock('../src/services/product.service');

describe('Product API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/v1/products', () => {
        it('should return all products', async () => {
            const mockProducts = {
                products: [{ product_id: '1', name: 'T-Shirt' }],
                total: 1,
                page: 1,
                total_pages: 1
            };
            productService.getProducts.mockResolvedValue(mockProducts);

            const res = await request(app).get('/api/v1/products');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockProducts);
        });
    });

    describe('GET /api/v1/products/:id', () => {
        it('should return product by id', async () => {
            const mockProduct = { product_id: '1', name: 'T-Shirt' };
            productService.getProductById.mockResolvedValue(mockProduct);

            const res = await request(app).get('/api/v1/products/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockProduct);
        });
    });

    describe('POST /api/v1/products', () => {
        it('should create a new product', async () => {
            const newProduct = { name: 'Jeans' };
            const createdProduct = { product_id: '2', ...newProduct };
            productService.createProduct.mockResolvedValue(createdProduct);

            const res = await request(app)
                .post('/api/v1/products')
                .send(newProduct);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(createdProduct);
        });
    });

    describe('PATCH /api/v1/products/:id', () => {
        it('should update a product', async () => {
            const updateData = { name: 'Blue Jeans' };
            const updatedProduct = { product_id: '2', ...updateData };
            productService.updateProduct.mockResolvedValue(updatedProduct);

            const res = await request(app)
                .patch('/api/v1/products/2')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(updatedProduct);
        });
    });

    describe('DELETE /api/v1/products/:id', () => {
        it('should delete a product', async () => {
            productService.deleteProduct.mockResolvedValue({ message: 'Product deleted successfully' });

            const res = await request(app).delete('/api/v1/products/2');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Product deleted successfully');
        });
    });
});
