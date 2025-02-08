const  EventSchedule = require('../models/EventSchedule');

// تبدیل تاریخ هجری قمری به میلادی (روش تقریبی)
function hijriToGregorian(year, month, day) {
    const jd = Math.floor((year - 1) * 354.367) + Math.floor((year - 1) / 30) + day + [0, 30, 59, 89, 118, 148, 177, 207, 236, 266, 295, 325][month - 1] + 1948440 - 1;
    const l = jd + 68569;
    const n = Math.floor((4 * l) / 146097);
    const l2 = l - Math.floor((146097 * n + 3) / 4);
    const i = Math.floor((4000 * (l2 + 1)) / 1461001);
    const l3 = l2 - Math.floor((1461 * i) / 4) + 31;
    const j = Math.floor((80 * l3) / 2447);
    const dayG = l3 - Math.floor((2447 * j) / 80);
    const l4 = Math.floor(j / 11);
    const monthG = j + 2 - 12 * l4;
    const yearG = 100 * (n - 49) + i + l4;
    return { year: yearG, month: monthG, day: dayG };
}

// تبدیل تاریخ میلادی به شمسی (فرمول دقیق)
function gregorianToJalali(gy, gm, gd) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
    let jy = -1595 + (33 * Math.floor(days / 12053));
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return { year: jy, month: jm, day: jd };
}

const events = [
    { name: "عاشورا", hijri: "10-01", shamsi: null },
    { name: "تاسوعا", hijri: "09-01", shamsi: null },
    { name: "ولادت امام علی", hijri: "13-07", shamsi: null },
    { name: "ولادت پیامبر اکرم", hijri: "17-03", shamsi: null },
    { name: "شهادت امام حسین", hijri: "10-01", shamsi: null },
    { name: "عید فطر", hijri: "01-10", shamsi: null },
    { name: "عید قربان", hijri: "10-12", shamsi: null },
    { name: "عید غدیر", hijri: "18-12", shamsi: null },

    { name: "نوروز", hijri: null, shamsi: "1403-01-01" },
    { name: "روز جمهوری اسلامی", hijri: null, shamsi: "1403-01-12" },
    { name: "روز طبیعت", hijri: null, shamsi: "1403-01-13" },
    { name: "روز معلم", hijri: null, shamsi: "1403-02-12" },
    { name: "روز دانشجو", hijri: null, shamsi: "1403-09-16" },
    { name: "پیروزی انقلاب اسلامی", hijri: null, shamsi: "1403-11-22" },
];

async function seedEvents() {
    const currentHijriYear = 1446; // مقداردهی دستی به سال قمری جاری
    console.log(`سال قمری جاری: ${currentHijriYear}`);

    for (let event of events) {
        let shamsiDate = event.shamsi;

        if (event.hijri) {
            let [day, month] = event.hijri.split('-').map(Number);

            // تبدیل تاریخ هجری به میلادی
            let { year: gYear, month: gMonth, day: gDay } = hijriToGregorian(currentHijriYear, month, day);

            // تبدیل تاریخ میلادی به شمسی
            let { year: jYear, month: jMonth, day: jDay } = gregorianToJalali(gYear, gMonth, gDay);
            shamsiDate = `${jYear}-${String(jMonth).padStart(2, '0')}-${String(jDay).padStart(2, '0')}`;

            console.log(`✅ تبدیل شد: ${event.name} | هجری: ${currentHijriYear}-${month}-${day} | میلادی: ${gYear}-${gMonth}-${gDay} | شمسی: ${shamsiDate}`);
        }

        await EventSchedule.create({
            name: event.name,
            hijriDate: event.hijri || null,
            shamsiDate,
            enabled: false,
            playlistId: null
        });
    }
    console.log("✅ رویدادها با موفقیت اضافه شدند.");
}

module.exports = { seedEvents };
