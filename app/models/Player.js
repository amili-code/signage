const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Player = sequelize.define("Player", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    mac: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,

    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
});

module.exports = Player;