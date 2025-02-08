const multer = require("multer");
const path = require("path");

// تنظیمات ذخیره‌سازی فایل‌ها
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "app/videos/config"); // ذخیره در پوشه‌ی مشخص
    },
    filename: (req, file, cb) => {
        cb(null, "1.png"); // تغییر نام فایل
    },
});

// فیلتر نوع فایل (فقط تصاویر مجازند)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("فرمت فایل معتبر نیست! فقط jpg, png, gif مجازند"), false);
    }
};

// تنظیمات Multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
