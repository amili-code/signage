const { verifyToken } = require('../config/auth');
const UserLog = require('../models/UserLog');

const activityLogger = async (req, res, next) => {
    try {
        // چک کردن متدهای مربوط به تغییرات دیتابیس
        const methods = ['POST', 'PUT', 'DELETE'];
        if (!methods.includes(req.method)) {
            return next();
        }

        // استخراج یوزر از توکن
        const token = req.session.token;
        const userData = verifyToken(token);

        if (!userData || !userData.id) {
            return next(); // اگر توکن معتبر نبود، ادامه بده بدون ذخیره لاگ
        }

        // تعیین نوع عملیات
        let actionType = '';
        if (req.method === 'POST') actionType = 'ایجاد';
        if (req.method === 'PUT') actionType = 'ویرایش';
        if (req.method === 'DELETE') actionType = 'حذف';

        // استخراج نام جدول از مسیر API
        const pathSegments = req.originalUrl.split('/').filter(segment => segment && segment !== 'api');
        const tableName = pathSegments[0]; // اولین بخش آدرس بعد از `/api/`

        // ایجاد توضیحات لاگ
        const description = `کاربر ${userData.name} اقدام به ${actionType} در جدول ${tableName} کرد.`;

        // ذخیره لاگ در دیتابیس
        await UserLog.create({
            userId: userData.id,
            description: description,
        });

        next();
    } catch (error) {
        console.error("خطا در ذخیره لاگ کاربر:", error);
        next();
    }
};

module.exports = activityLogger;
