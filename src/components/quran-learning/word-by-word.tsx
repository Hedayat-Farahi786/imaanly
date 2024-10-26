import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface Word {
  arabic: string;
  transliteration: string;
  translation: string;
  rootWord?: string;
  audioUrl: string;
}

interface Verse {
  number: number;
  words: Word[];
}

const verse: Verse = {
  number: 1,
  words: [
    {
      arabic: 'بِسْمِ',
      transliteration: 'bismi',
      translation: 'In the name',
      rootWord: 'اسم',
      audioUrl: '/audio/bismillah-1.mp3',
    },
    {
      arabic: 'اللَّهِ',
      transliteration: 'allahi',
      translation: 'of Allah',
      audioUrl: '/audio/bismillah-2.mp3',
    },
    {
      arabic: 'الرَّحْمَٰنِ',
      transliteration: 'ar-rahmani',
      translation: 'the Most Gracious',
      rootWord: 'رحم',
      audioUrl: '/audio/bismillah-3.mp3',
    },
    {
      arabic: 'الرَّحِيمِ',
      transliteration: 'ar-rahimi',
      translation: 'the Most Merciful',
      rootWord: 'رحم',
      audioUrl: '/audio/bismillah-4.mp3',
    },
  ],
};

export default function WordByWord() {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word by Word Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 justify-center">
          {verse.words.map((word, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex flex-col gap-1 h-auto py-2"
              onClick={() => setSelectedWord(word)}
            >
              <span className="text-xl font-arabic">{word.arabic}</span>
              <span className="text-xs text-muted-foreground">
                {word.transliteration}
              </span>
            </Button>
          ))}
        </div>

        {selectedWord && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-arabic">{selectedWord.arabic}</p>
                  <p className="text-sm italic">{selectedWord.transliteration}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Translation:</p>
                <p className="text-muted-foreground">{selectedWord.translation}</p>
              </div>

              {selectedWord.rootWord && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Root Word:</p>
                  <p className="text-lg font-arabic">{selectedWord.rootWord}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}