const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Playlist = require("./Playlist");

const PlaylistSchedule = sequelize.define("PlaylistSchedule", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
});

// تنظیم ارتباط با پلی‌لیست و حذف ورودی در صورت حذف پلی‌لیست
PlaylistSchedule.belongsTo(Playlist, { foreignKey: "playlistId", onDelete: "CASCADE" });

module.exports = PlaylistSchedule;
