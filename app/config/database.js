require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false, // جلوگیری از نمایش کوئری‌ها در لاگ
    }
);

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("✅ اتصال به دیتابیس برقرار شد.");
    } catch (error) {
        console.error("❌ خطا در اتصال به دیتابیس:", error);
    }
}

module.exports = { sequelize, connectDB };
