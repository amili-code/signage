const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Video = require('./Video')

const Playlist = sequelize.define("Playlist", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    picture: { type: DataTypes.STRING, allowNull: true },
    type: {
        type: DataTypes.ENUM('main', 'ad', 'special'),
        allowNull: false,
        comment: "main: اصلی، ad: تبلیغاتی، special: مناسبتی"
    }
});

// رابطه یک به چند از طریق جدول میانی
Playlist.belongsToMany(Video, { through: "PlaylistVideo", foreignKey: "playlistId" });

module.exports = Playlist;