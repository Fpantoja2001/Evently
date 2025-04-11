const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');



// Generate Verification Code
function generateSixCharCode() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
}

// Defines the Verification model
const Verification = sequelize.define('Verification', {
    verificationId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    verificationCode: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: generateSixCharCode
    },
    verificationRequester: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, 
{
    timestamps: true, // Adds createdAt and updatedAt
    tableName: '', // Explicitly define table name
});

module.exports = Verification ;
