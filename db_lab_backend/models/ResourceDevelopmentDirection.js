const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const ResourceDevelopmentDirection = db.sequelize.define('ResourceDevelopmentDirection', {
    resource_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    development_direction_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'resourceDevelopment_direction',
    timestamps: false
});

module.exports = ResourceDevelopmentDirection;