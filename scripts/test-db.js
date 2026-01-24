const db = require('../src/config/database');
const config = require('../src/config/config');

async function testConnection() {
    console.log(`Attempting to connect to database: ${config.db.name} at ${config.db.host}...`);
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        console.log('✅ Database connection successful! Test query result:', rows[0].solution);
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('Hint: Make sure your MySQL server is running.');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Hint: Check your username and password in .env file.');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error(`Hint: Make sure the database "${config.db.name}" exists.`);
        }
        process.exit(1);
    }
}

testConnection();
