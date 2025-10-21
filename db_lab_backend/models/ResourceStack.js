const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const ResourceStack = db.sequelize.define('ResourceStack', {
    resource_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    stack_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'resourceStack',
    timestamps: false
});

module.exports = ResourceStack;