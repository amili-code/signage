const PlaylistSchedule = require("../models/PlaylistSchedule");
const Playlist = require("../models/Playlist");
const Video = require("../models/Video");

class PlaylistScheduleController{
    async create(req, res) {
        try {
            const { date, playlistId } = req.body;

            // بررسی وجود پلی‌لیست
            const playlist = await Playlist.findByPk(playlistId);
            if (!playlist) return res.status(404).json({ message: "پلی‌لیست یافت نشد" });

            // ایجاد ورودی جدید
            const schedule = await PlaylistSchedule.create({ date, playlistId });

            res.status(201).json({ message: "برنامه پخش ذخیره شد", schedule });

        } catch (error) {
            res.status(500).json({ message: "خطا در ذخیره برنامه پخش", error });
        }
    }

    async getByDate(req, res) {
        try {
            const { date } = req.params;

            const schedules = await PlaylistSchedule.findAll({
                where: { date },
                include: {
                    model: Playlist,
                    include: {
                        model: Video, // نمایش ویدیوهای داخل پلی‌لیست
                        through: { attributes: ["order"] }
                    }
                },
            });

            res.json(schedules);
        } catch (error) {
            res.status(500).json({ message: "خطا در دریافت برنامه پخش", error });
        }
    }

    async getAll(req, res) {
        try {
            const schedules = await PlaylistSchedule.findAll({
                include: {
                    model: Playlist,
                    include: {
                        model: Video, // نمایش ویدیوهای داخل پلی‌لیست
                        through: { attributes: [] }
                    }
                }
            });

            res.json(schedules);
        } catch (error) {
            console.error("خطا در دریافت بازه‌های زمانی:", error); // نمایش جزئیات خطا در لاگ
            res.status(500).json({ message: "خطا در دریافت بازه‌های زمانی", error: error.message || error });
        }
    }



    async delete(req, res) {
        try {
            const { id } = req.params;
            const schedule = await PlaylistSchedule.findByPk(id);
            if (!schedule) return res.status(404).json({ message: "برنامه پخش یافت نشد" });

            await schedule.destroy();
            res.json({ message: "برنامه پخش حذف شد" });

        } catch (error) {
            res.status(500).json({ message: "خطا در حذف برنامه پخش", error });
        }
    }
}

module.exports = new PlaylistScheduleController()