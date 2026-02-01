var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// =============================
// ✅ 1日1タスク用データ
// =============================
var dailyTasks = [
    { ja: "靴下をいつもと違う色に", en: "Wear socks of a different color than usual" },
    { ja: "5分だけ暗い部屋で瞑想", en: "Meditate in a dark room for 5 minutes" },
    { ja: "机に小さな不思議アイテムを置く", en: "Place a small, mysterious item on your desk" },
    { ja: "普段使わないペンでメモ", en: "Take notes with a pen you don't usually use" },
    { ja: "通勤ルートで新しい店をチェック", en: "Check out a new shop on your commute" },
    { ja: "机の引き出しにメモを置く", en: "Leave a note inside your desk drawer" },
    { ja: "壁紙を今日だけアニメに変更", en: "Change your wallpaper to anime for today" },
    { ja: "会議前に深呼吸5秒", en: "Take a 5-second deep breath before a meeting" },
    { ja: "ケーブルをジグザグに整列", en: "Arrange your cables in a zigzag pattern" },
    { ja: "スマホ壁紙を逆さまに", en: "Set your phone wallpaper upside down" },
    { ja: "椅子に座ったまま軽くジャンプ", en: "Do a small jump while sitting in your chair" },
    { ja: "昼休みに1分だけ想像旅行", en: "Take a 1-minute imaginary trip during lunch" },
    { ja: "ペン立てを左右逆に", en: "Swap your pen holder to the opposite side" },
    { ja: "普段と違うカップでコーヒー", en: "Drink coffee from a different cup than usual" },
    { ja: "作業用BGMを普段と違うジャンルに", en: "Listen to a different genre of background music" },
    { ja: "ショートカットアイコンをランダムに", en: "Rearrange your shortcut icons randomly" },
    { ja: "左手でマウス操作してみる", en: "Try using your mouse with your left hand" },
    { ja: "椅子の位置を少し前後に", en: "Shift your chair slightly forward or backward" },
    { ja: "窓を観察して面白いものメモ", en: "Observe out the window and note something interesting" },
    { ja: "机の上を真っ白にしてから作業", en: "Clear your desk completely before starting work" },
    { ja: "今日のタスクを紙に書く", en: "Write down today's tasks on a piece of paper" },
    { ja: "手帳に目標を1行だけ詩的に", en: "Write a one-line goal poetically in your planner" },
    { ja: "コップを逆さまに置く", en: "Place your cup upside down" },
    { ja: "昼休みに好きな曲を口ずさむ", en: "Hum your favorite song during lunch" },
    { ja: "ブラウザタブをランダムに整理", en: "Organize your browser tabs randomly" },
    { ja: "今日会う人に1つジョーク送る", en: "Send a joke to someone you're meeting today" },
    { ja: "机の下に小物を置く", en: "Place a small item under your desk" },
    { ja: "水を飲むとき目を閉じて味を集中", en: "Close your eyes and focus on the taste of water" },
    { ja: "1分だけ片足立ちしてバランス", en: "Balance on one leg for 1 minute" },
    { ja: "メール署名を今日だけ面白く", en: "Make your email signature funny for today" },
    { ja: "スマホ通知音を別の音に", en: "Change your phone's notification sound" },
    { ja: "ランチの順番や席を変える", en: "Change your lunch routine or seating" },
    { ja: "椅子の高さを1cm上げる", en: "Raise your chair height by 1 cm" },
    { ja: "コーヒーの飲み方を逆に（砂糖なし）", en: "Try drinking your coffee differently (e.g., no sugar)" }
];
// =============================
// ✅ 共通ツール
// =============================
function getTodayKey() {
    var d = new Date();
    return "".concat(d.getFullYear(), "-").concat(d.getMonth() + 1, "-").concat(d.getDate());
}
function getCurrentLang() {
    var saved = localStorage.getItem("language");
    return saved === "en" ? "en" : "ja";
}
function getTodayDate(lang) {
    if (lang === void 0) { lang = getCurrentLang(); }
    var today = new Date();
    if (lang === "en") {
        return today.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
    }
    var weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    return "".concat(today.getFullYear(), "\u5E74").concat(today.getMonth() + 1, "\u6708").concat(today.getDate(), "\u65E5\uFF08").concat(weekdays[today.getDay()], "\uFF09");
}
// =============================
// ✅ DOM要素
// =============================
var completeBtn = document.querySelector(".complete-btn");
var calendarGrid = document.querySelector(".calendar-grid");
var dateEl = document.querySelector(".date");
var monthYearEl = document.querySelector(".month-year");
var prevBtn = document.querySelector(".prev-month");
var nextBtn = document.querySelector(".next-month");
var settingsBtn = document.querySelector(".settings-btn");
var settingsModal = document.querySelector(".settings-modal");
var closeSettingsBtn = document.querySelector(".close-settings");
var taskTypeSelect = document.querySelector("#task-type");
var languageSelect = document.querySelector("#language");
var progressEl = document.querySelector(".progress-bar");
var taskEl = document.querySelector(".task");
// =============================
// ✅ 翻訳データ
// =============================
var i18n = {
    ja: { settingsTitle: "設定", taskTypeLabel: "タスク種類:", languageLabel: "言語:", close: "閉じる" },
    en: { settingsTitle: "Settings", taskTypeLabel: "Task type:", languageLabel: "Language:", close: "Close" }
};
// =============================
// ✅ タスク管理ロジック (統合版)
// =============================
function getTodayTask() {
    var todayKey = getTodayKey();
    var saved = localStorage.getItem("dailyTask");
    var lang = getCurrentLang();
    // 今日の分が既に保存されていたらそれを返す
    if (saved) {
        var data_1 = JSON.parse(saved);
        if (data_1 && data_1.date === todayKey) {
            return data_1;
        }
    }
    // 保存されていない場合、新しいタスクを抽選
    var doneTasksJa = JSON.parse(localStorage.getItem("doneTasks") || "[]");
    var remainingTasks = dailyTasks.filter(function (t) { return !doneTasksJa.includes(t.ja); });
    if (remainingTasks.length === 0) {
        doneTasksJa = [];
        localStorage.setItem("doneTasks", JSON.stringify(doneTasksJa));
        remainingTasks = __spreadArray([], dailyTasks, true);
    }
    var randomTask = remainingTasks[Math.floor(Math.random() * remainingTasks.length)];
    // 履歴に日本語の文字列を保存
    doneTasksJa.push(randomTask.ja);
    localStorage.setItem("doneTasks", JSON.stringify(doneTasksJa));
    var data = {
        date: todayKey,
        text: randomTask[lang],
        completed: false
    };
    localStorage.setItem("dailyTask", JSON.stringify(data));
    return data;
}
function setTodayTaskCompleted(completed) {
    var data = getTodayTask();
    data.completed = completed;
    localStorage.setItem("dailyTask", JSON.stringify(data));
}
// =============================
// ✅ UI反映・カレンダー
// =============================
var currentDate = new Date();
var todayDate = new Date();
var todayNumber = todayDate.getDate();
var doneDays = JSON.parse(localStorage.getItem("doneDays") || "[]");
function applyLanguage(lang) {
    var settingsTitleEl = document.querySelector(".settings-content h2");
    var taskTypeLabelEl = document.querySelector('label[for="task-type"]');
    var languageLabelEl = document.querySelector('label[for="language"]');
    var closeBtnEl = document.querySelector(".close-settings");
    if (settingsTitleEl)
        settingsTitleEl.textContent = i18n[lang].settingsTitle;
    if (taskTypeLabelEl)
        taskTypeLabelEl.textContent = i18n[lang].taskTypeLabel;
    if (languageLabelEl)
        languageLabelEl.textContent = i18n[lang].languageLabel;
    if (closeBtnEl)
        closeBtnEl.textContent = i18n[lang].close;
    if (dateEl)
        dateEl.textContent = getTodayDate(lang);
    updateMonthYear(currentDate);
}
// 修正版 renderCalendar の一部
function renderCalendar(date) {
    if (date === void 0) { date = currentDate; }
    if (!calendarGrid)
        return;
    calendarGrid.innerHTML = "";
    var year = date.getFullYear();
    var month = date.getMonth();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    // 現在の年月と「本当の今日」の年月を比較
    var isTodayMonth = year === todayDate.getFullYear() && month === todayDate.getMonth();
    for (var i = 1; i <= daysInMonth; i++) {
        var dayEl = document.createElement("div");
        dayEl.textContent = i.toString();
        dayEl.classList.add("day");
        dayEl.dataset.day = i.toString();
        // doneDaysは数値配列なのでそのまま比較
        if (doneDays.includes(i) && isTodayMonth) {
            dayEl.classList.add("done");
        }
        if (i === todayDate.getDate() && isTodayMonth) {
            dayEl.classList.add("today");
            // ここでアニメーションを実行
            dayEl.animate([{ transform: "scale(1)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }], { duration: 300 });
        }
        calendarGrid.appendChild(dayEl);
    }
    updateMonthYear(date);
}
function updateMonthYear(date) {
    if (!monthYearEl)
        return;
    var lang = getCurrentLang();
    var mJa = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    var mEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthYearEl.textContent = lang === "en" ? "".concat(mEn[date.getMonth()], " ").concat(date.getFullYear()) : "".concat(date.getFullYear(), "\u5E74 ").concat(mJa[date.getMonth()]);
}
function disableCompleteButton() {
    if (!completeBtn)
        return;
    completeBtn.disabled = true;
    completeBtn.style.background = "#d1d5db";
    completeBtn.style.color = "#9ca3af";
    completeBtn.textContent = getCurrentLang() === "en" ? "Completed" : "完了済み";
}
function renderTodayTask() {
    var t = getTodayTask();
    if (taskEl) {
        taskEl.textContent = t.text;
        t.completed ? taskEl.classList.add("completed") : taskEl.classList.remove("completed");
    }
    if (t.completed)
        disableCompleteButton();
}
function handleComplete() {
    setTodayTaskCompleted(true);
    if (!doneDays.includes(todayNumber)) {
        doneDays.push(todayNumber);
        localStorage.setItem("doneDays", JSON.stringify(doneDays));
    }
    disableCompleteButton();
    if (taskEl)
        taskEl.classList.add("completed");
    renderCalendar();
    if (progressEl)
        progressEl.style.width = Math.min((doneDays.length / 30) * 100, 100) + "%";
}
// =============================
// ✅ 通知機能
// =============================
function notifyTodayTask(taskText) {
    if (Notification.permission !== "granted")
        return;
    var lang = getCurrentLang();
    var text = taskText || getTodayTask().text;
    var title = lang === "en" ? "Today's Task" : "今日の1タスク";
    var notification = new Notification(title, { body: text, icon: "/icon-192.png" });
    notification.onclick = function () { handleComplete(); window.focus(); notification.close(); };
}
function saveNotifyTimes() {
    var _a, _b, _c;
    var times = [
        (_a = document.getElementById("notify-1")) === null || _a === void 0 ? void 0 : _a.value,
        (_b = document.getElementById("notify-2")) === null || _b === void 0 ? void 0 : _b.value,
        (_c = document.getElementById("notify-3")) === null || _c === void 0 ? void 0 : _c.value,
    ].filter(Boolean);
    localStorage.setItem("notifyTimes", JSON.stringify(times));
}
function checkAndNotify() {
    if (Notification.permission !== "granted")
        return;
    var times = JSON.parse(localStorage.getItem("notifyTimes") || '["08:00", "13:00", "20:00"]');
    var now = new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    times.forEach(function (time) {
        var _a = time.split(":").map(Number), h = _a[0], m = _a[1];
        var key = "notified-".concat(getTodayKey(), "-").concat(time);
        if (nowMin >= (h * 60 + m) && !localStorage.getItem(key)) {
            notifyTodayTask();
            localStorage.setItem(key, "true");
        }
    });
}
// =============================
// ✅ 起動処理
// =============================
document.addEventListener("DOMContentLoaded", function () {
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
    var times = JSON.parse(localStorage.getItem("notifyTimes") || '["08:00", "13:00", "20:00"]');
    times.forEach(function (t, i) {
        var el = document.getElementById("notify-".concat(i + 1));
        if (el)
            el.value = t;
    });
    ["notify-1", "notify-2", "notify-3"].forEach(function (id) {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.addEventListener("change", saveNotifyTimes);
    });
    applyLanguage(getCurrentLang());
    renderTodayTask();
    if (doneDays.includes(todayNumber)) {
        disableCompleteButton();
    }
    else {
        completeBtn === null || completeBtn === void 0 ? void 0 : completeBtn.addEventListener("click", handleComplete);
    }
    renderCalendar();
    if (progressEl)
        progressEl.style.width = Math.min((doneDays.length / 30) * 100, 100) + "%";
    prevBtn === null || prevBtn === void 0 ? void 0 : prevBtn.addEventListener("click", function () { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
    nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.addEventListener("click", function () { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
    // 設定モーダル表示
    settingsBtn === null || settingsBtn === void 0 ? void 0 : settingsBtn.addEventListener("click", function () { return settingsModal === null || settingsModal === void 0 ? void 0 : settingsModal.classList.toggle("active"); });
    // 閉じるボタンで閉じる
    closeSettingsBtn === null || closeSettingsBtn === void 0 ? void 0 : closeSettingsBtn.addEventListener("click", function () { return settingsModal === null || settingsModal === void 0 ? void 0 : settingsModal.classList.remove("active"); });
    // **モーダル外クリックで閉じる**
    settingsModal === null || settingsModal === void 0 ? void 0 : settingsModal.addEventListener("click", function (e) {
        if (e.target === settingsModal) {
            settingsModal.classList.remove("active");
        }
    });
    languageSelect === null || languageSelect === void 0 ? void 0 : languageSelect.addEventListener("change", function () {
        var lang = languageSelect.value || "ja";
        localStorage.setItem("language", lang);
        applyLanguage(lang);
        // 言語を変えた瞬間にタスクの文字も変える
        var todayTask = getTodayTask();
        var taskItem = dailyTasks.find(function (t) { return t.ja === todayTask.text || t.en === todayTask.text; });
        if (taskItem) {
            todayTask.text = taskItem[lang];
            localStorage.setItem("dailyTask", JSON.stringify(todayTask));
            renderTodayTask();
        }
    });
    setInterval(checkAndNotify, 60000);
});
function animateDay(dayNumber, date) {
    if (!calendarGrid)
        return;
    var isTodayMonth = date.getFullYear() === todayDate.getFullYear() && date.getMonth() === todayDate.getMonth();
    if (!isTodayMonth)
        return;
    var dayEl = calendarGrid.querySelector(".day[data-day=\"".concat(dayNumber, "\"]"));
    dayEl === null || dayEl === void 0 ? void 0 : dayEl.animate([{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], { duration: 300 });
}
