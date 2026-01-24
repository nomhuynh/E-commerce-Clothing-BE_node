const express = require('express');
const { notFound, errorHandler } = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
