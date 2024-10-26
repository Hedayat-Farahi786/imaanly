import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  ChevronRight,
  Repeat,
  Volume2,
} from 'lucide-react';
import { duaCategories } from '@/data/duas';

interface DuaFlashcardProps {
  duas: Array<{
    id: string;
    title: string;
    arabic: string;
    transliteration: string;
    translation: string;
    reference: string;
    category: string;
    audio?: string;
  }>;
}

export default function DuaFlashcard({ duas }: DuaFlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<string>>(new Set());

  const currentDua = duas[currentIndex];
  const progress = (mastered.size / duas.length) * 100;
  const category = duaCategories.find(cat => cat.id === currentDua?.category);

  const nextDua = () => {
    setCurrentIndex((prev) => (prev + 1) % duas.length);
    setIsFlipped(false);
  };

  const previousDua = () => {
    setCurrentIndex((prev) => (prev - 1 + duas.length) % duas.length);
    setIsFlipped(false);
  };

  const toggleMastered = () => {
    const newMastered = new Set(mastered);
    if (mastered.has(currentDua.id)) {
      newMastered.delete(currentDua.id);
    } else {
      newMastered.add(currentDua.id);
    }
    setMastered(newMastered);
  };

  if (!currentDua) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {duas.length} Du'as
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
                {category?.name}
              </span>
              <h3 className="text-lg font-medium">{currentDua.title}</h3>
            </div>
            <p className="text-2xl text-right font-arabic leading-relaxed">
              {currentDua.arabic}
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
            <p className="text-sm italic">{currentDua.transliteration}</p>
            <p>{currentDua.translation}</p>
            <p className="text-sm text-muted-foreground">
              {currentDua.reference}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={previousDua}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button
            variant={mastered.has(currentDua.id) ? "default" : "outline"}
            onClick={toggleMastered}
          >
            <Repeat className="mr-2 h-4 w-4" />
            {mastered.has(currentDua.id) ? "Mastered" : "Mark as Mastered"}
          </Button>
        </div>

        <Button variant="outline" size="icon" onClick={nextDua}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}