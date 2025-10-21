const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Stack = db.sequelize.define('Stack', {
    stack_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 8000]
        }
    },
    likes_cache: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    views_cache: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    creation_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_recommended: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    author_user_Id: {
        type: DataTypes.INTEGER,
        allowNull: true    
    }
}, {
    tableName: 'stack',
    timestamps: false
});

module.exports = Stack;