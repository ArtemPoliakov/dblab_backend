const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Rating = db.sequelize.define('Rating', {
    rating_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rating_authority_link: {
        type: DataTypes.STRING(2083),
        allowNull: false
    },
    publish_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    forming_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    tableName: 'rating',
    timestamps: false
});

module.exports = Rating;
