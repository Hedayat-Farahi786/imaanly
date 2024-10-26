import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Bookmark, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  // Add more verses
];

export default function VerseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const nextVerse = () => {
    setCurrentIndex((prev) => (prev + 1) % verses.length);
  };

  const previousVerse = () => {
    setCurrentIndex((prev) => (prev - 1 + verses.length) % verses.length);
  };

  useEffect(() => {
    const timer = setInterval(nextVerse, 10000); // Auto-advance every 10 seconds
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
      <CardContent className="p-6">
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark
              className={cn(
                "h-4 w-4",
                isBookmarked && "fill-primary text-primary"
              )}
            />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Verse of the Day
            </h3>
            <p className="text-2xl text-right font-arabic leading-relaxed">
              {verses[currentIndex].arabic}
            </p>
            <p className="text-base text-muted-foreground">
              {verses[currentIndex].translation}
            </p>
            <p className="text-sm font-medium">
              {verses[currentIndex].surah} {verses[currentIndex].reference}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousVerse}
              className="absolute left-2 top-1/2 -translate-y-1/2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextVerse}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}