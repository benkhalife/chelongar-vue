// import {fetch}

import { fetchJsonFromUrl, insertPackageFromJson } from "./Import";

/**
 * تابع مقداردهی اولیه پایگاه داده
 * این تابع جداول مورد نیاز برای برنامه یادگیری لغات را ایجاد می‌کند
 */
export function initializeDatabase() {
  try {
    // جدول پکیج‌های لغات
    const createPackagesTable = `
      CREATE TABLE IF NOT EXISTS packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        
        slug TEXT NOT NULL,
        title TEXT NOT NULL,
        
        category TEXT,
        description TEXT,
        language TEXT,
        parent TEXT,
        position INTEGER DEFAULT -1,
        cover TEXT,


        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // جدول لغات (با فیلدهای جدید)
    const createWordsTable = `
      CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        package_id INTEGER NOT NULL,
        word TEXT NOT NULL,
        example TEXT,
        emoji TEXT,
        pronunciation TEXT,
        learned BOOLEAN DEFAULT 0,
        bookmarked BOOLEAN DEFAULT 0,
        try_count INTEGER DEFAULT 0,
        correct_count INTEGER DEFAULT 0,
        easiness_factor REAL DEFAULT 2.5,
        interval_days INTEGER DEFAULT 0,
        next_review_date TIMESTAMP,
        last_review_date TIMESTAMP,
        review_count INTEGER DEFAULT 0,
        mastered BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
      )
    `;

    // جدول معانی لغات
    const createMeaningsTable = `
      CREATE TABLE IF NOT EXISTS meanings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word_id INTEGER NOT NULL,
        meaning TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
      )
    `;



    // جدول session_words (لغات هر session)
    const createSessionWordsTable = `
      CREATE TABLE IF NOT EXISTS session_words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        word_id INTEGER NOT NULL,
        position INTEGER DEFAULT 0,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
      )
    `;

    // جدول sessions (تمرین‌ها)
    const createSessionsTable = `
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        package_id INTEGER NOT NULL,
        session_type TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        word_count INTEGER DEFAULT 0,
        position INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
      )
    `;

    // جدول review_history (تاریخچه مرورها)
    const createReviewHistoryTable = `
      CREATE TABLE IF NOT EXISTS review_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word_id INTEGER NOT NULL,
        session_id INTEGER,
        quality INTEGER NOT NULL,
        response_time INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL
      )
    `;

    // اجرای دستورات ایجاد جداول
    let result;

    // ایجاد جدول پکیج‌ها
    result = JSON.parse(AndroidDB.executeSQL(createPackagesTable));
    if (!result.success) {
      console.error('خطا در ایجاد جدول پکیج‌ها:', result.message);
      return { success: false, message: result.message };
    }

    // ایجاد جدول لغات
    result = JSON.parse(AndroidDB.executeSQL(createWordsTable));
    if (!result.success) {
      console.error('خطا در ایجاد جدول لغات:', result.message);
      return { success: false, message: result.message };
    }

    // ایجاد جدول معانی
    result = JSON.parse(AndroidDB.executeSQL(createMeaningsTable));
    if (!result.success) {
      console.error('خطا در ایجاد جدول معانی:', result.message);
      return { success: false, message: result.message };
    }

    // ایجاد جدول sessions
    result = JSON.parse(AndroidDB.executeSQL(createSessionsTable));
    if (!result.success) {
      console.error('خطا در ایجاد جدول sessions:', result.message);
      return { success: false, message: result.message };
    }

    // ایجاد جدول session_words
    result = JSON.parse(AndroidDB.executeSQL(createSessionWordsTable));
    if (!result.success) {
      console.error('خطا در ایجاد جدول session_words:', result.message);
      return { success: false, message: result.message };
    }

    // ایجاد جدول review_history
    result = JSON.parse(AndroidDB.executeSQL(createReviewHistoryTable));
    if (!result.success) {
      console.error('خطا در ایجاد جدول review_history:', result.message);
      return { success: false, message: result.message };
    }

    console.log('✅ پایگاه داده با موفقیت مقداردهی اولیه شد');
    return { success: true, message: 'پایگاه داده با موفقیت ایجاد شد' };

  } catch (error) {
    console.error('خطا در مقداردهی اولیه پایگاه داده:', error);
    return { success: false, message: error.message };
  }
}




export function normalizeDbValue(value) {
  if (value === null || value === undefined || value === 'null') return null;

  return value;
}

export async function select(tableName, columns = "*", whereClause = "", whereArgs = [], orderBy = "", limit = "") {
  return await JSON.parse(await AndroidDB.select(tableName, columns, whereClause, JSON.stringify(whereArgs), orderBy, limit));
}

export function getApiToken() {
  let is_login = JSON.parse(AndroidPrefs.getBoolean('is_login', false)).value;
  let api_token = JSON.parse(AndroidPrefs.getString('api_token', '')).value;

  if (is_login) {
    return api_token
  }

  return '';
}


export function getBoolean(key, defaultValue = false) {
  return JSON.parse(AndroidPrefs.getBoolean(key, defaultValue)).value
}

export function getString(key, defaultValue = '') {
  return JSON.parse(AndroidPrefs.getString(key, defaultValue)).value
}

export function getObject(key, defaultValue = '{}') {
  return JSON.parse(getString(key, defaultValue));
}


export function isLogin() {
  return getBoolean('is_login');
}

export function setBoolean(key, value) {
  AndroidPrefs.setBoolean(key, value);
}

export function setString(key, value) {
  AndroidPrefs.setString(key, value);
}

export function removePrefs(key) {
  AndroidPrefs.remove(key);

}

// یک تابع جامع برای ارتباط ناهمگام با اندروید
export const queryAsyncDB = (method, args = []) => {
    return new Promise((resolve) => {
        // اگر اپلیکیشن در محیط مرورگر (وب) اجرا می‌شود و اندروید در دسترس نیست
        if (!window.AndroidAsyncDB) {
            console.warn("AndroidAsyncDB is not available");
            resolve({ success: false, message: "Not in Android app" });
            return;
        }

        // ۱. ساخت یک نام یونیک برای ایونت (ترکیب زمان و رندوم)
        const eventName = `db_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // ۲. ساخت لیسنر برای دریافت پاسخ
        const listener = (event) => {
            // حذف لیسنر برای جلوگیری از نشت حافظه (Memory Leak)
            window.removeEventListener(eventName, listener);
            
            // برگرداندن دیتای دریافتی (event.detail همان آبجکت جیسون کاتلین است)
            resolve(event.detail);
        };

        // ۳. گوش دادن به ایونت
        window.addEventListener(eventName, listener);

        // ۴. ارسال درخواست به اندروید به همراه نام ایونت
        window.AndroidAsyncDB[method](...args, eventName);
    });
};


export const asyncSelect = async (tableName, columns = "*", whereClause = "", whereArgs = [], orderBy = "", limit = "") => {
    return await queryAsyncDB('select', [tableName, columns, whereClause, JSON.stringify(whereArgs), orderBy, limit]);
}

export const asyncFirst = async (tableName, columns = "*", whereClause = "", whereArgs = [], orderBy = "") => {
    return await queryAsyncDB('first', [tableName, columns, whereClause, JSON.stringify(whereArgs), orderBy]);
}