const EventSchedule = require("../models/EventSchedule");
const PlaylistSchedule = require("../models/PlaylistSchedule");



class eventSchedule {
    async getAll(req, res) {
        try {
            const events = await EventSchedule.findAll();
            res.json(events);
        } catch (error) {
            res.status(500).json({ message: "خطا در دریافت رویدادها", error });
        }
    }

    async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const { enabled, playlistId } = req.body;

            const event = await EventSchedule.findByPk(id);
            if (!event) return res.status(404).json({ message: "رویداد یافت نشد" });

            if (enabled && !playlistId) {
                return res.status(400).json({ message: "برای فعال کردن، یک پلی‌لیست لازم است" });
            }

            // بروز‌رسانی رویداد در جدول EventSchedule
            event.enabled = enabled;
            event.playlistId = enabled ? playlistId : null;
            await event.save();

            // اضافه یا حذف کردن رکورد در جدول PlaylistSchedule
            if (enabled) {
                // بررسی اینکه آیا قبلاً این رویداد در PlaylistSchedule ثبت شده است؟
                const existingSchedule = await PlaylistSchedule.findOne({
                    where: { date: event.shamsiDate }
                });

                // اگر هنوز برای این تاریخ رکوردی ثبت نشده، یک رکورد جدید اضافه کن
                if (!existingSchedule) {
                    await PlaylistSchedule.create({
                        date: event.shamsiDate,  // ثبت تاریخ شمسی رویداد
                        playlistId: playlistId
                    });
                }
            } else {
                // در صورتی که رویداد غیر فعال شد، رکورد مرتبط با آن از جدول PlaylistSchedule حذف شود
                await PlaylistSchedule.destroy({
                    where: { date: event.shamsiDate }
                });
            }

            res.json({ message: "رویداد بروزرسانی شد", event });
        } catch (error) {
            console.error("خطا در بروزرسانی رویداد:", error);
            res.status(500).json({ message: "خطا در بروزرسانی رویداد", error });
        }
    }

}

module.exports = new eventSchedule()