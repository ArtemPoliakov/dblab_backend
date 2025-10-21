const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const LinkType = db.sequelize.define('LinkType', {
    link_type_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    link_type_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    tableName: 'link_type',
    timestamps: false
});

module.exports = LinkType;