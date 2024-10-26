import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Bookmark, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Verse {
  arabic: string;
  translation: string;
  surah: string;
  ayah: number;
  reference: string;
}

const verses: Verse[] = [
  {
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.",
    surah: "Al-Baqarah",
    ayah: 255,
    reference: "2:255"
  },
  {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    translation: "Actions are but by intentions",
    surah: "Hadith",
    ayah: 1,
    reference: "Bukhari"
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "Indeed, Allah is with the patient.",
    surah: "Al-Baqarah",
    ayah: 153,
    reference: "2:153"
  },
  {
    arabic: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا",
    translation: "And whoever fears Allah - He will make for him a way out.",
    surah: "At-Talaq",
    ayah: 2,
    reference: "65:2"
  },
  {
    arabic: "وَلَا تَقُولُوا لِمَن يُقْتَلُ فِي سَبِيلِ اللَّهِ أَمْوَاتٌ ۚ بَلْ أَحْيَاءٌ وَلَٰكِن لَّا تَشْعُرُونَ",
    translation: "And do not say about those who are killed in the way of Allah, 'They are dead.' Rather, they are alive, but you perceive it not.",
    surah: "Al-Baqarah",
    ayah: 154,
    reference: "2:154"
  },
  {
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ حَقَّ تُقَاتِهِ وَلَا تَمُوتُنَّ إِلَّا وَأَنتُم مُّسْلِمُونَ",
    translation: "O you who have believed, fear Allah as He should be feared and do not die except as Muslims.",
    surah: "Aal-E-Imran",
    ayah: 102,
    reference: "3:102"
  },
  {
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation: "And whoever relies upon Allah - then He is sufficient for him.",
    surah: "At-Talaq",
    ayah: 3,
    reference: "65:3"
  },
  {
    arabic: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
    translation: "And say, 'My Lord, increase me in knowledge.'",
    surah: "Taha",
    ayah: 114,
    reference: "20:114"
  },
  {
    arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    translation: "And seek help through patience and prayer.",
    surah: "Al-Baqarah",
    ayah: 45,
    reference: "2:45"
  },
  {
    arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ",
    translation: "Indeed, Allah loves the doers of good.",
    surah: "Al-Baqarah",
    ayah: 195,
    reference: "2:195"
  },
  {
    arabic: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ",
    translation: "The believers are but brothers.",
    surah: "Al-Hujurat",
    ayah: 10,
    reference: "49:10"
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship comes ease.",
    surah: "Ash-Sharh",
    ayah: 6,
    reference: "94:6"
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    surah: "Al-Baqarah",
    ayah: 152,
    reference: "2:152"
  },
  {
    arabic: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
    translation: "But My mercy encompasses all things.",
    surah: "Al-A'raf",
    ayah: 156,
    reference: "7:156"
  },
  {
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah does not burden a soul beyond that it can bear.",
    surah: "Al-Baqarah",
    ayah: 286,
    reference: "2:286"
  }
];


export default function VerseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [direction, setDirection] = useState(0);

  const nextVerse = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % verses.length);
  };

  const previousVerse = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + verses.length) % verses.length);
  };

  useEffect(() => {
    const timer = setInterval(nextVerse, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Verse of the Day',
        text: `${verses[currentIndex].arabic}\n\n${verses[currentIndex].translation}\n\n- ${verses[currentIndex].reference}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="relative py-12 px-4 sm:px-12">
        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="hover:bg-background/50"
          >
            <Bookmark
              className={cn(
                "h-4 w-4 transition-colors",
                isBookmarked && "fill-primary text-primary"
              )}
            />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleShare}
            className="hover:bg-background/50"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Content - Removed max-width constraint */}
        <div className="px-8 sm:px-16 md:px-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Verse of the Day
                </h3>
                <p className="text-2xl sm:text-3xl md:text-4xl text-right font-arabic leading-relaxed">
                  {verses[currentIndex].arabic}
                </p>
                <p className="text-base sm:text-lg text-muted-foreground">
                  {verses[currentIndex].translation}
                </p>
                <p className="text-sm font-medium">
                  {verses[currentIndex].surah} {verses[currentIndex].reference}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
          <div className="w-12 sm:w-16 bg-gradient-to-r from-background/20 to-transparent h-full" />
          <div className="w-12 sm:w-16 bg-gradient-to-l from-background/20 to-transparent h-full" />
          <Button
            variant="ghost"
            size="icon"
            onClick={previousVerse}
            className="pointer-events-auto absolute left-2 sm:left-4 hover:bg-background/50 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextVerse}
            className="pointer-events-auto absolute right-2 sm:right-4 hover:bg-background/50 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
          {verses.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "w-6 bg-primary" 
                  : "w-1.5 bg-primary/20"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}