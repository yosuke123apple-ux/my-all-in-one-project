"use strict";
// =====================================================
// ✅ 1日1タスクアプリ（コメントまみれ完全解説版）
// =====================================================
//
// このコードはざっくり言うと👇
// ・毎日ランダムで1つタスクを表示する
// ・完了ボタンを押すと「今日の完了」を保存する
// ・カレンダーに完了した日を色付けする
// ・通知でタスクをリマインドできる
// ・言語（日本語/英語）切り替えができる
//
// 保存は localStorage を使ってるから
// サーバーなしでブラウザだけで動く
// =====================================================
// =============================
// ✅ 1日1タスク用データ（ランダム抽選元）
// =============================
//
// dailyTasks の中から「今日のタスク」を1つ選ぶ
// すでにやったタスクはなるべく避ける仕組みも後である
const dailyTasks = [
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
// ✅ 共通ツール（便利関数）
// =============================
// -------------------------------------------------
// ✅ 今日の日付を保存用キーにする
// -------------------------------------------------
// 例：2026年2月1日 → "2026-2-1"
function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
// -------------------------------------------------
// ✅ 現在の言語設定を取得する
// -------------------------------------------------
// localStorage に language が "en" なら英語
// それ以外は日本語（初回はnullなのでjaになる）
function getCurrentLang() {
    const saved = localStorage.getItem("language");
    return saved === "en" ? "en" : "ja";
}
// -------------------------------------------------
// ✅ 今日の日付を画面表示用に整形する
// -------------------------------------------------
// 引数が省略されたら現在言語で表示する
function getTodayDate(lang = getCurrentLang()) {
    const today = new Date();
    // 英語の場合は toLocaleDateString を使って綺麗に出す
    if (lang === "en") {
        return today.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }
    // 日本語は自作フォーマットで「○年○月○日（曜）」にする
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    return `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日（${weekdays[today.getDay()]}）`;
}
// =============================
// ✅ DOM要素（HTMLから取得）
// =============================
//
// querySelector は HTML の中から要素を取ってくる
// <button class="complete-btn"> のようなやつ
//
// <HTMLButtonElement> は TypeScript の型付け
// 「これはボタン要素だよ」って指定してる
const completeBtn = document.querySelector(".complete-btn");
const calendarGrid = document.querySelector(".calendar-grid");
const dateEl = document.querySelector(".date");
const monthYearEl = document.querySelector(".month-year");
const prevBtn = document.querySelector(".prev-month");
const nextBtn = document.querySelector(".next-month");
const settingsBtn = document.querySelector(".settings-btn");
const settingsModal = document.querySelector(".settings-modal");
const closeSettingsBtn = document.querySelector(".close-settings");
const taskTypeSelect = document.querySelector("#task-type"); // 今は未使用でもOK（将来拡張用）
const languageSelect = document.querySelector("#language");
const progressEl = document.querySelector(".progress-bar");
const taskEl = document.querySelector(".task");
// =============================
// ✅ 翻訳データ（UIの文字）
// =============================
//
// i18n = internationalization（多言語対応）
// settingsTitle など「UIで表示する固定文字」を言語別に持つ
const i18n = {
    ja: {
        settingsTitle: "設定",
        taskTypeLabel: "タスク種類:",
        languageLabel: "言語:",
        close: "閉じる",
    },
    en: {
        settingsTitle: "Settings",
        taskTypeLabel: "Task type:",
        languageLabel: "Language:",
        close: "Close",
    },
};
// =============================
// ✅ タスク管理ロジック（今日のタスクを決める）
// =============================
// -------------------------------------------------
// ✅ 今日のタスクを取得する（保存があればそれを使う）
// -------------------------------------------------
// 今日のタスクは1日に何回読み込んでも同じにしたい
// だから localStorage に保存しておく
function getTodayTask() {
    const todayKey = getTodayKey(); // 今日の日付キー（例: "2026-2-1"）
    const saved = localStorage.getItem("dailyTask"); // 今日タスクの保存データ
    const lang = getCurrentLang(); // 現在の言語
    // -----------------------------------------
    // ✅ すでに今日のタスクが保存されていたらそれを使う
    // -----------------------------------------
    if (saved) {
        const data = JSON.parse(saved); // JSON文字列 → オブジェクトへ変換
        if (data && data.date === todayKey) {
            // 今日の日付と一致するなら「今日のタスク」として返す
            return data;
        }
    }
    // -----------------------------------------
    // ✅ 保存されてないなら「新しいタスクを抽選」する
    // -----------------------------------------
    // doneTasks は「過去に引いたタスクの日本語文」を保存している
    // 例：["靴下をいつもと違う色に", "5分だけ暗い部屋で瞑想", ...]
    let doneTasksJa = JSON.parse(localStorage.getItem("doneTasks") || "[]");
    // remainingTasks は「まだ引いてないタスクだけ」抽出したもの
    let remainingTasks = dailyTasks.filter((t) => !doneTasksJa.includes(t.ja));
    // -----------------------------------------
    // ✅ 全部やり切ったらリセット（また最初から）
    // -----------------------------------------
    if (remainingTasks.length === 0) {
        doneTasksJa = [];
        localStorage.setItem("doneTasks", JSON.stringify(doneTasksJa));
        remainingTasks = [...dailyTasks]; // 全タスクを復活
    }
    // -----------------------------------------
    // ✅ remainingTasks の中からランダムで1つ選ぶ
    // -----------------------------------------
    const randomTask = remainingTasks[Math.floor(Math.random() * remainingTasks.length)];
    // -----------------------------------------
    // ✅ 引いたタスクを履歴に追加（日本語で保存）
    // -----------------------------------------
    //
    // 日本語で保存しておけば「言語切り替えしても同じタスクを判定できる」
    doneTasksJa.push(randomTask.ja);
    localStorage.setItem("doneTasks", JSON.stringify(doneTasksJa));
    // -----------------------------------------
    // ✅ 今日のタスクデータを作る
    // -----------------------------------------
    const data = {
        date: todayKey, // 今日の日付キー
        text: randomTask[lang], // 現在の言語で表示する文章
        completed: false, // まだ完了してない
    };
    // localStorage に保存
    localStorage.setItem("dailyTask", JSON.stringify(data));
    // 画面表示側へ返す
    return data;
}
// -------------------------------------------------
// ✅ 今日のタスクを完了/未完了にセットする
// -------------------------------------------------
// completed を true/false で更新して保存するだけ
function setTodayTaskCompleted(completed) {
    const data = getTodayTask(); // 今日のタスクデータを取る
    data.completed = completed; // 完了状態を書き換え
    localStorage.setItem("dailyTask", JSON.stringify(data)); // 保存
}
// =============================
// ✅ UI反映・カレンダー関連
// =============================
// 現在表示しているカレンダーの月（prev/nextで変わる）
let currentDate = new Date();
// 「本当の今日」（固定）
// currentDate と違って、これは変えない
const todayDate = new Date();
// 今日の日付（1〜31）
const todayNumber = todayDate.getDate();
// doneDays は「完了した日」の配列
// 例：[1, 3, 5, 8] なら 1日,3日,5日,8日が完了
let doneDays = JSON.parse(localStorage.getItem("doneDays") || "[]");
// -------------------------------------------------
// ✅ 言語をUI全体に反映する
// -------------------------------------------------
function applyLanguage(lang) {
    // 設定モーダル内のテキストを取る
    const settingsTitleEl = document.querySelector(".settings-content h2");
    const taskTypeLabelEl = document.querySelector('label[for="task-type"]');
    const languageLabelEl = document.querySelector('label[for="language"]');
    const closeBtnEl = document.querySelector(".close-settings");
    // i18n から言語に合う文字列を入れる
    if (settingsTitleEl)
        settingsTitleEl.textContent = i18n[lang].settingsTitle;
    if (taskTypeLabelEl)
        taskTypeLabelEl.textContent = i18n[lang].taskTypeLabel;
    if (languageLabelEl)
        languageLabelEl.textContent = i18n[lang].languageLabel;
    if (closeBtnEl)
        closeBtnEl.textContent = i18n[lang].close;
    // 今日の日付表示も言語に合わせる
    if (dateEl)
        dateEl.textContent = getTodayDate(lang);
    // 月表示（2026年2月 / Feb 2026）も更新
    updateMonthYear(currentDate);
}
// -------------------------------------------------
// ✅ カレンダーを描画する
// -------------------------------------------------
// 引数 date を渡さなければ currentDate を使う
function renderCalendar(date = currentDate) {
    // カレンダーの枠がないなら何もしない（HTMLが壊れてても落ちないように）
    if (!calendarGrid)
        return;
    // 一旦カレンダーを空にする（再描画するため）
    calendarGrid.innerHTML = "";
    // 表示する年月
    const year = date.getFullYear();
    const month = date.getMonth(); // 0〜11
    // その月の日数を計算（例：2月なら28/29）
    // new Date(year, month + 1, 0) は「次の月の0日」＝今月の最終日
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // 「表示してる月」が「本当の今日の月」と同じか？
    // これをチェックしないと、別の月にも today/done が付いちゃう
    const isTodayMonth = year === todayDate.getFullYear() && month === todayDate.getMonth();
    // 1日〜月末までループして日付要素を作る
    for (let i = 1; i <= daysInMonth; i++) {
        // <div> を作る（1日,2日...）
        const dayEl = document.createElement("div");
        // 中身の文字（表示）
        dayEl.textContent = i.toString();
        // CSS用クラス day を付ける
        dayEl.classList.add("day");
        // data-day="1" みたいな属性を付ける（後で探しやすくする）
        dayEl.dataset.day = i.toString();
        // ---------------------------
        // ✅ 完了してる日なら done クラスを付ける
        // ---------------------------
        // doneDays は数値配列なので includes(i) でチェック
        // ただし「今月が今日の月の時だけ」反映する
        if (doneDays.includes(i) && isTodayMonth) {
            dayEl.classList.add("done");
        }
        // ---------------------------
        // ✅ 今日の日なら today クラスを付ける
        // ---------------------------
        if (i === todayDate.getDate() && isTodayMonth) {
            dayEl.classList.add("today");
            // 今日の日付だけちょいアニメーション（ピョン）
            dayEl.animate([{ transform: "scale(1)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }], { duration: 300 });
        }
        // カレンダーの枠に追加
        calendarGrid.appendChild(dayEl);
    }
    // 月表示を更新
    updateMonthYear(date);
}
// -------------------------------------------------
// ✅ 「2026年2月」 / 「Feb 2026」表示を更新
// -------------------------------------------------
function updateMonthYear(date) {
    if (!monthYearEl)
        return;
    const lang = getCurrentLang();
    // 月名（日本語）
    const mJa = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    // 月名（英語）
    const mEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // 言語によって表示を切り替え
    monthYearEl.textContent =
        lang === "en"
            ? `${mEn[date.getMonth()]} ${date.getFullYear()}`
            : `${date.getFullYear()}年 ${mJa[date.getMonth()]}`;
}
// -------------------------------------------------
// ✅ 完了ボタンを押せない状態にする
// -------------------------------------------------
// 今日完了済みならボタンを無効化する（2回押せないように）
function disableCompleteButton() {
    if (!completeBtn)
        return;
    completeBtn.disabled = true; // ボタン無効化
    // 見た目も「押せない感」を出す
    completeBtn.style.background = "#d1d5db";
    completeBtn.style.color = "#9ca3af";
    // ボタンの文字も切り替える
    completeBtn.textContent = getCurrentLang() === "en" ? "Completed" : "完了済み";
}
// -------------------------------------------------
// ✅ 今日のタスクを画面に表示する
// -------------------------------------------------
function renderTodayTask() {
    const t = getTodayTask(); // 今日のタスクデータを取得
    if (taskEl) {
        // タスク文章を表示
        taskEl.textContent = t.text;
        // 完了してるなら completed クラスを付ける（打消し線とか用）
        if (t.completed) {
            taskEl.classList.add("completed");
        }
        else {
            taskEl.classList.remove("completed");
        }
    }
    // もし完了済みならボタンも無効化
    if (t.completed)
        disableCompleteButton();
}
// -------------------------------------------------
// ✅ 完了ボタンが押された時の処理
// -------------------------------------------------
function handleComplete() {
    // 今日のタスクを完了にする（localStorageに保存）
    setTodayTaskCompleted(true);
    // doneDays に今日の日付がまだ入ってないなら追加
    if (!doneDays.includes(todayNumber)) {
        doneDays.push(todayNumber);
        localStorage.setItem("doneDays", JSON.stringify(doneDays));
    }
    // ボタンを無効化
    disableCompleteButton();
    // タスクの見た目も完了っぽくする
    if (taskEl)
        taskEl.classList.add("completed");
    // カレンダーを再描画して完了表示を反映
    renderCalendar();
    // 進捗バーを更新
    // 30日想定で doneDays.length / 30 * 100
    if (progressEl) {
        progressEl.style.width = Math.min((doneDays.length / 30) * 100, 100) + "%";
    }
}
// =============================
// ✅ 通知機能（Notification API）
// =============================
// -------------------------------------------------
// ✅ 今日のタスクを通知で出す
// -------------------------------------------------
function notifyTodayTask(taskText) {
    // 通知許可がないなら何もしない
    if (Notification.permission !== "granted")
        return;
    const lang = getCurrentLang();
    // taskText が渡されてればそれを使う
    // 渡されてなければ今日のタスクの文章を使う
    const text = taskText || getTodayTask().text;
    // 通知タイトルも言語で変える
    const title = lang === "en" ? "Today's Task" : "今日の1タスク";
    // 通知を表示
    const notification = new Notification(title, {
        body: text, // 通知の本文
        icon: "/icon-192.png", // PWAのアイコン想定
    });
    // 通知をクリックしたら「完了」にする + ウィンドウ前面へ
    notification.onclick = () => {
        handleComplete();
        window.focus();
        notification.close();
    };
}
// -------------------------------------------------
// ✅ 通知する時刻を保存する
// -------------------------------------------------
// HTML側の input type="time" を3つ持ってる想定
function saveNotifyTimes() {
    var _a;
    // 3つの入力欄から値を取る
    const times = [
        (_a = document.getElementById("notify-1")) === null || _a === void 0 ? void 0 : _a.value,
    ]
        // 空文字とか undefined を消す
        .filter(Boolean);
    // localStorageに保存
    localStorage.setItem("notifyTimes", JSON.stringify(times));
}
// -------------------------------------------------
// ✅ 今の時間が通知時刻を過ぎてたら通知する
// -------------------------------------------------
// 1分ごとにこれをチェックする
function checkAndNotify() {
    // 通知許可がないなら何もしない
    if (Notification.permission !== "granted")
        return;
    // 通知時刻一覧を取得（なければデフォルト3つ）
    const times = JSON.parse(localStorage.getItem("notifyTimes") || '["08:00",]');
    // 現在時刻
    const now = new Date();
    // 今が何分目か（例：13:05 → 785分）
    const nowMin = now.getHours() * 60 + now.getMinutes();
    // times の中身を全部チェック
    times.forEach((time) => {
        // "08:00" を [8,0] にする
        const [h, m] = time.split(":").map(Number);
        // 今日の日付と時刻で「通知済みか」を判定するキーを作る
        // 例：notified-2026-2-1-08:00
        const key = `notified-${getTodayKey()}-${time}`;
        // 今が通知時刻を過ぎていて、まだ通知してないなら通知する
        if (nowMin >= (h * 60 + m) && !localStorage.getItem(key)) {
            notifyTodayTask();
            localStorage.setItem(key, "true"); // 通知済みにする
        }
    });
}
// =============================
// ✅ 起動処理（ページ読み込み時）
// =============================
document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------
    // ✅ 通知許可を取る（初回のみ）
    // -----------------------------------------
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
    // -----------------------------------------
    // ✅ 保存された通知時刻を入力欄に反映
    // -----------------------------------------
    const times = JSON.parse(localStorage.getItem("notifyTimes") || '["08:00"]');
    times.forEach((t, i) => {
        const el = document.getElementById(`notify-${i + 1}`);
        if (el)
            el.value = t;
    });
    // -----------------------------------------
    // ✅ 通知時刻が変わったら保存する
    // -----------------------------------------
    ["notify-1"].forEach((id) => {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.addEventListener("change", saveNotifyTimes);
    });
    // -----------------------------------------
    // ✅ 言語を反映（UIの文字を切り替える）
    // -----------------------------------------
    applyLanguage(getCurrentLang());
    // -----------------------------------------
    // ✅ 今日のタスクを表示
    // -----------------------------------------
    renderTodayTask();
    // -----------------------------------------
    // ✅ 今日が完了済みならボタン無効化
    // 未完了ならクリックイベントを付ける
    // -----------------------------------------
    if (doneDays.includes(todayNumber)) {
        disableCompleteButton();
    }
    else {
        completeBtn === null || completeBtn === void 0 ? void 0 : completeBtn.addEventListener("click", handleComplete);
    }
    // -----------------------------------------
    // ✅ カレンダー表示
    // -----------------------------------------
    renderCalendar();
    // -----------------------------------------
    // ✅ 進捗バー更新
    // -----------------------------------------
    if (progressEl) {
        progressEl.style.width = Math.min((doneDays.length / 30) * 100, 100) + "%";
    }
    // -----------------------------------------
    // ✅ 前月/次月ボタン
    // -----------------------------------------
    prevBtn === null || prevBtn === void 0 ? void 0 : prevBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    // -----------------------------------------
    // ✅ 設定モーダルを開く
    // -----------------------------------------
    settingsBtn === null || settingsBtn === void 0 ? void 0 : settingsBtn.addEventListener("click", () => {
        settingsModal === null || settingsModal === void 0 ? void 0 : settingsModal.classList.toggle("active");
    });
    // -----------------------------------------
    // ✅ 閉じるボタンでモーダル閉じる
    // -----------------------------------------
    closeSettingsBtn === null || closeSettingsBtn === void 0 ? void 0 : closeSettingsBtn.addEventListener("click", () => {
        settingsModal === null || settingsModal === void 0 ? void 0 : settingsModal.classList.remove("active");
    });
    // -----------------------------------------
    // ✅ モーダル外をクリックしたら閉じる
    // -----------------------------------------
    settingsModal === null || settingsModal === void 0 ? void 0 : settingsModal.addEventListener("click", (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove("active");
        }
    });
    // -----------------------------------------
    // ✅ 言語が変わった時の処理
    // -----------------------------------------
    languageSelect === null || languageSelect === void 0 ? void 0 : languageSelect.addEventListener("change", () => {
        // select の値を Lang 型として扱う
        const lang = languageSelect.value || "ja";
        // 言語設定を保存
        localStorage.setItem("language", lang);
        // UIに反映
        applyLanguage(lang);
        // -----------------------------------------
        // ✅ 言語を変えた瞬間に「今日のタスク文章」も切り替える
        // -----------------------------------------
        const todayTask = getTodayTask();
        // dailyTasks の中から「今表示してるタスク」に一致するものを探す
        // 日本語でも英語でも一致するようにしてる
        const taskItem = dailyTasks.find((t) => t.ja === todayTask.text || t.en === todayTask.text);
        // 見つかったら言語に合わせて text を入れ替える
        if (taskItem) {
            todayTask.text = taskItem[lang];
            localStorage.setItem("dailyTask", JSON.stringify(todayTask));
            renderTodayTask();
        }
    });
    // -----------------------------------------
    // ✅ 1分ごとに通知チェック
    // -----------------------------------------
    setInterval(checkAndNotify, 60000);
});
// =============================
// ✅ アニメーション（特定の日をピョンさせる）
// =============================
//
// dayNumber：何日を動かすか
// date：その月が「今日の月」かチェックするため
function animateDay(dayNumber, date) {
    // カレンダーがなければ終了
    if (!calendarGrid)
        return;
    // 表示してる月が今日の月じゃないならアニメしない
    const isTodayMonth = date.getFullYear() === todayDate.getFullYear() &&
        date.getMonth() === todayDate.getMonth();
    if (!isTodayMonth)
        return;
    // data-day="5" みたいな要素を探す
    const dayEl = calendarGrid.querySelector(`.day[data-day="${dayNumber}"]`);
    // あったらアニメーション
    dayEl === null || dayEl === void 0 ? void 0 : dayEl.animate([{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], { duration: 300 });
}
