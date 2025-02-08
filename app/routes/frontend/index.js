const express = require("express");
const router = express.Router();

const web = require("app/web");



router.get("/", web.root.bind(web));
router.get("/login", web.login.bind(web));
router.get("/register", web.register.bind(web));

router.get("/add-user", web.addUser.bind(web));
router.get("/list-user", web.listUser.bind(web));

router.get("/add-video", web.addVideo.bind(web));
router.get("/list-video", web.listVideo.bind(web));

router.get("/add-playlist", web.addPlaylist.bind(web));
router.get("/list-playlist", web.listPlaylist.bind(web));
router.get("/list-playlist-special", web.specialPlaylist.bind(web));

router.get("/add-player", web.addPlayer.bind(web));
router.get("/list-player", web.listPlayer.bind(web));

router.get("/setting", web.setting.bind(web));

router.get("/playlist-news", web.newsPlaylist.bind(web));
router.get("/video-news", web.newsVideos.bind(web));
router.get("/user-news", web.newsUser.bind(web));

module.exports = router;