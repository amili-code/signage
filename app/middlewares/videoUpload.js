const multer = require("multer");
const path = require("path");

// تنظیمات Multer برای آپلود ویدیوها
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "app/videos/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

// فیلتر نوع فایل
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
        cb(null, true);
    } else {
        cb(new Error("فرمت فایل نامعتبر است"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
