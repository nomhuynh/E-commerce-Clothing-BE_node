const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');

const registerUser = async (data) => {
    const {
        email,
        password,
        first_name,
        last_name,
        phone_number,
        gender,
        date_of_birth
    } = data;

    // Validate required fields
    if (!email || !password || !first_name || !last_name) {
        const error = new Error('Missing required fields: email, password, first_name, last_name');
        error.status = 400;
        throw error;
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        const error = new Error('Email already in use');
        error.status = 409; // Conflict
        throw error;
    }

    // Check phone number if provided (since it's unique in model)
    if (phone_number) {
        const existingPhone = await User.findOne({ where: { phone_number } });
        if (existingPhone) {
            const error = new Error('Phone number already in use');
            error.status = 409;
            throw error;
        }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
        email,
        password_hash,
        first_name,
        last_name,
        phone_number,
        gender,
        date_of_birth,
        role: 'CUSTOMER', // Default role for registration
        status: 'ACTIVE'
    });

    // Convert to JSON and remove sensitive data
    const userResponse = newUser.toJSON();
    delete userResponse.password_hash;
    delete userResponse.deleted_at;

    return userResponse;
};

const loginUser = async ({ email, password }) => {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        const error = new Error('Invalid email or password');
        error.status = 401; // Unauthorized
        throw error;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        const error = new Error('Invalid email or password');
        error.status = 401; // Unauthorized
        throw error;
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
        const error = new Error('User account is not active');
        error.status = 403; // Forbidden
        throw error;
    }

    // Generate JWT Token
    const payload = {
        user_id: user.user_id,
        role: user.role
    };

    const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    });

    // Update last login
    user.last_login_at = new Date();
    await user.save();

    // Prepare response
    const userResponse = user.toJSON();
    delete userResponse.password_hash;
    delete userResponse.deleted_at;

    return {
        user: userResponse,
        token
    };
};

module.exports = {
    registerUser,
    loginUser
};
