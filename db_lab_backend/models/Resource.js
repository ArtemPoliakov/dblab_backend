const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Resource = db.sequelize.define('Resource', {
    resource_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 255]
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
    link_to_resource: {
        type: DataTypes.STRING(2083),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    likes_cache: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    views_cache: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    publish_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    origination_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
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
    producer: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    author_user_Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    link_type_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'resource',
    timestamps: false
});

module.exports = Resource;