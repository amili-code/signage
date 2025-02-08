const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Video = require("./Video");
const Playlist = require("./Playlist");

const PlaylistVideo = sequelize.define("PlaylistVideo", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    playlistId: { type: DataTypes.INTEGER, references: { model: Playlist, key: "id" } },
    videoId: { type: DataTypes.INTEGER, references: { model: Video, key: "id" } },
    order: { type: DataTypes.INTEGER, allowNull: false }, // ترتیب ویدیو
});

// تنظیم روابط
Playlist.belongsToMany(Video, { through: PlaylistVideo, foreignKey: "playlistId" });
Video.belongsToMany(Playlist, { through: PlaylistVideo, foreignKey: "videoId" });

module.exports = PlaylistVideo;
