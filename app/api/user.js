const User = require('../models/User');
const UserLog = require('../models/UserLog');
const { hashPassword, generateToken, comparePassword } = require('../config/auth');

class userController {
    async register(req, res) {
        try {
            // هش کردن پسورد قبل از ذخیره در دیتابیس
            req.body.password = await hashPassword(req.body.password);

            // ایجاد کاربر جدید
            const user = await User.create(req.body);

            // تولید توکن JWT
            const token = generateToken(user);
            // req.session.token = token
            // res.redirect('/')
            res.status(200).json({ message: "کاربر ایجاد شد", user, token });
        } catch (error) {
            res.status(400).json({ message: "خطا در ایجاد کاربر", error });
        }
    }


    async newUser(req, res) {
        try {
            // هش کردن پسورد قبل از ذخیره در دیتابیس
            req.body.password = await hashPassword(req.body.password);

            // ایجاد کاربر جدید
            const user = await User.create(req.body);

            // تولید توکن JWT
            const token = generateToken(user);
            req.session.token = token
            res.redirect('/')
        } catch (error) {
            res.status(400).json({ message: "خطا در ایجاد کاربر", error });
        }
    }

    async logout(req, res) {
        req.session.token = ''
        res.redirect('/')
    }

    async login(req, res) {
        try {
            const { name, email, password } = req.body;
            // جستجوی کاربر بر اساس نام و ایمیل
            const user = await User.findOne({ where: { name } });
            if (!user) return res.status(404).json({ message: "کاربر یافت نشد یا اطلاعات اشتباه است" });

            // بررسی رمز عبور

            const isValidPassword = await comparePassword(password, user.password);
            if (!isValidPassword) return res.status(401).json({ message: "رمز عبور اشتباه است" });

            // تولید توکن JWT
            const token = generateToken(user);
            req.session.token = token
            res.redirect('/')

            // res.json({ message: "ورود موفقیت‌آمیز بود", token });

        } catch (error) {
            res.status(500).json({ message: "خطا در ورود", error });
        }
    }

    async getAll(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "خطا در دریافت کاربران", error });
        }
    }


    async getOne(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "خطا در دریافت کاربر", error });
        }
    }
    async update(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });

            await user.update(req.body);
            res.json({ message: "کاربر بروزرسانی شد", user });
        } catch (error) {
            res.status(400).json({ message: "خطا در بروزرسانی کاربر", error });
        }
    }

    // حذف کاربر
    async delete(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });

            await user.destroy();
            res.json({ message: "کاربر حذف شد" });
        } catch (error) {
            res.status(500).json({ message: "خطا در حذف کاربر", error });
        }
    }

    async getAllLog(req, res) {
        try {
            const userLog = await UserLog.findAll()
            res.json(userLog)
        } catch (error) {
            res.status(500).json({ message: "خطا در دریافت کاربران", error });
        }
    }

    async getOneLog(req, res) {
        try {
            const userLogs = await UserLog.findAll({
                where: { userId: req.params.id },
                order: [['createdAt', 'DESC']] // مرتب‌سازی از جدیدترین به قدیمی‌ترین
            });

            if (!userLogs.length) {
                return res.status(404).json({ message: "هیچ فعالیتی برای این کاربر یافت نشد" });
            }

            res.json(userLogs);
        } catch (error) {
            res.status(500).json({ message: "خطا در دریافت فعالیت‌های کاربر", error });
        }
    }

}

module.exports = new userController();
