const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

// Define the Conversations model
const Conversations = sequelize.define('Conversations', {
    conversationId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    members: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, 
{
    timestamps: true, // Adds createdAt and updatedAt
    tableName: 'conversations', // Explicitly define table name
});

module.exports = Conversations;
