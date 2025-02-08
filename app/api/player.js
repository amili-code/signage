const Player = require("../models/Player")



class player{
    async create(req, res) {
        try {
            const player = await Player.create(req.body);
            res.status(201).json(player);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const players = await Player.findAll();
            res.status(200).json(players);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getOne(req, res) {
        try {
            const player = await Player.findByPk(req.params.id);
            if (!player) {
                return res.status(404).json({ error: "Player not found" });
            }
            res.status(200).json(player);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const player = await Player.findByPk(req.params.id);
            if (!player) {
                return res.status(404).json({ error: "Player not found" });
            }
            await player.update(req.body);
            res.status(200).json(player);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) { 
        try {
            const player = await Player.findByPk(req.params.id);
            if (!player) {
                return res.status(404).json({ error: "Player not found" });
            }
            await player.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new player()