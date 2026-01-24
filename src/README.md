# Project Structure

- **src/config**: Environment variables and configuration setup.
- **src/controllers**: Logic for handling requests and sending responses.
- **src/models**: Database models (schemas).
- **src/routes**: API route definitions.
- **src/services**: Business logic and complex operations.
- **src/middlewares**: Express middlewares (auth, validation, error handling).
- **src/utils**: Helper functions and utilities.
- **src/validations**: Request input validation schemas (e.g., Joi, Zod).
- **src/constants**: Constant values used across the application.
- **src/database**: Database connection and initialization scripts.

## Getting Started

1. Copy `.env.example` to `.env` and fill in your details.
2. Run `npm install`.
3. Run `npm run dev` to start the development server.
