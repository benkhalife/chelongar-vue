/**
 * توابع کمکی برای مدیریت مسیر یادگیری
 */

// محاسبه کیفیت پاسخ بر اساس عملکرد
export function calculateQuality(tryCount, correctCount) {
  if (tryCount === 0) return 3;
  
  const accuracy = correctCount / tryCount;
  
  if (accuracy >= 0.95) return 5; // عالی
  if (accuracy >= 0.85) return 4; // خوب
  if (accuracy >= 0.70) return 3; // قابل قبول
  if (accuracy >= 0.50) return 2; // سخت
  if (accuracy >= 0.30) return 1; // خیلی سخت
  return 0; // فراموش شده
}

// ثبت تلاش در بازی - بدون تغییر در correct_count
export function recordGameAttempt(word, isCorrect, sessionId = null) {
  try {
    const historyData = {
      word_id: word.id,
      session_id: sessionId,
      quality: isCorrect ? 4 : 2,
      created_at: new Date().toISOString()
    };
    
    AndroidDB.insert('review_history', JSON.stringify(historyData));
  } catch (error) {
    console.error('خطا در ذخیره تاریخچه بازی:', error);
  }
  
  return word; // بدون تغییر
}

// مدیریت پاسخ صحیح با الگوریتم SM-2
export function handleCorrectAnswer(word, sessionId = null) {
  const updatedWord = { ...word };
  
  // بروزرسانی شمارنده‌ها
  updatedWord.try_count = (updatedWord.try_count || 0) + 1;
  updatedWord.correct_count = (updatedWord.correct_count || 0) + 1;
  updatedWord.review_count = (updatedWord.review_count || 0) + 1;
  
  // محاسبه interval جدید
  if (updatedWord.interval_days === 0) {
    updatedWord.interval_days = 1;
  } else if (updatedWord.interval_days === 1) {
    updatedWord.interval_days = 3;
  } else {
    updatedWord.interval_days = Math.round(
      updatedWord.interval_days * (updatedWord.easiness_factor || 2.5)
    );
  }
  
  // افزایش easiness_factor (کیفیت 4 فرض می‌شود)
  updatedWord.easiness_factor = Math.max(
    1.3,
    (updatedWord.easiness_factor || 2.5) + 0.1
  );
  
  // محاسبه تاریخ مرور بعدی
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + updatedWord.interval_days);
  updatedWord.next_review_date = nextDate.toISOString();
  updatedWord.last_review_date = new Date().toISOString();
  
  // بررسی وضعیت یادگیری
  updatedWord.learned = updatedWord.correct_count >= 3;
  updatedWord.mastered = 
    updatedWord.correct_count >= 5 && 
    updatedWord.interval_days >= 21;
  
  updatedWord.updated_at = new Date().toISOString();
  
  // ذخیره در review_history
  try {
    const historyData = {
      word_id: updatedWord.id,
      session_id: sessionId,
      quality: 4,
      created_at: new Date().toISOString()
    };
    
    AndroidDB.insert('review_history', JSON.stringify(historyData));
  } catch (error) {
    console.error('خطا در ذخیره تاریخچه:', error);
  }
  
  return updatedWord;
}

// مدیریت پاسخ غلط با الگوریتم SM-2
export function handleWrongAnswer(word, sessionId = null) {
  const updatedWord = { ...word };
  
  // بروزرسانی شمارنده‌ها
  updatedWord.try_count = (updatedWord.try_count || 0) + 1;
  updatedWord.correct_count = 0; // ریست
  updatedWord.review_count = (updatedWord.review_count || 0) + 1;
  
  // ریست interval به روز اول
  updatedWord.interval_days = 1;
  
  // کاهش easiness_factor (کیفیت 2 فرض می‌شود)
  updatedWord.easiness_factor = Math.max(
    1.3,
    (updatedWord.easiness_factor || 2.5) - 0.16
  );
  
  // محاسبه تاریخ مرور بعدی (فردا)
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 1);
  updatedWord.next_review_date = nextDate.toISOString();
  updatedWord.last_review_date = new Date().toISOString();
  
  // ریست وضعیت یادگیری
  updatedWord.learned = false;
  updatedWord.mastered = false;
  
  updatedWord.updated_at = new Date().toISOString();
  
  // ذخیره در review_history
  try {
    const historyData = {
      word_id: updatedWord.id,
      session_id: sessionId,
      quality: 2,
      created_at: new Date().toISOString()
    };
    
    AndroidDB.insert('review_history', JSON.stringify(historyData));
  } catch (error) {
    console.error('خطا در ذخیره تاریخچه:', error);
  }
  
  return updatedWord;
}

