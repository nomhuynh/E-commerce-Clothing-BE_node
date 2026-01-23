# E-commerce Clothing Backend - Node.js REST API

A RESTful API backend server for an e-commerce clothing platform built with Node.js, Express, and MySQL.

## 📋 Features

- RESTful API architecture
- MySQL database integration
- User authentication and authorization
- Product management
- Shopping cart functionality
- Order processing
- Payment integration support
- Image upload and management
- Search and filtering capabilities
- Admin panel endpoints

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MySQL](https://www.mysql.com/) (v5.7 or higher)
- [Git](https://git-scm.com/)

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/nomhuynh/E-commerce-Clothing-BE_node.git
cd E-commerce-Clothing-BE_node
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_clothing
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Payment Gateway (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# File Upload
MAX_FILE_SIZE=5000000
FILE_UPLOAD_PATH=./public/uploads
```

## 🗄️ Database Setup

1. **Create the MySQL database**

```bash
mysql -u root -p
```

```sql
CREATE DATABASE ecommerce_clothing;
USE ecommerce_clothing;
```

2. **Run database migrations** (if available)

```bash
npm run migrate
# or
yarn migrate
```

3. **Seed the database** (optional, if seeders are available)

```bash
npm run seed
# or
yarn seed
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Production Mode

```bash
npm start
# or
yarn start
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Main Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update password
- `POST /api/v1/auth/forgotpassword` - Forgot password
- `PUT /api/v1/auth/resetpassword/:resettoken` - Reset password

#### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create new product (Admin)
- `PUT /api/v1/products/:id` - Update product (Admin)
- `DELETE /api/v1/products/:id` - Delete product (Admin)

#### Categories
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get single category
- `POST /api/v1/categories` - Create category (Admin)
- `PUT /api/v1/categories/:id` - Update category (Admin)
- `DELETE /api/v1/categories/:id` - Delete category (Admin)

#### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart` - Add item to cart
- `PUT /api/v1/cart/:id` - Update cart item
- `DELETE /api/v1/cart/:id` - Remove item from cart

#### Orders
- `GET /api/v1/orders` - Get all orders (Admin) / Get user orders
- `GET /api/v1/orders/:id` - Get single order
- `POST /api/v1/orders` - Create new order
- `PUT /api/v1/orders/:id` - Update order (Admin)
- `DELETE /api/v1/orders/:id` - Cancel order

#### Users (Admin only)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get single user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

For detailed API documentation with request/response examples, please refer to the [API Documentation](./docs/API.md) file.

## 📁 Project Structure

```
E-commerce-Clothing-BE_node/
├── config/              # Configuration files
│   └── database.js      # Database configuration
├── controllers/         # Route controllers
│   ├── auth.js
│   ├── products.js
│   ├── categories.js
│   ├── cart.js
│   ├── orders.js
│   └── users.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   ├── error.js
│   └── async.js
├── models/              # Database models
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   └── Order.js
├── routes/              # API routes
│   ├── auth.js
│   ├── products.js
│   ├── categories.js
│   ├── cart.js
│   ├── orders.js
│   └── users.js
├── utils/               # Utility functions
│   ├── errorResponse.js
│   ├── sendEmail.js
│   └── upload.js
├── public/              # Static files
│   └── uploads/         # Uploaded images
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore file
├── server.js            # App entry point
├── package.json         # Package dependencies
└── README.md            # This file
```

## 🧪 Testing

Run tests using:

```bash
npm test
# or
yarn test
```

## 🔧 Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database

## 🛠️ Built With

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **Sequelize** or **mysql2** - MySQL ORM/driver
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **express-validator** - Input validation
- **multer** - File upload
- **nodemailer** - Email sending

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Nom Huynh** - [nomhuynh](https://github.com/nomhuynh)

## 📞 Contact

If you have any questions or suggestions, feel free to reach out:

- GitHub: [@nomhuynh](https://github.com/nomhuynh)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Thanks to all contributors who have helped with this project
- Inspired by modern e-commerce platforms
- Built with best practices in REST API design

---

⭐️ If you find this project useful, please consider giving it a star on GitHub!