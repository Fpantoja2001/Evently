const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// Define the User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    socialLinks: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // make this a string of array stored in json that can be parsed 
    skills: { 
        type: DataTypes.STRING,
        allowNull: true,
    },
    // make this a string of array stored in json that can be parsed 
    hobbies: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pfpImage: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
    tableName: 'users', // Explicitly define table name
});

module.exports = User;
