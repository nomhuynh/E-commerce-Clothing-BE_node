onst fs = require('fs');
const path = require('path');
// Load .env from the backend root directory (one level up from scripts/)
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { sequelize, Product, Category, Color, Size, ProductVariant, ProductImage } = require('../src/models');

const DATA_DIR = path.join(__dirname, '../../Scrape Data Product/product done');

async function importData() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Get all json files
        const files = fs.readdirSync(DATA_DIR).filter(file => file.endsWith('.json'));

        for (const file of files) {
            console.log(`Processing file: ${file}`);
            const filePath = path.join(DATA_DIR, file);
            const rawData = fs.readFileSync(filePath);
            const products = JSON.parse(rawData);

            for (const productData of products) {
                const transaction = await sequelize.transaction();
                try {
                    // Check if product already exists to avoid duplicates
                    let product = await Product.findOne({ where: { name: productData.name } });

                    if (!product) {
                        // 1. Handle Category
                        let category = await Category.findOne({ where: { slug: productData.category.slug }, transaction });
                        if (!category) {
                            category = await Category.create({
                                name: productData.category.name,
                                slug: productData.category.slug,
                                image: productData.category.image
                            }, { transaction });
                            console.log(`Created Category: ${category.name}`);
                        }

                        // 2. Handle Product
                        product = await Product.create({
                            name: productData.name,
                            description: productData.description,
                            base_price: productData.base_price,
                            gender: productData.gender,
                            age_group: productData.age_group,
                            category_id: category.category_id,
                            material_id: null
                        }, { transaction });
                        console.log(`Created Product: ${product.name}`);
                    } else {
                        console.log(`Product already exists: ${product.name}`);
                    }

                    // 3. Handle Variants
                    if (productData.variants && productData.variants.length > 0) {
                        for (const variantData of productData.variants) {
                            // Check if variant exists by SKU
                            const existingVariant = await ProductVariant.findOne({ where: { sku: variantData.sku }, transaction });
                            if (existingVariant) {
                                // console.log(`Variant SKU ${variantData.sku} already exists. Skipping.`);
                                continue;
                            }

                            // Handle Color
                            let color = await Color.findOne({ where: { name: variantData.color.name }, transaction });
                            if (!color) {
                                // Handle hex_code: can be null, but empty string fails validation
                                const hexCode = variantData.color.hex_code === '' ? null : variantData.color.hex_code;
                                color = await Color.create({
                                    name: variantData.color.name,
                                    hex_code: hexCode
                                }, { transaction });
                                console.log(`Created Color: ${color.name}`);
                            }

                            // Handle Size
                            // Force type to 'clothing' if it is 'Standard' or missing, as per DB requirement
                            let sizeType = variantData.size.type === 'Standard' ? 'clothing' : variantData.size.type;
                            let size = await Size.findOne({ where: { name: variantData.size.name, type: sizeType }, transaction });
                            if (!size) {
                                size = await Size.create({
                                    name: variantData.size.name,
                                    type: sizeType
                                }, { transaction });
                                console.log(`Created Size: ${size.name}`);
                            }

                            // Create Variant
                            await ProductVariant.create({
                                product_id: product.product_id,
                                color_id: color.color_id,
                                size_id: size.size_id,
                                sku: variantData.sku,
                                price: variantData.price,
                                stock_quantity: variantData.stock_quantity,
                                image: variantData.image,
                                is_active: true
                            }, { transaction });
                        }
                    }

                    // 4. Handle Images
                    // Simple check to avoid duplicating images if we are re-running
                    const existingImages = await ProductImage.count({ where: { product_id: product.product_id } });
                    if (existingImages === 0 && productData.images && productData.images.length > 0) {
                        for (const imageData of productData.images) {
                            await ProductImage.create({
                                product_id: product.product_id,
                                image_url: imageData.image_url,
                                is_thumbnail: imageData.is_thumbnail,
                                sort_order: 0
                            }, { transaction });
                        }
                    }

                    await transaction.commit();

                } catch (error) {
                    await transaction.rollback();
                    console.error(`Error processing product ${productData.name}:`, error.message);
                }
            }
        }
        console.log('Import completed.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

importData();
