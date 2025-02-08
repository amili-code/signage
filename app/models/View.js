const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Video = require('./Video');
const Player = require('./Player');

const View = sequelize.define("View", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    playCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

// تعریف روابط
View.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });
View.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });

module.exports = View;