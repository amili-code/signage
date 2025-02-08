const { DataTypes  , Model} = require('sequelize');
const { sequelize } = require('../config/database');



class TimeRange extends Model { }

TimeRange.init(
    {
        dayOfWeek: {
            type: DataTypes.INTEGER, // 0: شنبه, 1: یک‌شنبه, ..., 6: جمعه
            allowNull: false,
        },
        startTime: {
            type: DataTypes.TIME, // زمان شروع
            allowNull: false,
        },
        endTime: {
            type: DataTypes.TIME, // زمان پایان
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "TimeRange",
    }
);



module.exports = { TimeRange };