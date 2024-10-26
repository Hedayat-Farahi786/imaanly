import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  ChevronRight,
  Repeat,
  Volume2,
} from 'lucide-react';
import { surahs } from '@/data/quran';
import { Bookmark } from '@/data/quran';

interface QuranFlashcardProps {
  verses: Bookmark[];
}

export default function QuranFlashcard({ verses }: QuranFlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<string>>(new Set());

  const currentVerse = verses[currentIndex];
  const surah = currentVerse ? surahs.find(s => s.id === currentVerse.surahId) : null;

  const progress = (mastered.size / verses.length) * 100;

  const nextVerse = () => {
    setCurrentIndex((prev) => (prev + 1) % verses.length);
    setIsFlipped(false);
  };

  const previousVerse = () => {
    setCurrentIndex((prev) => (prev - 1 + verses.length) % verses.length);
    setIsFlipped(false);
  };

  if (!currentVerse || !surah) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {verses.length} Verses
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {mastered.size} Mastered
          </span>
          <Progress value={progress} className="w-24 h-2" />
        </div>
      </div>

      <div
        className={`relative min-h-[400px] rounded-lg border bg-card p-6 text-card-foreground shadow cursor-pointer perspective-1000 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.6s' }}
      >
        <div
          className={`absolute inset-0 backface-hidden p-6 ${
            isFlipped ? 'hidden' : ''
          }`}
        >
          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                {surah.name} • Verse {currentVerse.verseNumber}
              </span>
            </div>
            <p className="text-2xl text-right font-arabic leading-relaxed">
              {currentVerse.arabic}
            </p>
            <p className="text-sm text-center text-muted-foreground">
              Click to reveal translation
            </p>
          </div>
        </div>

        <div
          className={`absolute inset-0 backface-hidden p-6 ${
            !isFlipped ? 'hidden' : ''
          }`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="space-y-4 text-center">
            <p className="text-sm italic">{currentVerse.transliteration}</p>
            <p>{currentVerse.translation}</p>
            {currentVerse.note && (
              <p className="text-sm bg-muted/50 p-2 rounded">
                Note: {currentVerse.note}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={previousVerse}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button
            variant={mastered.has(currentVerse.id) ? "default" : "outline"}
            onClick={() => {
              const newMastered = new Set(mastered);
              if (mastered.has(currentVerse.id)) {
                newMastered.delete(currentVerse.id);
              } else {
                newMastered.add(currentVerse.id);
              }
              setMastered(newMastered);
            }}
          >
            <Repeat className="mr-2 h-4 w-4" />
            {mastered.has(currentVerse.id) ? "Mastered" : "Mark as Mastered"}
          </Button>
        </div>

        <Button variant="outline" size="icon" onClick={nextVerse}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}