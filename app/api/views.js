const View = require('../models/View');
const Video = require('../models/Video');
const Player = require('../models/Player');

class Views{
    async create(req, res) {
        try {
            const { date, playerId, videoId, playCount } = req.body;

            // بررسی وجود پلیر و ویدیو
            const player = await Player.findByPk(playerId);
            const video = await Video.findByPk(videoId);

            if (!player || !video) {
                return res.status(404).json({ error: "Player or Video not found" });
            }

            // ایجاد رکورد جدید
            const view = await View.create({
                date,
                playerId,
                videoId,
                playCount
            });

            res.status(201).json(view);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const { date, playerId, videoId } = req.query;

            let whereClause = {};
            if (date) whereClause.date = date;
            if (playerId) whereClause.playerId = playerId;
            if (videoId) whereClause.videoId = videoId;

            const views = await View.findAll({
                where: whereClause,
                include: [
                    { model: Video, as: "video" },
                    { model: Player, as: "player" }
                ]
            });

            res.json(views);
        } catch (error) {
            res.status(500).json({ message: "خطا در دریافت ویوها", error });
        }
    }

}

module.exports = new Views();