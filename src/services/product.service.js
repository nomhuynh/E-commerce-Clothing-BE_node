const { Product, Category, Material, ProductImage, ProductVariant, Color, Usage } = require('../models');
const { Op } = require('sequelize');

const getProducts = async (query) => {
    const {
        page = 1,
        limit = 10,
        name,
        category_id,
        material_id,
        gender,
        age_group,
        min_price,
        max_price,
        sort_by = 'created_at',
        sort_order = 'DESC'
    } = query;

    const offset = (page - 1) * limit;
    const where = {};

    if (name) {
        where.name = { [Op.like]: `%${name}%` };
    }
    if (category_id) {
        where.category_id = category_id;
    }
    if (material_id) {
        where.material_id = material_id;
    }
    if (gender) {
        where.gender = gender;
    }
    if (age_group) {
        where.age_group = age_group;
    }
    if (min_price || max_price) {
        where.base_price = {};
        if (min_price) where.base_price[Op.gte] = min_price;
        if (max_price) where.base_price[Op.lte] = max_price;
    }

    const { count, rows } = await Product.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort_by, sort_order]],
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['category_id', 'name']
            },
            {
                model: Material,
                as: 'material',
                attributes: ['material_id', 'name']
            },
            {
                model: ProductImage,
                as: 'images',
                attributes: ['image_id', 'image_url', 'alt_text', 'is_thumbnail']
            }
        ],
        distinct: true
    });

    return {
        products: rows,
        total: count,
        page: parseInt(page),
        total_pages: Math.ceil(count / limit)
    };
};

const getProductById = async (productId) => {
    const product = await Product.findByPk(productId, {
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['category_id', 'name']
            },
            {
                model: Material,
                as: 'material',
                attributes: ['material_id', 'name']
            },
            {
                model: ProductImage,
                as: 'images',
                attributes: ['image_id', 'image_url', 'alt_text', 'is_thumbnail', 'sort_order']
            },
            {
                model: ProductVariant,
                as: 'variants',
                include: [
                    {
                        model: Color,
                        as: 'color',
                        attributes: ['color_id', 'name', 'hex_code']
                    }
                ]
            },
            {
                model: Usage,
                as: 'usages',
                attributes: ['usage_id', 'name'],
                through: { attributes: [] }
            }
        ]
    });

    if (!product) {
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
    }

    return product;
};

const createProduct = async (data) => {
    // Basic validation could be here or in controller/middleware
    // For now, assuming data is valid or model validation will catch it
    const product = await Product.create(data);
    return product;
};

const updateProduct = async (productId, data) => {
    const product = await Product.findByPk(productId);
    if (!product) {
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
    }

    await product.update(data);
    return product;
};

const deleteProduct = async (productId) => {
    const product = await Product.findByPk(productId);
    if (!product) {
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
    }

    await product.destroy(); // Soft delete if paranoid is true (it is)
    return { message: 'Product deleted successfully' };
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
