const { TimeRange } = require("../models/Schedule")





class timeRangesController {
    async create(req, res) {
        try {
            const { dayOfWeek, startTime, endTime } = req.body;

            const timeRange = await TimeRange.create({ dayOfWeek, startTime, endTime });

            res.status(201).json({ message: "بازه‌ی زمانی ایجاد شد", timeRange });
        } catch (error) {
            res.status(500).json({ message: "خطا در ایجاد بازه‌ی زمانی", error });
        }
    }

    async getAll(req, res) {
        try {
            const timeRanges = await TimeRange.findAll();
            res.json(timeRanges);
        } catch (error) {
            res.status(500).json({ message: "خطا در دریافت بازه‌های زمانی", error });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { dayOfWeek, startTime, endTime } = req.body;

            const timeRange = await TimeRange.findByPk(id);
            if (!timeRange) return res.status(404).json({ message: "بازه‌ی زمانی یافت نشد" });

            timeRange.dayOfWeek = dayOfWeek ?? timeRange.dayOfWeek;
            timeRange.startTime = startTime ?? timeRange.startTime;
            timeRange.endTime = endTime ?? timeRange.endTime;

            await timeRange.save();
            res.json({ message: "بازه‌ی زمانی بروزرسانی شد", timeRange });
        } catch (error) {
            res.status(500).json({ message: "خطا در بروزرسانی بازه‌ی زمانی", error });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;  
            await TimeRange.destroy({ where: { id } });
            res.json({ message: "بازه‌ی زمانی حذف شد" });
        } catch (error) {
            res.status(500).json({ message: "خطا در حذف بازه‌ی زمانی", error });
        }
    }
}


module.exports = new timeRangesController()