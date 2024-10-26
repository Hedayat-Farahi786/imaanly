import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Prayer Times
      prayerTimes: {
        title: 'Prayer Times',
        fajr: 'Fajr',
        sunrise: 'Sunrise',
        dhuhr: 'Dhuhr',
        asr: 'Asr',
        maghrib: 'Maghrib',
        isha: 'Isha',
      },
      // Quran
      quran: {
        title: 'Noble Quran',
        search: 'Search in Quran',
        surah: 'Surah',
        juz: 'Juz',
        verse: 'Verse',
        translation: 'Translation',
        recitation: 'Recitation',
      },
      // Duas
      duas: {
        title: "Du'a Collection",
        search: "Search du'as",
        categories: 'Categories',
        favorites: 'Favorites',
        morning: 'Morning',
        evening: 'Evening',
        daily: 'Daily',
      },
      // Learning
      learn: {
        title: 'Learn Islam',
        prayerGuides: 'Prayer Guides',
        quranLessons: 'Quran Lessons',
        progress: 'My Progress',
      },
      // Auth
      auth: {
        login: 'Log In',
        signup: 'Sign Up',
        logout: 'Log Out',
        email: 'Email',
        password: 'Password',
        name: 'Name',
      },
    },
  },
  de: {
    translation: {
      // Prayer Times
      prayerTimes: {
        title: 'Gebetszeiten',
        fajr: 'Fadschr',
        sunrise: 'Sonnenaufgang',
        dhuhr: 'Dhuhr',
        asr: 'Asr',
        maghrib: 'Maghrib',
        isha: 'Ischa',
      },
      // Quran
      quran: {
        title: 'Der edle Koran',
        search: 'Im Koran suchen',
        surah: 'Sure',
        juz: 'Dschuz',
        verse: 'Vers',
        translation: 'Übersetzung',
        recitation: 'Rezitation',
      },
      // Add more German translations
    },
  },
  fa: {
    translation: {
      // Prayer Times
      prayerTimes: {
        title: 'اوقات نماز',
        fajr: 'فجر',
        sunrise: 'طلوع آفتاب',
        dhuhr: 'ظهر',
        asr: 'عصر',
        maghrib: 'مغرب',
        isha: 'عشاء',
      },
      // Add more Dari translations
    },
  },
  ps: {
    translation: {
      // Prayer Times
      prayerTimes: {
        title: 'د لمونځ وختونه',
        fajr: 'سهار',
        sunrise: 'لمر ختل',
        dhuhr: 'غرمه',
        asr: 'مازدیګر',
        maghrib: 'ماښام',
        isha: 'خفتن',
      },
      // Add more Pashto translations
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;