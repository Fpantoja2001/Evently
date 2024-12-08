const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// Define the Event model
const Event = sequelize.define('Event', {
    eventid: {
        type: DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true,
    },
    eventName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eventDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    eventTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    privacy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    inviteOption: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    eventLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    eventCategory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reservation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    eventCreator: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eventAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eventDescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eventImage: {
        type: DataTypes.BLOB,
        allowNull: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
    tableName: 'events', // Explicitly define table name
});

module.exports = Event;
