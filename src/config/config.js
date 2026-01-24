require('dotenv').config();

const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER ,
        password: process.env.DB_PASSWORD ,
        name: process.env.DB_NAME 
    },
};

module.exports = config;
