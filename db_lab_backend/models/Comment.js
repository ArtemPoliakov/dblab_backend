const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Comment = db.sequelize.define('Comment', {
    comment_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: DataTypes.STRING(800),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    creation_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    interaction_user_resource_Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'interaction_user_resource',
            key: 'interaction_user_resource_Id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    interaction_user_stack_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'comment',
    timestamps: false
});

module.exports = Comment;