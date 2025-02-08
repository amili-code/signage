const { sequelize, connectDB } = require('./database');
const User = require('../models/User')
const Video = require('../models/Video')
const Playlist = require('../models/Playlist')
const PlaylistVideo = require('../models/PlaylistVideo')
const Schedule = require('../models/Schedule')
const PlaylistSchedule = require('../models/PlaylistSchedule')
const EventSchedule = require('../models/EventSchedule')
const Player = require('../models/Player')
const config = require('../models/config')
const UserLog = require('../models/UserLog')

async function syncDatabase() {
    await connectDB();

    try {
        await sequelize.sync({ alter: true }); // ایجاد یا آپدیت جداول
        console.log("✅ جداول دیتابیس با موفقیت همگام‌سازی شد.");
        process.exit();
    } catch (error) {
        console.error("❌ خطا در همگام‌سازی دیتابیس:", error);
        process.exit(1);
    }
}

module.exports = { syncDatabase };
