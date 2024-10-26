import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Repeat, Volume2 } from 'lucide-react';

interface Verse {
  arabic: string;
  transliteration: string;
  translation: string;
  audioUrl: string;
}

const verses: Verse[] = [
  {
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'Bismillah ir-Rahman ir-Raheem',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
    audioUrl: '/audio/bismillah.mp3',
  },
  // Add more verses
];

export default function MemorizationTool() {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [repetitions, setRepetitions] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const currentVerse = verses[currentVerseIndex];

  const nextVerse = () => {
    setCurrentVerseIndex((prev) => (prev + 1) % verses.length);
    setShowTranslation(false);
    setRepetitions(0);
  };

  const previousVerse = () => {
    setCurrentVerseIndex((prev) => (prev - 1 + verses.length) % verses.length);
    setShowTranslation(false);
    setRepetitions(0);
  };

  const playAudio = () => {
    if (!audio) {
      const newAudio = new Audio(currentVerse.audioUrl);
      newAudio.onended = () => {
        setRepetitions((prev) => prev + 1);
      };
      setAudio(newAudio);
      newAudio.play();
    } else {
      audio.currentTime = 0;
      audio.play();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memorization Helper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p className="text-2xl text-right font-arabic leading-relaxed">
            {currentVerse.arabic}
          </p>
          <Button
            variant="ghost"
            className="w-full text-left"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            {showTranslation ? (
              <p className="text-sm text-muted-foreground">
                {currentVerse.translation}
              </p>
            ) : (
              <p className="text-sm italic">{currentVerse.transliteration}</p>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Repetitions</span>
            <span>{repetitions}/10</span>
          </div>
          <Progress value={(repetitions / 10) * 100} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={previousVerse}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={playAudio}>
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={playAudio}>
              <Repeat className="mr-2 h-4 w-4" />
              Repeat
            </Button>
          </div>

          <Button variant="outline" size="icon" onClick={nextVerse}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}