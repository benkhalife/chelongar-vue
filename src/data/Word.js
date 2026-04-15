import { select } from "./Database";

export async function getWordsWithMeanings(where = '', whereArgs = [], orderBy = '', limit = '') {
  const result = await select('words', '*', where, whereArgs, orderBy, limit);
  const words = result.data;


  initMeaningWords(words)

  console.log('words in model', words);

  return words;
}

export async function initMeaningWords(words) {
  for (const word of words) {
    initMeaningWord(word)
  }
}

export async function initMeaningWord(word) {
  const resM = await select('meanings', 'meaning,word_id', 'word_id = ?', [word.id]);
  const meanings = resM.data;
  word.meanings = meanings;
}

export class staticData {
  static words;
  static session;
  static shouldGoToLearningAfterReview;
  static pendingLearningSession;
  static pendingLearningWords;
}


// اضافه کردن این متد به انتهای فایل
export async function saveWordToDB(word) {
  try {
    const updateData = {
      try_count: word.try_count,
      correct_count: word.correct_count,
      easiness_factor: word.easiness_factor,
      interval_days: word.interval_days,
      next_review_date: word.next_review_date,
      last_review_date: word.last_review_date,
      review_count: word.review_count,
      mastered: word.mastered ? 1 : 0,
      learned: word.learned ? 1 : 0,
      updated_at: word.updated_at
    };

    const result = JSON.parse(
      AndroidDB.update(
        'words',
        JSON.stringify(updateData),
        'id = ?',
        JSON.stringify([word.id])
      )
    );

    return result.success;
  } catch (error) {
    console.error('خطا در ذخیره لغت:', error);
    return false;
  }
}

export function isColorCode(value) {
  if (!value || typeof value !== 'string') return false;
  // بررسی الگوی کد رنگ Hex
  const colorRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;
  return colorRegex.test(value.trim());
};