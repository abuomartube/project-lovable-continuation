/** Unicode ranges: Arabic (0600-06FF), Arabic Supplement (0750-077F),
 * Arabic Extended-A (08A0-08FF), Presentation Forms-A (FB50-FDFF), Forms-B (FE70-FEFF). */
const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const ARABIC_RE_GLOBAL = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
const LETTER_RE = /[\p{L}]/gu;

export const containsArabic = (text: string): boolean => ARABIC_RE.test(text);

/** Ratio of Arabic letters to total letters (0..1). Empty string ⇒ 0. */
export const arabicRatio = (text: string): number => {
  const letters = text.match(LETTER_RE)?.length ?? 0;
  if (letters === 0) return 0;
  const arabic = text.match(ARABIC_RE_GLOBAL)?.length ?? 0;
  return arabic / letters;
};