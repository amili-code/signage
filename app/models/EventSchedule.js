const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Playlist = require('./Playlist');

const EventSchedule = sequelize.define('EventSchedule', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    hijriDate: { type: DataTypes.STRING, allowNull: true }, // فقط برای رویدادهای اسلامی
    shamsiDate: { type: DataTypes.STRING, allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    playlistId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Playlists', key: 'id' },
        onDelete: 'SET NULL'
    }
});

module.exports = EventSchedule;
