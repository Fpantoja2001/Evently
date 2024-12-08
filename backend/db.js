const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite', // Use SQLite
    storage: './database.sqlite', // File path for SQLite database
    logging: false, // Disable logging for cleaner output
});

// Test the connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to SQLite database successfully.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
})();

module.exports = sequelize;
