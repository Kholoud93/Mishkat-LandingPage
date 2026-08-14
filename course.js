(() => {
    const chapters = [
        {
            title: "الفصل الأول: النهايات والاتصال الدراسي",
            lessons: [
                {
                    id: "l1",
                    title: "المحاضرة 1: مقدمة في حساب التفاضل والتكامل",
                    meta: "درس مسجل - 24 دقيقة",
                    active: true
                },
                {
                    id: "l2",
                    title: "المحاضرة 2: نظريات وجداول النهايات الرياضية",
                    meta: "درس مسجل - 31 دقيقة",
                    active: false
                },
                {
                    id: "l3",
                    title: "المحاضرة 3: الاتصال والنهايات اللانهائية بالحلول",
                    meta: "درس مسجل - 28 دقيقة",
                    active: false
                }
            ]
        },
        {
            title: "الفصل الثاني: قواعد الاشتقاق الأساسية",
            lessons: [
                {
                    id: "l4",
                    title: "المحاضرة 4: مفهوم المشتقة الأولى والميل المماس",
                    meta: "درس مسجل - 35 دقيقة",
                    active: false
                },
                {
                    id: "l5",
                    title: "المحاضرة 5: قاعدة السلسلة وتفاضل الدوال الضمنية",
                    meta: "درس مسجل - 42 دقيقة",
                    active: false
                }
            ]
        }
    ];

    const attachments = [
        {
            name: "ملخص قوانين النهايات والاتصال.pdf",
            size: "2.4 MB",
            date: "2026-06-12"
        },
        {
            name: "تمارين محلولة - الفصل الأول.pdf",
            size: "1.8 MB",
            date: "2026-06-10"
        },
        {
            name: "جداول التفاضل الأساسية.pdf",
            size: "960 KB",
            date: "2026-06-08"
        }
    ];

    const discussions = [
        {
            role: "teacher",
            author: "أ.د. عبد الرحمن آل سعود",
            badge: "معلم المادة",
            text: "مرحبًا بكم في محاضرة المقدمة. ركّزوا على تعريف النهاية قبل الانتقال للتمارين.",
            time: "اليوم، 09:15 ص"
        },
        {
            role: "student",
            author: "سارة الغامدي",
            badge: "",
            text: "هل يمكن توضيح الفرق بين النهاية من اليمين والنهاية من اليسار بمثال بسيط؟",
            time: "اليوم، 09:42 ص"
        },
        {
            role: "teacher",
            author: "أ.د. عبد الرحمن آل سعود",
            badge: "معلم المادة",
            text: "بالتأكيد، سأرفق مثالًا في ملف الملخص بعد انتهاء الدرس مباشرة.",
            time: "اليوم، 09:50 ص"
        }
    ];

    const chaptersRoot = document.getElementById("course-chapters");
    const filesRoot = document.getElementById("course-files");
    const chatRoot = document.getElementById("course-chat");
    const lessonTitle = document.getElementById("active-lesson-title");

    function renderChapters() {
        if (!chaptersRoot) {
            return;
        }

        chaptersRoot.innerHTML = chapters
            .map(
                (chapter) => `
            <section class="course-chapter">
                <h3 class="course-chapter__title">${chapter.title}</h3>
                <ul class="course-lessons">
                    ${chapter.lessons
                        .map(
                            (lesson) => `
                        <li>
                            <button class="course-lesson${lesson.active ? " is-active" : ""}" type="button" data-lesson-id="${lesson.id}" data-lesson-title="${lesson.title}">
                                <span class="course-lesson__icon" aria-hidden="true">
                                    <i class="ri-play-circle-line"></i>
                                </span>
                                <span class="course-lesson__copy">
                                    <span class="course-lesson__name">${lesson.title}</span>
                                    <span class="course-lesson__meta">${lesson.meta}</span>
                                </span>
                            </button>
                        </li>
                    `
                        )
                        .join("")}
                </ul>
            </section>
        `
            )
            .join("");
    }

    function renderFiles() {
        if (!filesRoot) {
            return;
        }

        filesRoot.innerHTML = `
            <div class="course-files__head" aria-hidden="true">
                <span>اسم الملف</span>
                <span>الحجم</span>
                <span>تاريخ الإضافة</span>
                <span>الإجراء</span>
            </div>
            ${attachments
                .map(
                    (file) => `
                <article class="course-file">
                    <div class="course-file__name">
                        <i class="ri-file-pdf-2-line" aria-hidden="true"></i>
                        <span>${file.name}</span>
                    </div>
                    <p class="course-file__size" data-label="الحجم">${file.size}</p>
                    <p class="course-file__date" data-label="تاريخ الإضافة">${file.date}</p>
                    <a class="btn btn-outline btn-sm course-file__download" href="#" download>
                        <i class="ri-download-2-line" aria-hidden="true"></i>
                        تحميل
                    </a>
                </article>
            `
                )
                .join("")}
        `;
    }

    function renderChat() {
        if (!chatRoot) {
            return;
        }

        chatRoot.innerHTML = discussions
            .map(
                (item) => `
            <article class="course-message course-message--${item.role}">
                <header class="course-message__head">
                    <strong>${item.author}</strong>
                    ${item.badge ? `<span class="course-message__badge">${item.badge}</span>` : ""}
                    <time>${item.time}</time>
                </header>
                <p>${item.text}</p>
            </article>
        `
            )
            .join("");
    }

    function setActiveLesson(button) {
        document.querySelectorAll(".course-lesson").forEach((item) => {
            item.classList.toggle("is-active", item === button);
        });

        if (lessonTitle && button) {
            lessonTitle.textContent = button.getAttribute("data-lesson-title") || lessonTitle.textContent;
        }
    }

    function initTabs() {
        document.querySelectorAll("[data-course-tab]").forEach((tab) => {
            tab.addEventListener("click", () => {
                document.querySelectorAll("[data-course-tab]").forEach((item) => {
                    item.classList.toggle("is-active", item === tab);
                });
            });
        });
    }

    function initLessons() {
        if (!chaptersRoot) {
            return;
        }

        chaptersRoot.addEventListener("click", (event) => {
            const button = event.target.closest(".course-lesson");

            if (!button) {
                return;
            }

            setActiveLesson(button);
        });
    }

    function initUpload() {
        const dropzone = document.querySelector("[data-dropzone]");
        const input = document.querySelector("[data-homework-file]");
        const fileName = document.querySelector("[data-file-name]");

        if (!dropzone || !input || !fileName) {
            return;
        }

        const showFile = (file) => {
            if (!file) {
                return;
            }

            const maxBytes = 10 * 1024 * 1024;
            const allowed = ["application/pdf", "image/png", "image/jpeg"];

            if (file.size > maxBytes) {
                fileName.hidden = false;
                fileName.textContent = "حجم الملف أكبر من 10MB";
                input.value = "";
                return;
            }

            if (file.type && !allowed.includes(file.type)) {
                fileName.hidden = false;
                fileName.textContent = "صيغة الملف غير مدعومة";
                input.value = "";
                return;
            }

            fileName.hidden = false;
            fileName.textContent = file.name;
        };

        dropzone.addEventListener("click", (event) => {
            if (event.target === input) {
                return;
            }

            input.click();
        });

        input.addEventListener("change", () => {
            showFile(input.files && input.files[0]);
        });

        ["dragenter", "dragover"].forEach((type) => {
            dropzone.addEventListener(type, (event) => {
                event.preventDefault();
                dropzone.classList.add("is-dragging");
            });
        });

        ["dragleave", "drop"].forEach((type) => {
            dropzone.addEventListener(type, (event) => {
                event.preventDefault();
                dropzone.classList.remove("is-dragging");
            });
        });

        dropzone.addEventListener("drop", (event) => {
            const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
            showFile(file);
        });
    }

    function initActions() {
        const completeBtn = document.querySelector("[data-complete-lesson]");
        const submitBtn = document.querySelector("[data-submit-homework]");
        const chatForm = document.querySelector("[data-chat-form]");
        const chatInput = document.getElementById("chat-input");

        if (completeBtn) {
            completeBtn.addEventListener("click", () => {
                completeBtn.classList.add("is-done");
                completeBtn.innerHTML = '<i class="ri-checkbox-circle-fill" aria-hidden="true"></i> تم تحديد الدرس كمكتمل';
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener("click", () => {
                const fileName = document.querySelector("[data-file-name]");
                if (fileName && !fileName.hidden && fileName.textContent) {
                    submitBtn.textContent = "تم إرسال الواجب";
                    submitBtn.disabled = true;
                } else {
                    submitBtn.textContent = "يرجى اختيار ملف أولاً";
                    window.setTimeout(() => {
                        submitBtn.textContent = "إرسال الواجب وتأكيد التسليم";
                    }, 1800);
                }
            });
        }

        if (chatForm && chatInput && chatRoot) {
            chatForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const value = chatInput.value.trim();

                if (!value) {
                    return;
                }

                const article = document.createElement("article");
                article.className = "course-message course-message--student";
                article.innerHTML = `
                    <header class="course-message__head">
                        <strong>أنت</strong>
                        <time>الآن</time>
                    </header>
                    <p></p>
                `;
                article.querySelector("p").textContent = value;
                chatRoot.append(article);
                chatInput.value = "";
                chatRoot.scrollTop = chatRoot.scrollHeight;
            });
        }
    }

    renderChapters();
    renderFiles();
    renderChat();
    initTabs();
    initLessons();
    initUpload();
    initActions();
})();
