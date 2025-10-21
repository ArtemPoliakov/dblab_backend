const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const InteractionUserResource = db.sequelize.define('InteractionUserResource', {
    interaction_user_resource_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    is_liked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        get() {
            const val = this.getDataValue('is_liked');
            if (Buffer.isBuffer(val)) return !!val[0];
            return Boolean(val);
        },
        set(v) {
            const bool = (v === true || v === '1' || v === 1 || v === 'true');
            this.setDataValue('is_liked', bool ? 1 : 0);
        }
    },

    is_viewed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        get() {
            const val = this.getDataValue('is_viewed');
            if (Buffer.isBuffer(val)) return !!val[0];
            return Boolean(val);
        },
        set(v) {
            const bool = (v === true || v === '1' || v === 1 || v === 'true');
            this.setDataValue('is_viewed', bool ? 1 : 0);
        }
    },

    is_in_view_later: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        get() {
            const val = this.getDataValue('is_in_view_later');
            if (Buffer.isBuffer(val)) return !!val[0];
            return Boolean(val);
        },
        set(v) {
            const bool = (v === true || v === '1' || v === 1 || v === 'true');
            this.setDataValue('is_in_view_later', bool ? 1 : 0);
        }
    },

    is_in_favourites: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        get() {
            const val = this.getDataValue('is_in_favourites');
            if (Buffer.isBuffer(val)) return !!val[0];
            return Boolean(val);
        },
        set(v) {
            const bool = (v === true || v === '1' || v === 1 || v === 'true');
            this.setDataValue('is_in_favourites', bool ? 1 : 0);
        }
    },

    user_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resource_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'interaction_user_resource',
    timestamps: false
});

module.exports = InteractionUserResource;