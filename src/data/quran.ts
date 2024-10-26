// Add Quran metadata
export const surahs = [
  { id: 1, name: "Al-Fatihah", arabicName: "الفاتحة", verses: 7 },
  { id: 2, name: "Al-Baqarah", arabicName: "البقرة", verses: 286 },
  { id: 3, name: "Ali 'Imran", arabicName: "آل عمران", verses: 200 },
  // ... Add all 114 surahs
  { id: 114, name: "An-Nas", arabicName: "الناس", verses: 6 }
];

export const juzs = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Juz ${i + 1}`,
  startSurah: 1, // Add correct start surah for each juz
  startVerse: 1, // Add correct start verse for each juz
}));

export interface Verse {
  id: string;
  surahId: number;
  verseNumber: number;
  arabic: string;
  translation: string;
  transliteration: string;
  audioUrl: string;
}

export interface Bookmark {
  id: string;
  verseId: string;
  surahId: number;
  verseNumber: number;
  note?: string;
  timestamp: number;
}