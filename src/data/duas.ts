import { 
  SunIcon, 
  MoonIcon, 
  CalendarIcon, 
  UtensilsIcon,
  PlaneIcon,
  HeartIcon
} from 'lucide-react';

export const duaCategories = [
  {
    id: 'morning',
    name: 'Morning Adhkar',
    description: 'Duas for the morning',
    icon: SunIcon,
  },
  {
    id: 'evening',
    name: 'Evening Adhkar',
    description: 'Duas for the evening',
    icon: MoonIcon,
  },
  {
    id: 'daily',
    name: 'Daily Activities',
    description: 'Duas for daily activities',
    icon: CalendarIcon,
  },
  {
    id: 'food',
    name: 'Food & Drink',
    description: 'Duas before and after eating',
    icon: UtensilsIcon,
  },
  {
    id: 'sleep',
    name: 'Sleep',
    description: 'Duas before sleeping and after waking up',
    icon: MoonIcon,
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Duas for traveling',
    icon: PlaneIcon,
  },
  {
    id: 'mood',
    name: 'Emotional Well-being',
    description: 'Duas for different emotional states',
    icon: HeartIcon,
    subcategories: [
      {
        id: 'anxiety',
        name: 'Anxiety & Worry',
        duas: [
          {
            id: 'anxiety-1',
            arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
            transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan",
            translation: 'O Allah, I seek refuge in You from anxiety and sorrow',
            reference: 'Bukhari',
          },
        ],
      },
      {
        id: 'happiness',
        name: 'Joy & Gratitude',
        duas: [
          {
            id: 'happiness-1',
            arabic: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
            transliteration: "Alhamdulillahil-ladhi bi ni'matihi tatimmus-salihat",
            translation: 'Praise be to Allah by whose grace good deeds are completed',
            reference: 'Ibn Majah',
          },
        ],
      },
    ],
  },
];

export const popularDuas = [
  {
    id: 'protection',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahil-ladhi la yadurru ma'as-mihi shai'un fil-ardi wa la fis-sama'i, wa Huwas-Sami'ul-'Alim",
    translation: 'In the Name of Allah, Who with His Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    reference: 'Abu Dawud',
    category: 'protection',
    favorite: false,
    audio: 'https://audio.example.com/dua1.mp3',
  },
  {
    id: 'forgiveness',
    arabic: 'رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا',
    transliteration: 'Rabbana-ghfir lana dhunubana wa israfana fi amrina',
    translation: 'Our Lord! Forgive us our sins and our transgressions, establish our feet firmly.',
    reference: 'Quran 3:147',
    category: 'forgiveness',
    favorite: false,
    audio: 'https://audio.example.com/dua2.mp3',
  },
  // Add more duas...
];