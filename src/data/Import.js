import { getApiToken } from "./Database";

/**
 * insertPackageFromJson(payload)
 * ورودی: payload مشابه ساختار نمونهٔ شما:
 * {
 *  title, description, category, language,
 *  words: [ { word, pronunciation, example, meanings: [...] , emoji? } , ... ]
 * }
 * خروجی: { success: true/false, packageId?, stats: { total, added, failed }, errors: [...] }
 */
export function insertPackageFromJson(payload) {
  try {
    if (!payload || typeof payload !== 'object') {
      return { success: false, message: 'payload نامعتبر است' };
    }

    console.log('run insertPackageFromJson in input.js');
    

    const { title, description = '', category = '', language = '', slug = '', parent = '', position = -1, cover = '', words } = payload;

    if (!title || !Array.isArray(words)) {
      return { success: false, message: 'title یا words وجود ندارد یا فرمت آنها اشتباه است' };
    }

    // ایجاد پکیج
    const packageData = { title, description, category, language, slug, parent, position, cover };
    const pkgInsertRaw = AndroidDB.insert('packages', JSON.stringify(packageData));
    const pkgInsert = JSON.parse(pkgInsertRaw);

    if (!pkgInsert || !pkgInsert.success) {
      return { success: false, message: 'خطا در ایجاد پکیج', raw: pkgInsert };
    }

    const packageId = pkgInsert.insertId;

    

    // واردسازی لغات
    const stats = { total: words.length, added: 0, failed: 0 };
    const errors = [];

    words.forEach((item, index) => {
      try {
        if (!item || typeof item.word !== 'string' || !item.word.trim()) {
          stats.failed++;
          errors.push({ index, reason: 'فیلد word وجود ندارد یا نامعتبر است', item });
          return;
        }

        const wordData = {
          package_id: packageId,
          word: item.word.trim(),
          example: item.example || '',
          emoji: item.emoji || '',
          pronunciation: item.pronunciation || '',
          // اگر می‌خواهی فیلدهای اضافی مثل level/tags را ذخیره کنی،
          // اینجا اضافه‌شان کن (مثلاً level: item.level || '')
        };

        const wordInsertRaw = AndroidDB.insert('words', JSON.stringify(wordData));
        const wordInsert = JSON.parse(wordInsertRaw);

        if (!wordInsert || !wordInsert.success) {
          stats.failed++;
          errors.push({ index, reason: 'خطا در درج word', raw: wordInsert });
          return;
        }

        stats.added++;
        const wordId = wordInsert.insertId;

        item.meaning = JSON.parse(item.meaning);

        // معانی ممکن است آرایه یا رشته باشد — سازگارش می‌کنیم
        let meanings = [];
        if (Array.isArray(item.meanings)) meanings = item.meanings;
        else if (typeof item.meanings === 'string') meanings = [item.meanings];
        else if (Array.isArray(item.meaning)) meanings = item.meaning;
        else if (typeof item.meaning === 'string') meanings = [item.meaning];

        meanings.forEach(m => {
          try {
            AndroidDB.insert('meanings', JSON.stringify({ word_id: wordId, meaning: m }));
          } catch (e) {
            // لاگ اما ادامه می‌دهیم
            errors.push({ index, wordId, reason: 'خطا در درج meaning', meaning: m, error: e.message });
          }
        });

      } catch (errItem) {
        stats.failed++;
        errors.push({ index, reason: errItem.message });
      }
    });

    return { success: true, packageId, stats, errors };

  } catch (err) {
    return { success: false, message: err.message || 'خطای نامشخص' };
  }
}

/**
 * fetchJsonFromUrl(url)
 * فقط JSON را از URL دریافت می‌کند و برمی‌گرداند.
 * خروجی: { success: true, payload } یا { success: false, message, status? }
 *
 * - این تابع async است و از fetch استفاده می‌کند.
 * - اگر محیط شما fetch ندارد، باید polyfill یا axios بیاورید.
 */
export async function fetchJsonFromUrl(url) {
  try {
    if (!url || typeof url !== 'string') {
      return { success: false, message: 'URL نامعتبر است' };
    }

    const api_token = getApiToken()

    const response = await fetch(url, { method: "POST", 
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({api_token})
     });
     
    if (!response.ok) {
      return { success: false, message: `خطا در درخواست: ${response.status} ${response.statusText}`, status: response.status };
    }

    const contentType = (response.headers && response.headers.get) ? (response.headers.get('content-type') || '') : '';

    let payload;
    if (contentType.includes('application/json') || contentType.includes('text/json')) {
      payload = await response.json();
    } else {
      // تلاش می‌کنیم متن را به JSON پارس کنیم
      const text = await response.text();
      try {
        payload = JSON.parse(text);
      } catch (e) {
        return { success: false, message: 'محتوای دریافتی JSON نیست یا قابل parse نیست', error: e.message };
      }
    }

    return { success: true, payload };
  } catch (err) {
    return { success: false, message: err.message || 'خطای شبکه یا اجرا' };
  }
}
