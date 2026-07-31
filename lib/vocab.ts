export type LanguagePair = {
  id: string
  from: string
  to: string
  fromShort: string
  toShort: string
  /** BCP-47 code used for speech synthesis of the translated word */
  speechLocale: string
}

export const LANGUAGE_PAIRS: LanguagePair[] = [
  { id: "vi-en", from: "Tiếng Việt", to: "Tiếng Anh", fromShort: "VI", toShort: "EN", speechLocale: "en-US" },
  { id: "vi-fr", from: "Tiếng Việt", to: "Tiếng Pháp", fromShort: "VI", toShort: "FR", speechLocale: "fr-FR" },
  { id: "vi-ja", from: "Tiếng Việt", to: "Tiếng Nhật", fromShort: "VI", toShort: "JA", speechLocale: "ja-JP" },
  { id: "vi-ko", from: "Tiếng Việt", to: "Tiếng Hàn", fromShort: "VI", toShort: "KO", speechLocale: "ko-KR" },
]

export type Recognition = {
  source: string
  partOfSpeech: string
  translation: string
  ipa: string
}

const SAMPLES: Recognition[] = [
  { source: "Cái ghế", partOfSpeech: "danh từ", translation: "Chair", ipa: "/tʃeər/" },
  { source: "Cái bàn", partOfSpeech: "danh từ", translation: "Table", ipa: "/ˈteɪbəl/" },
  { source: "Cửa sổ", partOfSpeech: "danh từ", translation: "Window", ipa: "/ˈwɪndoʊ/" },
  { source: "Cái cốc", partOfSpeech: "danh từ", translation: "Cup", ipa: "/kʌp/" },
]

export function recognizeSample(): Recognition {
  return SAMPLES[0]
}
