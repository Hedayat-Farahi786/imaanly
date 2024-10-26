import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Bookmark, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Verse {
  number: number;
  text: string;
  translation: string;
}

interface QuranReaderProps {
  surahId: string;
}

export default function QuranReader({ surahId }: QuranReaderProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,en.sahih`
        );
        const data = await response.json();
        
        // Process and combine Arabic text with English translation
        const processedVerses = data.data[0].ayahs.map((ayah: any, index: number) => ({
          number: ayah.numberInSurah,
          text: ayah.text,
          translation: data.data[1].ayahs[index].text,
        }));

        setVerses(processedVerses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surah:', error);
        setLoading(false);
      }
    };

    fetchSurah();
  }, [surahId]);

  const handleCopyVerse = (verse: Verse) => {
    navigator.clipboard.writeText(`${verse.text}\n\n${verse.translation}`);
    // You can add a toast notification here
  };

  const handleBookmarkVerse = (verse: Verse) => {
    // Implement bookmark functionality
    // You can store bookmarks in localStorage or your backend
  };

  if (loading) {
    return <div className="text-center py-8">Loading surah...</div>;
  }

  return (
    <div className="space-y-8">
      {verses.map((verse) => (
        <div
          key={verse.number}
          className="space-y-4 pb-8 border-b last:border-0"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
              {verse.number}
            </span>
            <div className="flex-1 space-y-4">
              <p className="text-2xl leading-relaxed text-right font-arabic">
                {verse.text}
              </p>
              <p className="text-muted-foreground">{verse.translation}</p>
            </div>
            <div className="flex flex-col gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyVerse(verse)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy verse</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleBookmarkVerse(verse)}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bookmark verse</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}