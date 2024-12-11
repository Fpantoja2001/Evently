const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

//Define the review model
const Review = sequelize.define('Review', {
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reviewId: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    eventName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true, // Adds createdAt
    tableName: 'review', // Explicitly define table name
});

module.exports = Review;