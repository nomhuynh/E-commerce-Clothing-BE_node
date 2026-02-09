module.exports = {
    verifyToken: jest.fn((req, res, next) => {
        req.user = { user_id: 'admin-id', role: 'ADMIN' };
        next();
    }),
    authorize: jest.fn((...roles) => (req, res, next) => next())
};
