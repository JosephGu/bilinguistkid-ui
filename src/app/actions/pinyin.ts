"use server";

import pinyin from "pinyin";

export const getPinyin = async (word: string) => {
  const pinyinResult = pinyin(word, {
    style: pinyin.STYLE_TONE,
    heteronym: true,
    segment: true,
  });
  return pinyinResult.map((item) => item.join("")).join(" ");
};