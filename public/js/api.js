async function fetchData() {
    document.querySelectorAll("[root]").forEach(async (element) => {
        const root = element.getAttribute("root");
        const method = element.getAttribute("method") || "GET";
        const bodyAttr = element.getAttribute("body");
        const count = element.getAttribute("count") === "true";

        let body = null;
        if (bodyAttr && method.toUpperCase() !== "GET") {
            try {
                body = JSON.stringify(Object.fromEntries(bodyAttr.split(",").map(item => item.split(":"))));
            } catch (error) {
                console.error("Error parsing body attribute", error);
            }
        }

        try {
            const response = await fetch(`http://localhost:5000/api${root}`, {
                method: method.toUpperCase(),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer YOUR_TOKEN_HERE" // تغییر در صورت نیاز
                },
                body: method.toUpperCase() === "GET" ? null : body
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            element.innerText = count ? data.length : JSON.stringify(data, null, 2); // نمایش داده یا تعداد اعضا
        } catch (error) {
            console.error("Error fetching data", error);
            element.innerText = "خطا در دریافت اطلاعات";
        }
    });
}


function createApiSender() {
    document.querySelectorAll("form").forEach((form) => {
        if (!form.id == "playlistForm") {
            form.addEventListener("submit", async function (event) {
                event.preventDefault(); // جلوگیری از ارسال فرم به صفحه دیگر

                // بررسی وجود input از نوع فایل
                const hasFileInput = form.querySelector('input[type="file"]');

                const url = form.getAttribute("action");
                const method = form.getAttribute("method").toUpperCase();

                // اگر فرم فایل دارد
                if (hasFileInput) {
                    const formData = new FormData(form);

                    // نمایش انیمیشن لودینگ
                    document.getElementById("loadingSpinner").style.display = "block";

                    try {
                        const response = await fetch(url, {
                            method: method,
                            body: formData,
                        });

                        const result = await response.json();
                        showAlert(response.status === 200, result.message || "عملیات با موفقیت انجام شد!");

                        if (response.status === 200) {
                            form.reset(); // پاک کردن فرم پس از ارسال موفق
                        }
                    } catch (error) {
                        showAlert(false, "مشکلی در ارتباط با سرور پیش آمد.");
                    } finally {
                        // مخفی کردن انیمیشن لودینگ پس از دریافت پاسخ
                        document.getElementById("loadingSpinner").style.display = "none";
                    }
                } else {
                    // فرم بدون فایل: ارسال داده‌ها به صورت JSON
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());

                    try {
                        const response = await fetch(url, {
                            method: method,
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        });

                        const result = await response.json();
                        showAlert(response.status === 200, result.message || "عملیات با موفقیت انجام شد!");

                        if (response.status === 200) {
                            form.reset(); // پاک کردن فرم پس از ارسال موفق
                        }
                    } catch (error) {
                        showAlert(false, "مشکلی در ارتباط با سرور پیش آمد.");
                    }
                }
            });
        }
    });
}




function showAlert(success, message) {
    const alertBox = document.createElement("h1");
    if (success)
        alertBox.innerHTML = `<button type="button" class="btn btn-success btn-lg btn-block">${message}</button>`;
    else
        alertBox.innerHTML = `<button type="button" class="btn btn-danger btn-lg btn-block">${message}</button>`;
    document.getElementById("addUser").prepend(alertBox); // نمایش در بالای صفحه
    // setTimeout(() => alertBox.remove(), 5000); // حذف خودکار پس از 5 ثانیه
}


document.addEventListener("DOMContentLoaded", fetchData);
document.addEventListener("DOMContentLoaded", createApiSender);