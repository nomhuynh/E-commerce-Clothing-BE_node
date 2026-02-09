const request = require('supertest');
const express = require('express');
const healthRoute = require('../src/routes/health.route');

// Create a test app instance
const app = express();
app.use('/health', healthRoute);

describe('Health Check API', () => {
    it('should return 200 OK for GET /health', async () => {
        const response = await request(app)
            .get('/health')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('status', 'ok');
        expect(response.body).toHaveProperty('message', 'Server is healthy');
    });

    it('should return server uptime information', async () => {
        const response = await request(app).get('/health');

        expect(response.body).toHaveProperty('uptime');
        expect(typeof response.body.uptime).toBe('number');
        expect(response.body.uptime).toBeGreaterThan(0);
    });

    it('should return timestamp', async () => {
        const response = await request(app).get('/health');

        expect(response.body).toHaveProperty('timestamp');
        expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });
});
