const express = require("express");
const router = express.Router();
const videoUpload = require('../../middlewares/videoUpload')
const picUpload = require('../../middlewares/picUpload')
const configUpload = require('../../middlewares/configUpload')
const activityLogger = require("../../middlewares/userLogger")




const apiController = require("app/api");
const userController = require("app/api/user");
const videoController = require("app/api/video");
const playlistController = require("app/api/playlist");
const timeRangesController = require("app/api/timeRanges");
const PlaylistScheduleController = require("app/api/PlaylistSchedule");
const eventScheduleController = require("app/api/eventSchedule");
const playerController = require("app/api/player");
const configController = require("app/api/config");
const viewsController = require("app/api/views");

router.post('/register', userController.register.bind(userController))
router.post('/new-user', userController.newUser.bind(userController))
router.post('/login', userController.login.bind(userController))
router.get('/logout', userController.logout.bind(userController))


router.use(activityLogger);

router.get('/user', userController.getAll.bind(userController))
router.get('/user-log', userController.getAllLog.bind(userController))
router.get('/user/:id', userController.getOne.bind(userController))
router.get('/user-log/:id', userController.getOneLog.bind(userController))
router.put('/user/:id', userController.update.bind(userController))
router.delete('/user/:id', userController.delete.bind(userController))

router.post('/video', videoUpload.single('video') ,videoController.upload.bind(videoController))
router.get('/video',videoController.getAll.bind(videoController))
router.get('/thumbnail/:name', videoController.getThumbnail.bind(videoController))
router.get('/video/:id',videoController.getOne.bind(videoController))
router.put('/video/:id',videoController.update.bind(videoController))
router.delete('/video/:id',videoController.delete.bind(videoController))
router.get('/vid/:name',videoController.getVideo.bind(videoController))

router.post("/playlist", picUpload.single('image') ,playlistController.create.bind(playlistController));
router.get("/playlist", playlistController.getAll.bind(playlistController));
router.get("/playlist/:id", playlistController.getById.bind(playlistController));
router.post("/playlist/add-video", playlistController.addVideo.bind(playlistController));
router.post("/playlist/remove-video", playlistController.removeVideo.bind(playlistController));
router.put("/playlist/update-order", playlistController.updateOrder.bind(playlistController));
router.delete("/playlist/:id", playlistController.delete.bind(playlistController));
router.put("/playlist/:id", playlistController.updatePlaylist.bind(playlistController));
router.put("/playlist/:id", picUpload.single("image"), playlistController.update.bind(playlistController));


router.post('/timeranges', timeRangesController.create.bind(timeRangesController))
router.get('/timeranges', timeRangesController.getAll.bind(timeRangesController))
router.put('/timeranges/:id', timeRangesController.update.bind(timeRangesController))
router.delete('/timeranges/:id', timeRangesController.delete.bind(timeRangesController))


router.post('/schedule', PlaylistScheduleController.create.bind(PlaylistScheduleController))
router.get('/schedule', PlaylistScheduleController.getAll.bind(PlaylistScheduleController))
router.get('/schedule/:date', PlaylistScheduleController.getByDate.bind(PlaylistScheduleController))
router.delete('/schedule/:id', PlaylistScheduleController.delete.bind(PlaylistScheduleController))

router.get('/eventSchedule', eventScheduleController.getAll.bind(eventScheduleController))
router.put('/eventSchedule/:id', eventScheduleController.updateEvent.bind(eventScheduleController))


router.post('/player', playerController.create.bind(playerController))
router.get('/player', playerController.getAll.bind(playerController))
router.get('/player/:id', playerController.getOne.bind(playerController))
router.put('/player/:id', playerController.update.bind(playerController))
router.delete('/player/:id', playerController.delete.bind(playerController))

router.get('/config', configController.getAll.bind(configController))
router.get('/config/pic/:name', configController.pic.bind(configController))
router.put('/config', configUpload.single('logo'),configController.update.bind(configController))
router.delete('/config', configController.removeLogo.bind(configController))

router.post('/view', viewsController.create.bind(viewsController))
router.get('/view', viewsController.getAll.bind(viewsController))


module.exports = router;
