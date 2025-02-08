const Playlist = require("../models/Playlist");
const Video = require("../models/Video");
const PlaylistVideo = require("../models/PlaylistVideo");

class playlistController {
    async create(req, res) {
        try {
            const { name, type, videos } = req.body;
            const picture = req.file ? `videos/playlists/${req.file.filename}` : null;

            const playlist = await Playlist.create({ name, type, picture });

            if (videos && videos.length > 0) {
                await Promise.all(videos.map(async (videoId, i) => {
                    const videoExists = await Video.findByPk(videoId);
                    if (!videoExists) {
                        throw new Error(`ویدیو با ID ${videoId} یافت نشد`);
                    }
                    await PlaylistVideo.create({ playlistId: playlist.id, videoId, order: i + 1 });
                }));
            }
            
            res.status(200).json({ message: "پلی‌لیست ایجاد شد", playlist });
        } catch (error) {
            res.status(500).json({ message: "خطا در ایجاد پلی‌لیست", error });
        }
    }

   async  updatePlaylist(req, res) {
    try {
        const { id } = req.params;
        const { name, type } = req.body;
        const playlist = await Playlist.findByPk(id);
        if (!playlist) return res.status(404).json({ message: "پلی‌لیست یافت نشد" });

        if (name) playlist.name = name;
        if (type) playlist.type = type;
        if (req.file) {
            if (playlist.picture) fs.unlinkSync(playlist.picture);
            playlist.picture = `uploads/playlists/${req.file.filename}`;
        }

        await playlist.save();
        res.json({ message: "پلی‌لیست بروزرسانی شد", playlist });
    } catch (error) {
        res.status(500).json({ message: "خطا در بروزرسانی پلی‌لیست", error });
    }
}

    // ✅ دریافت تمام پلی‌لیست‌ها همراه با ویدیوهایشان
    async getAll(req, res) {
        try {
            const playlists = await Playlist.findAll({
                include: {
                    model: Video,
                    through: { attributes: ["order"] },
                    order: [[PlaylistVideo, "order", "ASC"]],
                },
            });
            res.json(playlists);
        } catch (error) {
            res.status(500).json({ message: "خطا در دریافت پلی‌لیست‌ها", error });
        }
    }

    // ✅ دریافت یک پلی‌لیست همراه با ویدیوهای داخل آن
    async getById(req, res) {
        try {
            const { id } = req.params;
            const playlist = await Playlist.findByPk(id, {
                include: {
                    model: Video,
                    through: { attributes: ["order"] },
                    order: [[PlaylistVideo, "order", "ASC"]],
                },
            });

            if (!playlist) return res.status(404).json({ message: "پلی‌لیست یافت نشد" });

            res.json(playlist);
        } catch (error) {
            res.status(500).json({ message: "خطا در دریافت پلی‌لیست", error });
        }
    }

    // ✅ اضافه کردن ویدیو به پلی‌لیست
    async addVideo(req, res) {
        try {
            const { playlistId, videoIds } = req.body;

            // بررسی وجود پلی‌لیست
            const playlist = await Playlist.findByPk(playlistId);
            if (!playlist) return res.status(404).json({ message: "پلی‌لیست یافت نشد" });

            const newVideos = [];
            for (const videoId of videoIds) {
                const video = await Video.findByPk(videoId);
                if (!video) continue;

                // دریافت تعداد ویدیوهای داخل پلی‌لیست و تنظیم ترتیب جدید
                const count = await PlaylistVideo.count({ where: { playlistId } });
                await PlaylistVideo.create({ playlistId, videoId, order: count + 1 });
                newVideos.push(video);
            }

            res.json(newVideos);
        } catch (error) {
            res.status(500).json({ message: "خطا در اضافه کردن ویدیو", error });
        }
    }

    // ✅ حذف ویدیو از پلی‌لیست
    async removeVideo(req, res) {
        try {
            const { playlistId, videoId } = req.body;
            await PlaylistVideo.destroy({ where: { playlistId, videoId } });
            res.json({ message: "ویدیو از پلی‌لیست حذف شد" });
        } catch (error) {
            res.status(500).json({ message: "خطا در حذف ویدیو", error });
        }
    }

    // ✅ حذف پلی‌لیست
    async delete(req, res) {
        try {
            const { id } = req.params;
            await Playlist.destroy({ where: { id } });
            res.json({ message: "پلی‌لیست حذف شد" });
        } catch (error) {
            res.status(500).json({ message: "خطا در حذف پلی‌لیست", error });
        }
    }

    // ✅ تغییر ترتیب ویدیوها در پلی‌لیست
    async updateOrder(req, res) {
        try {
            const { playlistId, videos } = req.body; // videos: [{ videoId, order }]
            for (const video of videos) {
                await PlaylistVideo.update({ order: video.order }, { where: { playlistId, videoId: video.videoId } });
            }
            res.json({ message: "ترتیب ویدیوها تغییر کرد" });
        } catch (error) {
            res.status(500).json({ message: "خطا در تغییر ترتیب ویدیوها", error });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            // پیدا کردن پلی‌لیست بر اساس ID
            const playlist = await Playlist.findByPk(id);
            if (!playlist) return res.status(404).json({ message: "پلی‌لیست یافت نشد" });

            // بررسی تغییرات در نام
            if (name) playlist.name = name;

            // بررسی و مدیریت عکس جدید
            if (req.file) {
                // اگر پلی‌لیست قبلاً عکس داشت، حذف آن
                if (playlist.picture) {
                    const oldPicturePath = path.join(__dirname, '..', playlist.picture);
                    if (fs.existsSync(oldPicturePath)) {
                        fs.unlinkSync(oldPicturePath); // حذف عکس قبلی
                    }
                }
                // افزودن عکس جدید به آدرس
                playlist.picture = `videos/playlists/${req.file.filename}`;
            }
            // ذخیره تغییرات در دیتابیس
            await playlist.save();
            res.json({ message: "پلی‌لیست بروزرسانی شد", playlist });

        } catch (error) {
            res.status(500).json({ message: "خطا در بروزرسانی پلی‌لیست", error });
        }
    }
}

module.exports = new playlistController()