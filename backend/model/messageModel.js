const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

// Define the Messages model
const Message = sequelize.define('Messages', {
    messageId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    conversationId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    senderId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    textMessage: {
        type: DataTypes.STRING,
        allowNull: true
    },

}, {
    timestamps: true, // Adds createdAt and updatedAt
    tableName: 'message', // Explicitly define table name
});

module.exports = Message;