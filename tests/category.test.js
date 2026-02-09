const request = require('supertest');
const app = require('../src/app');
const categoryService = require('../src/services/category.service');

// Mock middlewares
jest.mock('../src/middlewares/auth.middleware', () => require('./utils/mockAuth'));

// Mock service
jest.mock('../src/services/category.service');

describe('Category API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /categories', () => {
        it('should return all categories', async () => {
            const mockCategories = [{ category_id: '1', name: 'Men' }];
            categoryService.getCategories.mockResolvedValue(mockCategories);

            const res = await request(app).get('/api/v1/categories');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockCategories);
            expect(categoryService.getCategories).toHaveBeenCalled();
        });

        it('should handle errors when fetching categories', async () => {
            categoryService.getCategories.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/v1/categories');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /categories/:id', () => {
        it('should return category by id', async () => {
            const mockCategory = { category_id: '1', name: 'Men' };
            categoryService.getCategoryById.mockResolvedValue(mockCategory);

            const res = await request(app).get('/api/v1/categories/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockCategory);
            expect(categoryService.getCategoryById).toHaveBeenCalledWith('1');
        });

        it('should handle errors when fetching category by id', async () => {
            categoryService.getCategoryById.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/v1/categories/1');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /categories', () => {
        it('should create a new category', async () => {
            const newCategory = { name: 'Women', slug: 'women' };
            const createdCategory = { category_id: '2', ...newCategory };
            categoryService.createCategory.mockResolvedValue(createdCategory);

            const res = await request(app)
                .post('/api/v1/categories')
                .send(newCategory);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(createdCategory);
            expect(categoryService.createCategory).toHaveBeenCalledWith(newCategory);
        });

        it('should handle errors when creating category', async () => {
            const newCategory = { name: 'Women', slug: 'women' };
            categoryService.createCategory.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/api/v1/categories')
                .send(newCategory);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PATCH /categories/:id', () => {
        it('should update a category', async () => {
            const updateData = { name: 'Women Updated' };
            const updatedCategory = { category_id: '2', ...updateData };
            categoryService.updateCategory.mockResolvedValue(updatedCategory);

            const res = await request(app)
                .patch('/api/v1/categories/2')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(updatedCategory);
            expect(categoryService.updateCategory).toHaveBeenCalledWith('2', updateData);
        });

        it('should handle errors when updating category', async () => {
            const updateData = { name: 'Women Updated' };
            categoryService.updateCategory.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .patch('/api/v1/categories/2')
                .send(updateData);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /categories/:id', () => {
        it('should delete a category', async () => {
            categoryService.deleteCategory.mockResolvedValue({ message: 'Category deleted successfully' });

            const res = await request(app).delete('/api/v1/categories/2');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Category deleted successfully');
            expect(categoryService.deleteCategory).toHaveBeenCalledWith('2');
        });

        it('should handle errors when deleting category', async () => {
            categoryService.deleteCategory.mockRejectedValue(new Error('Database error'));

            const res = await request(app).delete('/api/v1/categories/2');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });
});
