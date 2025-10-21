const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const RatingResource = db.sequelize.define('RatingResource', {
    rating_position: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    resource_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'ratingResource',
    timestamps: false
});

module.exports = RatingResource;