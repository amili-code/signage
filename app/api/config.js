const Config = require("../models/config");

const fs = require('fs').promises

class Confige {
    async getAll(req, res) {
        try {
            const config = await Config.findAll();
            res.status(200).json(config);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const config = await Config.findByPk(1);
            if (!config) {
                return res.status(404).json({ error: "Config not found" });
            }

            const updateData = req.body;
            if (req.file) {
                updateData.logo = req.file.path; // مسیر فایل آپلود شده
            }

            await config.update(updateData);
            res.status(200).json(config);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async pic(req, res) {
        try {
            await fs.access("app/videos/config/1.png");
            res.sendFile("app/videos/config/1.png", { root: "." });
        } catch (error) {
            // در صورت عدم وجود فایل، خطا را مدیریت کنید
            res.status(404).send('File not found');
        }
    }


    async removeLogo(req, res) {
        try {
            const config = await Config.findByPk(1);
            if (!config) {
                return res.status(404).json({ error: "Config not found" });
            }

            if (config.logo) {
                await fs.unlink(config.logo); // حذف فایل لوگو
            }

            await config.save();
            res.status(200).json(config);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }


}
module.exports = new Confige();