// دریافت لغاتی که نیاز به مرور دارند
export function getWordsNeedingReview(packageId, limit = 10) {
  try {
    const result = JSON.parse(
      AndroidDB.select(
        'words',
        '*',
        `package_id = ? 
         AND try_count > 0 
         AND learned = 0
         AND mastered = 0`,
        JSON.stringify([packageId]),
        'next_review_date ASC, correct_count ASC, last_review_date ASC',
        limit.toString()
      )
    );
    
    if (result.success && result.data) {
      // دریافت meanings برای هر لغت
      for (let word of result.data) {
        const meaningsResult = JSON.parse(
          AndroidDB.select(
            'meanings',
            '*',
            'word_id = ?',
            JSON.stringify([word.id]),
            '',
            ''
          )
        );
        
        word.meanings = meaningsResult.success ? meaningsResult.data : [];
      }
      
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('خطا در دریافت لغات نیازمند مرور:', error);
    return [];
  }
}

// چک کردن نیاز به مرور قبل از شروع session
export function shouldShowReviewBeforeSession(packageId) {
  try {
    const reviewWords = getWordsNeedingReview(packageId, 20);
    
    return {
      needReview: reviewWords.length >= 1,
      wordCount: reviewWords.length,
      words: reviewWords
    };
  } catch (error) {
    console.error('خطا در چک کردن نیاز به مرور:', error);
    return {
      needReview: false,
      wordCount: 0,
      words: []
    };
  }
}

// دریافت تمرین بعدی
// 🔥 اصلاح شده: دریافت تمرین بعدی (هم learning و هم review)
export function getNextSession(packageId) {
  try {
    // ابتدا به دنبال تمرین learning می‌گردیم
    const learningResult = JSON.parse(
      AndroidDB.first(
        'sessions',
        '*',
        'package_id = ? AND status = ? AND session_type = ?',
        JSON.stringify([packageId, 'pending', 'learning']),
        'position ASC'
      )
    );
    
    // اگر تمرین learning پیدا شد
    if (learningResult.success && learningResult.data) {
      const session = learningResult.data;
      
      // دریافت لغات این session به همراه meanings
      const wordsResult = JSON.parse(
        AndroidDB.select(
          'session_words sw INNER JOIN words w ON sw.word_id = w.id',
          'w.*',
          'sw.session_id = ?',
          JSON.stringify([session.id]),
          'sw.position ASC',
          ''
        )
      );
      
      const words = wordsResult.success ? wordsResult.data : [];
      
      // دریافت meanings برای هر لغت
      for (let word of words) {
        const meaningsResult = JSON.parse(
          AndroidDB.select(
            'meanings',
            '*',
            'word_id = ?',
            JSON.stringify([word.id]),
            '',
            ''
          )
        );
        
        word.meanings = meaningsResult.success ? meaningsResult.data : [];
      }
      
      return {
        session: session,
        words: words
      };
    }
    
    // اگر تمرین learning نبود، به دنبال تمرین review می‌گردیم
    const reviewResult = JSON.parse(
      AndroidDB.first(
        'sessions',
        '*',
        'package_id = ? AND status = ? AND session_type = ?',
        JSON.stringify([packageId, 'pending', 'review']),
        'position ASC'
      )
    );
    
    if (reviewResult.success && reviewResult.data) {
      const session = reviewResult.data;
      
      // دریافت لغات این session به همراه meanings
      const wordsResult = JSON.parse(
        AndroidDB.select(
          'session_words sw INNER JOIN words w ON sw.word_id = w.id',
          'w.*',
          'sw.session_id = ?',
          JSON.stringify([session.id]),
          'sw.position ASC',
          ''
        )
      );
      
      const words = wordsResult.success ? wordsResult.data : [];
      
      // دریافت meanings برای هر لغت
      for (let word of words) {
        const meaningsResult = JSON.parse(
          AndroidDB.select(
            'meanings',
            '*',
            'word_id = ?',
            JSON.stringify([word.id]),
            '',
            ''
          )
        );
        
        word.meanings = meaningsResult.success ? meaningsResult.data : [];
      }
      
      return {
        session: session,
        words: words
      };
    }
    
    return null;
  } catch (error) {
    console.error('خطا در دریافت تمرین بعدی:', error);
    return null;
  }
}

// دریافت لیست تمام تمرین‌های یادگیری
export function getAllSessions(packageId) {
  try {
    const result = JSON.parse(
      AndroidDB.select(
        'sessions',
        '*',
        'package_id = ?',
        JSON.stringify([packageId]),
        'position ASC',
        ''
      )
    );
    
    if (result.success) {
      return result.data || [];
    }
    return [];
  } catch (error) {
    console.error('خطا در دریافت لیست تمرین‌ها:', error);
    return [];
  }
}

// دریافت تمرین‌های تکمیل شده
export function getCompletedSessions(packageId) {
  try {
    const result = JSON.parse(
      AndroidDB.select(
        'sessions',
        '*',
        'package_id = ? AND status = ?',
        JSON.stringify([packageId, 'completed']),
        'position ASC',
        ''
      )
    );
    
    if (result.success) {
      return result.data || [];
    }
    return [];
  } catch (error) {
    console.error('خطا در دریافت تمرین‌های تکمیل شده:', error);
    return [];
  }
}

// علامت‌گذاری session به عنوان تکمیل شده
export async function completeSession(sessionId) {
  try {
    const updateData = {
      status: 'completed',
      completed_at: new Date().toISOString()
    };
    
    const result = JSON.parse(
      AndroidDB.update(
        'sessions',
        JSON.stringify(updateData),
        'id = ?',
        JSON.stringify([sessionId])
      )
    );
    
    return result;
  } catch (error) {
    console.error('خطا در تکمیل session:', error);
    return { success: false, message: error.message };
  }
}

// 🔥 اصلاح شده: دریافت آمار پیشرفت (شامل review sessions)
export function getProgress(packageId) {
  try {
    // تعداد کل لغات
    const totalResult = JSON.parse(
      AndroidDB.select(
        'words',
        'COUNT(*) as total',
        'package_id = ?',
        JSON.stringify([packageId]),
        '',
        ''
      )
    );
    
    // لغات یاد گرفته شده
    const learnedResult = JSON.parse(
      AndroidDB.select(
        'words',
        'COUNT(*) as learned',
        'package_id = ? AND learned = 1',
        JSON.stringify([packageId]),
        '',
        ''
      )
    );
    
    // لغات mastered
    const masteredResult = JSON.parse(
      AndroidDB.select(
        'words',
        'COUNT(*) as mastered',
        'package_id = ? AND mastered = 1',
        JSON.stringify([packageId]),
        '',
        ''
      )
    );
    
    // تمرین‌های تکمیل شده (هم learning و هم review)
    const completedSessionsResult = JSON.parse(
      AndroidDB.select(
        'sessions',
        'COUNT(*) as completed',
        'package_id = ? AND status = ?',
        JSON.stringify([packageId, 'completed']),
        '',
        ''
      )
    );
    
    // کل تمرین‌ها (هم learning و هم review)
    const totalSessionsResult = JSON.parse(
      AndroidDB.select(
        'sessions',
        'COUNT(*) as total',
        'package_id = ?',
        JSON.stringify([packageId]),
        '',
        ''
      )
    );
    
    return {
      totalWords: totalResult.data?.[0]?.total || 0,
      learnedWords: learnedResult.data?.[0]?.learned || 0,
      masteredWords: masteredResult.data?.[0]?.mastered || 0,
      completedSessions: completedSessionsResult.data?.[0]?.completed || 0,
      totalSessions: totalSessionsResult.data?.[0]?.total || 0
    };
  } catch (error) {
    console.error('خطا در دریافت آمار پیشرفت:', error);
    return null;
  }
}


// ایجاد تمرین‌های مروری جدید برای لغات یاد نگرفته شده
export function createReviewSessions(packageId, wordsPerSession = 10) {
  try {
    // دریافت لغات یاد نگرفته شده (learned = 0)
    const unlearnedWordsResult = JSON.parse(
      AndroidDB.select(
        'words',
        '*',
        'package_id = ? AND learned = 0 AND try_count > 0',
        JSON.stringify([packageId]),
        'correct_count ASC, last_review_date ASC',
        ''
      )
    );
    
    if (!unlearnedWordsResult.success || !unlearnedWordsResult.data || unlearnedWordsResult.data.length === 0) {
      return {
        success: true,
        message: 'لغتی برای ایجاد تمرین مروری یافت نشد',
        sessionsCreated: 0
      };
    }
    
    const unlearnedWords = unlearnedWordsResult.data;
    
    // تقسیم لغات به چانک‌ها
    const chunks = [];
    for (let i = 0; i < unlearnedWords.length; i += wordsPerSession) {
      chunks.push(unlearnedWords.slice(i, i + wordsPerSession));
    }
    
    // دریافت آخرین position موجود
    const lastPositionResult = JSON.parse(
      AndroidDB.select(
        'sessions',
        'MAX(position) as max_position',
        'package_id = ?',
        JSON.stringify([packageId]),
        '',
        ''
      )
    );
    
    let position = (lastPositionResult.data?.[0]?.max_position || -1) + 1;
    let sessionsCreated = 0;
    
    // ایجاد session های مروری
    for (const chunk of chunks) {
      const sessionData = {
        package_id: packageId,
        session_type: 'review',
        status: 'pending',
        word_count: chunk.length,
        position: position++,
        created_at: new Date().toISOString()
      };
      
      const sessionResult = JSON.parse(
        AndroidDB.insert('sessions', JSON.stringify(sessionData))
      );
      
      if (!sessionResult.success) {
        console.error('خطا در ایجاد session مروری');
        continue;
      }
      
      const sessionId = sessionResult.insertId;
      
      // افزودن لغات به session
      for (let i = 0; i < chunk.length; i++) {
        const wordData = {
          session_id: sessionId,
          word_id: chunk[i].id,
          position: i
        };
        
        AndroidDB.insert('session_words', JSON.stringify(wordData));
      }
      
      sessionsCreated++;
    }
    
    return {
      success: true,
      message: `${sessionsCreated} تمرین مروری جدید ایجاد شد`,
      sessionsCreated: sessionsCreated,
      totalUnlearnedWords: unlearnedWords.length
    };
    
  } catch (error) {
    console.error('خطا در ایجاد تمرین‌های مروری:', error);
    return {
      success: false,
      message: error.message,
      sessionsCreated: 0
    };
  }
}

// پردازش نهایی لغات session - فراخوانی در پایان تمام بازی‌ها
export async function finalizeSessionWords(sessionId, words) {
  try {
    // دریافت تاریخچه این session از review_history
    const historyResult = JSON.parse(
      AndroidDB.select(
        'review_history',
        'word_id, quality, created_at',
        'session_id = ?',
        JSON.stringify([sessionId]),
        'created_at ASC',
        ''
      )
    );
    
    if (!historyResult.success || !historyResult.data) {
      console.error('خطا در دریافت تاریخچه session');
      return { success: false };
    }
    
    // گروه‌بندی بر اساس word_id
    const wordStats = {};
    historyResult.data.forEach(record => {
      if (!wordStats[record.word_id]) {
        wordStats[record.word_id] = { correct: 0, wrong: 0 };
      }
      
      if (record.quality >= 4) {
        wordStats[record.word_id].correct++;
      } else {
        wordStats[record.word_id].wrong++;
      }
    });
    
    // بروزرسانی هر لغت
    for (const word of words) {
      const stats = wordStats[word.id];
      if (!stats) continue; // اگر لغت در بازی شرکت نکرده
      
      // تصمیم‌گیری: اگر بیش از 70% درست باشد = موفق
      const totalAttempts = stats.correct + stats.wrong;
      const accuracy = stats.correct / totalAttempts;
      const isSuccess = accuracy >= 0.7;
      
      // یک‌بار بروزرسانی SM-2
      const updatedWord = isSuccess 
        ? handleCorrectAnswer(word, sessionId)
        : handleWrongAnswer(word, sessionId);
      
      // ذخیره در دیتابیس - تبدیل boolean به integer برای SQLite
      const updateResult = JSON.parse(
        AndroidDB.update(
          'words',
          JSON.stringify({
            try_count: updatedWord.try_count,
            correct_count: updatedWord.correct_count,
            review_count: updatedWord.review_count,
            interval_days: updatedWord.interval_days,
            easiness_factor: updatedWord.easiness_factor,
            next_review_date: updatedWord.next_review_date,
            last_review_date: updatedWord.last_review_date,
            learned: updatedWord.learned ? 1 : 0, // تبدیل به 0/1
            mastered: updatedWord.mastered ? 1 : 0, // تبدیل به 0/1
            updated_at: updatedWord.updated_at
          }),
          'id = ?',
          JSON.stringify([word.id])
        )
      );
      
      if (!updateResult.success) {
        console.error(`خطا در بروزرسانی لغت ${word.id}`);
      }
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('خطا در پردازش نهایی session:', error);
    return { success: false, message: error.message };
  }
}