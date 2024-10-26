import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Bookmark, Copy, Volume2, Share2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface QuranReaderProps {
  surahId: string;
  translationId: string;
  onBookmark?: (verseId: string, surahId: number, verseNumber: number, note?: string) => void;
  onProgress?: (surahNumber: number, ayahNumber: number) => void;
  bookmarks?: Array<{
    id: string;
    verseId: string;
    surahId: number;
    verseNumber: number;
  }>;
  currentPage: number;
  versesPerPage: number;
}

interface Verse {
  number: number;
  text: string;
  translation: string;
  transliteration?: string;
  audioUrl?: string;
  isRead: boolean;
}

export default function QuranReader({
  surahId,
  translationId,
  onBookmark,
  onProgress,
  bookmarks = [],
  currentPage,
  versesPerPage,
}: QuranReaderProps) {
  const [readVerses, setReadVerses] = useState<Set<number>>(new Set());

  const { data: verses, isLoading, error } = useQuery({
    queryKey: ['surah', surahId, translationId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_QURAN_CLOUD_API_URL}/surah/${surahId}/editions/quran-uthmani,${translationId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch surah');
      }

      const data = await response.json();
      return data.data[0].ayahs.map((ayah: any, index: number) => ({
        number: ayah.numberInSurah,
        text: ayah.text,
        translation: data.data[1].ayahs[index].text,
        audioUrl: ayah.audioSecondary?.[0],
        isRead: false
      }));
    }
  });

  const markAsRead = (verseNumber: number) => {
    setReadVerses(prev => {
      const newSet = new Set(prev);
      newSet.add(verseNumber);
      return newSet;
    });
    if (onProgress) {
      onProgress(parseInt(surahId), verseNumber);
    }
    toast.success('Verse marked as read');
  };

  const handleCopyVerse = async (verse: Verse) => {
    try {
      await navigator.clipboard.writeText(`${verse.text}\n\n${verse.translation}`);
      toast.success('Verse copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy verse');
    }
  };

  const handleBookmarkVerse = useCallback((verse: Verse) => {
    if (!onBookmark) return;
    
    const verseId = `${surahId}:${verse.number}`;
    onBookmark(verseId, parseInt(surahId), verse.number);
    toast.success('Verse bookmarked');
  }, [surahId, onBookmark]);

  const handleShare = async (verse: Verse) => {
    try {
      await navigator.share({
        text: `${verse.text}\n\n${verse.translation}\n\nSurah ${surahId}, Verse ${verse.number}`,
      });
    } catch (error) {
      toast.error('Unable to share verse');
    }
  };

  const playAudio = async (audioUrl?: string) => {
    if (!audioUrl) {
      toast.error('Audio not available for this verse');
      return;
    }

    try {
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      toast.error('Failed to play audio');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading surah...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error: {error instanceof Error ? error.message : 'Failed to fetch surah'}
      </div>
    );
  }

  if (!verses || verses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No verses found
      </div>
    );
  }

  const startIndex = (currentPage - 1) * versesPerPage;
  const endIndex = startIndex + versesPerPage;
  const currentVerses = verses.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      {currentVerses.map((verse) => {
        const isBookmarked = bookmarks.some(
          b => b.surahId === parseInt(surahId) && b.verseNumber === verse.number
        );
        const isRead = readVerses.has(verse.number);

        return (
          <div
            key={verse.number}
            className="space-y-4 pb-8 border-b last:border-0"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                  {verse.number}
                </span>
                {isRead && (
                  <span className="text-sm text-green-500 font-medium">
                    Read ✓
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-2xl leading-relaxed text-right font-arabic">
                  {verse.text}
                </p>
                {verse.transliteration && (
                  <p className="text-sm italic text-muted-foreground">
                    {verse.transliteration}
                  </p>
                )}
                <p className="text-muted-foreground">{verse.translation}</p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant={isRead ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => markAsRead(verse.number)}
                  className="gap-2"
                >
                  <CheckCircle className={cn(
                    "h-4 w-4",
                    isRead && "text-green-500"
                  )} />
                  {isRead ? 'Read' : 'Mark as Read'}
                </Button>

                <div className="flex gap-2">
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
                          className={cn(isBookmarked && "text-primary")}
                        >
                          <Bookmark className={cn(
                            "h-4 w-4",
                            isBookmarked && "fill-current"
                          )} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isBookmarked ? 'Remove bookmark' : 'Bookmark verse'}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => playAudio(verse.audioUrl)}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Play audio</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleShare(verse)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share verse</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}