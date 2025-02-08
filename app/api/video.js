const fs = require("fs-extra");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const Video = require("../models/Video");


class videoController {
    async upload(req, res) {
        try {
            if (!req.file) return res.status(400).json({ message: "ویدیویی آپلود نشد" });

            const videoPath = req.file.path;
            const originalName = req.file.originalname;

            // ایجاد مسیر پوشه تامبنیل در صورت نبود
            const thumbnailDir = path.join(__dirname, "../videos/thumbnails/");
            await fs.ensureDir(thumbnailDir); // ✅ ایجاد پوشه اگر وجود ندارد

            // استخراج اطلاعات ویدیو
            ffmpeg.ffprobe(videoPath, async (err, metadata) => {
                if (err) return res.status(500).json({ message: "خطا در پردازش ویدیو", error: err });

                const duration = metadata.format.duration;
                const resolution = `${metadata.streams[0].width}x${metadata.streams[0].height}`;
                const thumbnailPath = `videos/thumbnails/${originalName}.jpg`;

                // تولید تامبنیل از ثانیه 3
                ffmpeg(videoPath)
                    .screenshots({
                        timestamps: ["3"],
                        filename: path.basename(thumbnailPath),
                        folder: thumbnailDir, // 📌 مسیر صحیح فولدر
                        size: "320x240",
                    })
                    .on("end", async () => {
                        const video = await Video.create({
                            originalName,
                            title: req.body.title,
                            resolution,
                            duration,
                            thumbnail: thumbnailPath,
                        });

                        res.status(200).json({ message: "ویدیو با موفقیت آپلود شد", video });
                    })
                    .on("error", (err) => {
                        res.status(500).json({ message: "خطا در ایجاد تامبنیل", error: err });
                    });
            });
        } catch (error) {
            res.status(500).json({ message: "خطای سرور", error });
        }
    }
    async getThumbnail(req, res) {
        try {
            const { name } = req.params;
            const video = await Video.findOne({
                where: { originalName: name }
            });

            if (video) {
                res.sendFile(`app/videos/thumbnails/${name}.jpg`, { root: "." }); // ارسال عکس
            } else {
                res.status(404).json({ message: "این عکس وجود ندارد" });
            }
        } catch (error) {
            res.status(500).json({ message: "خطای سرور", error: error.message });
        }
    }



    async getAll(req, res) {
        try {
            const videos = await Video.findAll();
            res.json(videos);
        } catch (error) {
            res.status(500).json({ message: "خطا در دریافت ویدیوها", error });
        }
    }

    async getOne(req, res) {
        try {
            const video = await Video.findByPk(req.params.id);
            if (!video) return res.status(404).json({ message: "ویدیو یافت نشد" });
            res.json(video);
        } catch (error) {
            res.status(500).json({ message: "خطا در دریافت ویدیو", error });
        }
    }

    async update(req, res) {
        try {
            const { title } = req.body;
            const { id } = req.params;

            // بررسی اینکه عنوان ارسال شده خالی نباشد
            if (!title || title.trim() === "") {
                return res.status(400).json({ message: "عنوان ویدیو نمی‌تواند خالی باشد" });
            }

            // یافتن ویدیو بر اساس ID
            const video = await Video.findByPk(id);
            if (!video) {
                return res.status(404).json({ message: "ویدیو یافت نشد" });
            }

            // به‌روزرسانی عنوان و ذخیره
            video.title = title;
            await video.save();

            res.json({ message: "عنوان ویدیو بروزرسانی شد", video });
        } catch (error) {
            res.status(500).json({ message: "خطا در به‌روزرسانی ویدیو", error });
        }
    }

    async delete(req, res) {
        try {
            const video = await Video.findByPk(req.params.id);
            if (!video) return res.status(404).json({ message: "ویدیو یافت نشد" });

            // حذف فایل‌های ویدیو و تامبنیل
            await fs.remove(`app/${video.thumbnail}`);
            await fs.remove(`app/videos/${video.originalName}`);

            await video.destroy();
            res.json({ message: "ویدیو حذف شد" });
        } catch (error) {
            res.status(500).json({ message: "خطا در حذف ویدیو", error });
        }
    }

    async getVideo(req, res) {
        try {
            const { name } = req.params;
            const video = await Video.findOne({
                where: { originalName: name }
            });

            if (video) {
                res.sendFile(`app/videos/${name}`, { root: "." }); // ارسال ویدیو
            } else {
                res.status(404).json({ message: "این ویدیو وجود ندارد" });
            }
        } catch (error) {
            res.status(500).json({ message: "خطای سرور", error: error.message });
        }
    }
}

module.exports = new videoController();
