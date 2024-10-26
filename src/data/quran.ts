// Add Quran metadata
export const surahs = [
  { id: 1, name: "Al-Fatihah", arabicName: "الفاتحة", verses: 7 },
  { id: 2, name: "Al-Baqarah", arabicName: "البقرة", verses: 286 },
  { id: 3, name: "Ali 'Imran", arabicName: "آل عمران", verses: 200 },
  { id: 4, name: "An-Nisa", arabicName: "النساء", verses: 176 },
  { id: 5, name: "Al-Ma'idah", arabicName: "المائدة", verses: 120 },
  { id: 6, name: "Al-An'am", arabicName: "الأنعام", verses: 165 },
  { id: 7, name: "Al-A'raf", arabicName: "الأعراف", verses: 206 },
  { id: 8, name: "Al-Anfal", arabicName: "الأنفال", verses: 75 },
  { id: 9, name: "At-Tawbah", arabicName: "التوبة", verses: 129 },
  { id: 10, name: "Yunus", arabicName: "يونس", verses: 109 },
  { id: 11, name: "Hud", arabicName: "هود", verses: 123 },
  { id: 12, name: "Yusuf", arabicName: "يوسف", verses: 111 },
  { id: 13, name: "Ar-Ra'd", arabicName: "الرعد", verses: 43 },
  { id: 14, name: "Ibrahim", arabicName: "إبراهيم", verses: 52 },
  { id: 15, name: "Al-Hijr", arabicName: "الحجر", verses: 99 },
  { id: 16, name: "An-Nahl", arabicName: "النحل", verses: 128 },
  { id: 17, name: "Al-Isra", arabicName: "الإسراء", verses: 111 },
  { id: 18, name: "Al-Kahf", arabicName: "الكهف", verses: 110 },
  { id: 19, name: "Maryam", arabicName: "مريم", verses: 98 },
  { id: 20, name: "Ta-Ha", arabicName: "طه", verses: 135 },
  { id: 21, name: "Al-Anbiya", arabicName: "الأنبياء", verses: 112 },
  { id: 22, name: "Al-Hajj", arabicName: "الحج", verses: 78 },
  { id: 23, name: "Al-Mu'minun", arabicName: "المؤمنون", verses: 118 },
  { id: 24, name: "An-Nur", arabicName: "النور", verses: 64 },
  { id: 25, name: "Al-Furqan", arabicName: "الفرقان", verses: 77 },
  { id: 26, name: "Ash-Shu'ara", arabicName: "الشعراء", verses: 227 },
  { id: 27, name: "An-Naml", arabicName: "النمل", verses: 93 },
  { id: 28, name: "Al-Qasas", arabicName: "القصص", verses: 88 },
  { id: 29, name: "Al-Ankabut", arabicName: "العنكبوت", verses: 69 },
  { id: 30, name: "Ar-Rum", arabicName: "الروم", verses: 60 },
  { id: 31, name: "Luqman", arabicName: "لقمان", verses: 34 },
  { id: 32, name: "As-Sajda", arabicName: "السجدة", verses: 30 },
  { id: 33, name: "Al-Ahzab", arabicName: "الأحزاب", verses: 73 },
  { id: 34, name: "Saba", arabicName: "سبأ", verses: 54 },
  { id: 35, name: "Fatir", arabicName: "فاطر", verses: 45 },
  { id: 36, name: "Ya-Sin", arabicName: "يس", verses: 83 },
  { id: 37, name: "As-Saffat", arabicName: "الصافات", verses: 182 },
  { id: 38, name: "Sad", arabicName: "ص", verses: 88 },
  { id: 39, name: "Az-Zumar", arabicName: "الزمر", verses: 75 },
  { id: 40, name: "Ghafir", arabicName: "غافر", verses: 85 },
  { id: 41, name: "Fussilat", arabicName: "فصلت", verses: 54 },
  { id: 42, name: "Ash-Shura", arabicName: "الشورى", verses: 53 },
  { id: 43, name: "Az-Zukhruf", arabicName: "الزخرف", verses: 89 },
  { id: 44, name: "Ad-Dukhan", arabicName: "الدخان", verses: 59 },
  { id: 45, name: "Al-Jathiyah", arabicName: "الجاثية", verses: 37 },
  { id: 46, name: "Al-Ahqaf", arabicName: "الأحقاف", verses: 35 },
  { id: 47, name: "Muhammad", arabicName: "محمد", verses: 38 },
  { id: 48, name: "Al-Fath", arabicName: "الفتح", verses: 29 },
  { id: 49, name: "Al-Hujurat", arabicName: "الحجرات", verses: 18 },
  { id: 50, name: "Qaf", arabicName: "ق", verses: 45 },
  { id: 51, name: "Adh-Dhariyat", arabicName: "الذاريات", verses: 60 },
  { id: 52, name: "At-Tur", arabicName: "الطور", verses: 49 },
  { id: 53, name: "An-Najm", arabicName: "النجم", verses: 62 },
  { id: 54, name: "Al-Qamar", arabicName: "القمر", verses: 55 },
  { id: 55, name: "Ar-Rahman", arabicName: "الرحمن", verses: 78 },
  { id: 56, name: "Al-Waqi'a", arabicName: "الواقعة", verses: 96 },
  { id: 57, name: "Al-Hadid", arabicName: "الحديد", verses: 29 },
  { id: 58, name: "Al-Mujadila", arabicName: "المجادلة", verses: 22 },
  { id: 59, name: "Al-Hashr", arabicName: "الحشر", verses: 24 },
  { id: 60, name: "Al-Mumtahina", arabicName: "الممتحنة", verses: 13 },
  { id: 61, name: "As-Saff", arabicName: "الصف", verses: 14 },
  { id: 62, name: "Al-Jumu'a", arabicName: "الجمعة", verses: 11 },
  { id: 63, name: "Al-Munafiqun", arabicName: "المنافقون", verses: 11 },
  { id: 64, name: "At-Taghabun", arabicName: "التغابن", verses: 18 },
  { id: 65, name: "At-Talaq", arabicName: "الطلاق", verses: 12 },
  { id: 66, name: "At-Tahrim", arabicName: "التحريم", verses: 12 },
  { id: 67, name: "Al-Mulk", arabicName: "الملك", verses: 30 },
  { id: 68, name: "Al-Qalam", arabicName: "القلم", verses: 52 },
  { id: 69, name: "Al-Haqqah", arabicName: "الحاقة", verses: 52 },
  { id: 70, name: "Al-Ma'arij", arabicName: "المعارج", verses: 44 },
  { id: 71, name: "Nuh", arabicName: "نوح", verses: 28 },
  { id: 72, name: "Al-Jinn", arabicName: "الجن", verses: 28 },
  { id: 73, name: "Al-Muzzammil", arabicName: "المزمل", verses: 20 },
  { id: 74, name: "Al-Muddaththir", arabicName: "المدثر", verses: 56 },
  { id: 75, name: "Al-Qiyama", arabicName: "القيامة", verses: 40 },
  { id: 76, name: "Al-Insan", arabicName: "الإنسان", verses: 31 },
  { id: 77, name: "Al-Mursalat", arabicName: "المرسلات", verses: 50 },
  { id: 78, name: "An-Naba", arabicName: "النبأ", verses: 40 },
  { id: 79, name: "An-Nazi'at", arabicName: "النازعات", verses: 46 },
  { id: 80, name: "Abasa", arabicName: "عبس", verses: 42 },
  { id: 81, name: "At-Takwir", arabicName: "التكوير", verses: 29 },
  { id: 82, name: "Al-Infitar", arabicName: "الإنفطار", verses: 19 },
  { id: 83, name: "Al-Mutaffifin", arabicName: "المطففين", verses: 36 },
  { id: 84, name: "Al-Inshiqaq", arabicName: "الإنشقاق", verses: 25 },
  { id: 85, name: "Al-Buruj", arabicName: "البروج", verses: 22 },
  { id: 86, name: "At-Tariq", arabicName: "الطارق", verses: 17 },
  { id: 87, name: "Al-Ala", arabicName: "الأعلى", verses: 19 },
  { id: 88, name: "Al-Ghashiyah", arabicName: "الغاشية", verses: 26 },
  { id: 89, name: "Al-Fajr", arabicName: "الفجر", verses: 30 },
  { id: 90, name: "Al-Balad", arabicName: "البلد", verses: 20 },
  { id: 91, name: "Ash-Shams", arabicName: "الشمس", verses: 15 },
  { id: 92, name: "Al-Lail", arabicName: "الليل", verses: 21 },
  { id: 93, name: "Ad-Duha", arabicName: "الضحى", verses: 11 },
  { id: 94, name: "Ash-Sharh", arabicName: "الشرح", verses: 8 },
  { id: 95, name: "At-Tin", arabicName: "التين", verses: 8 },
  { id: 96, name: "Al-Alaq", arabicName: "العلق", verses: 19 },
  { id: 97, name: "Al-Qadr", arabicName: "القدر", verses: 5 },
  { id: 98, name: "Al-Bayyina", arabicName: "البينة", verses: 8 },
  { id: 99, name: "Az-Zalzalah", arabicName: "الزلزلة", verses: 8 },
  { id: 100, name: "Al-Adiyat", arabicName: "العاديات", verses: 11 },
  { id: 101, name: "Al-Qari'a", arabicName: "القارعة", verses: 11 },
  { id: 102, name: "At-Takathur", arabicName: "التكاثر", verses: 8 },
  { id: 103, name: "Al-Asr", arabicName: "العصر", verses: 3 },
  { id: 104, name: "Al-Humazah", arabicName: "الهمزة", verses: 9 },
  { id: 105, name: "Al-Fil", arabicName: "الفيل", verses: 5 },
  { id: 106, name: "Quraish", arabicName: "قريش", verses: 4 },
  { id: 107, name: "Al-Ma'un", arabicName: "الماعون", verses: 7 },
  { id: 108, name: "Al-Kawthar", arabicName: "الكوثر", verses: 3 },
  { id: 109, name: "Al-Kafirun", arabicName: "الكافرون", verses: 6 },
  { id: 110, name: "An-Nasr", arabicName: "النصر", verses: 3 },
  { id: 111, name: "Al-Masad", arabicName: "المسد", verses: 5 },
  { id: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", verses: 4 },
  { id: 113, name: "Al-Falaq", arabicName: "الفلق", verses: 5 },
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