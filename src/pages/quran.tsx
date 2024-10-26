import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Book,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Globe,
  PlayCircle,
  Search,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import QuranReader from '@/components/quran/quran-reader';
import AudioPlayer from '@/components/audio-player';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { surahs } from '@/data/quran';
import { toast } from 'sonner';

const translations = [
  { id: 'en.sahih', name: 'Saheeh International' },
  { id: 'en.pickthall', name: 'Pickthall' },
  { id: 'en.yusufali', name: 'Yusuf Ali' },
];

const reciters = [
  { id: 'mishari', name: 'Mishari Rashid Al-Afasy' },
  { id: 'sudais', name: 'Abdurrahman As-Sudais' },
  { id: 'ghamdi', name: 'Saad Al-Ghamdi' },
];

export default function Quran() {
  const [selectedSurah, setSelectedSurah] = useState('1');
  const [selectedReciter, setSelectedReciter] = useState(reciters[0].id);
  const [selectedTranslation, setSelectedTranslation] = useState(translations[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const versesPerPage = 10;
  const [bookmarks, setBookmarks] = useLocalStorage<Array<{
    id: string;
    verseId: string;
    surahId: number;
    verseNumber: number;
    note?: string;
    timestamp: number;
  }>>('quran-bookmarks', []);
  const [readingProgress, setReadingProgress] = useLocalStorage('quran-progress', {
    lastRead: { surah: 1, ayah: 1 },
    completedJuz: new Set<number>(),
    completedSurah: new Set<number>(),
    verseProgress: {} as Record<string, boolean>,
  });

  const { data: verses, isLoading } = useQuery({
    queryKey: ['surah', selectedSurah, selectedTranslation],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_QURAN_CLOUD_API_URL}/surah/${selectedSurah}/editions/quran-uthmani,${selectedTranslation}`
      );
      if (!response.ok) throw new Error('Failed to fetch surah');
      const data = await response.json();
      return data.data[0].ayahs.map((ayah: any, index: number) => ({
        number: ayah.numberInSurah,
        text: ayah.text,
        translation: data.data[1].ayahs[index].text,
        audioUrl: ayah.audioSecondary?.[0],
        isRead: false
      }));
    },
  });

  const totalPages = verses ? Math.ceil(verses.length / versesPerPage) : 0;

  const addBookmark = (verseId: string, surahId: number, verseNumber: number, note?: string) => {
    const existingBookmark = bookmarks.find(b => b.verseId === verseId);
    
    if (existingBookmark) {
      setBookmarks(bookmarks.filter(b => b.verseId !== verseId));
      toast.success('Bookmark removed');
      return;
    }

    const newBookmark = {
      id: Date.now().toString(),
      verseId,
      surahId,
      verseNumber,
      note,
      timestamp: Date.now(),
    };
    setBookmarks([...bookmarks, newBookmark]);
    toast.success('Verse bookmarked successfully');
  };

  const updateProgress = (surahNumber: number, ayahNumber: number) => {
    const verseKey = `${surahNumber}:${ayahNumber}`;
    const newProgress = {
      ...readingProgress,
      lastRead: { surah: surahNumber, ayah: ayahNumber },
      verseProgress: {
        ...readingProgress.verseProgress,
        [verseKey]: true,
      },
    };

    const surah = surahs.find(s => s.id === surahNumber);
    if (surah) {
      const allVersesRead = Array.from({ length: surah.verses }, (_, i) => i + 1)
        .every(verseNum => readingProgress.verseProgress[`${surahNumber}:${verseNum}`]);
      
      if (allVersesRead) {
        newProgress.completedSurah = new Set([...newProgress.completedSurah, surahNumber]);
      }
    }

    setReadingProgress(newProgress);
  };

  return (
    <div className="container mx-auto space-y-8 px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Noble Quran</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Read, listen, and understand the Holy Quran
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 sm:flex-none"
            onClick={() => {
              const { surah, ayah } = readingProgress.lastRead;
              setSelectedSurah(surah.toString());
              setCurrentPage(Math.ceil(ayah / versesPerPage));
            }}
          >
            <Book className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Last Read</span>
            <span className="sm:hidden">Continue</span>
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
            <Link to="/quran/bookmarks">
              <Bookmark className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Bookmarks</span>
              <span className="sm:hidden">Bookmarks</span> ({bookmarks.length})
            </Link>
          </Button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex gap-2">
          <Select value={selectedSurah} onValueChange={setSelectedSurah}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Surah" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {surahs.map(surah => (
                <SelectItem key={surah.id} value={surah.id.toString()}>
                  {surah.id}. {surah.name} ({surah.arabicName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
          <SelectTrigger className="w-full">
            <Globe className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select Translation" />
          </SelectTrigger>
          <SelectContent>
            {translations.map(translation => (
              <SelectItem key={translation.id} value={translation.id}>
                {translation.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in Quran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="read" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-full sm:w-auto">
            <TabsTrigger value="read" className="gap-2">
              <Book className="h-4 w-4" />
              <span className="hidden sm:inline">Read Quran</span>
              <span className="sm:hidden">Read</span>
            </TabsTrigger>
            <TabsTrigger value="listen" className="gap-2">
              <PlayCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Listen to Quran</span>
              <span className="sm:hidden">Listen</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="read" className="space-y-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <QuranReader
                surahId={selectedSurah}
                translationId={selectedTranslation}
                onBookmark={addBookmark}
                onProgress={updateProgress}
                bookmarks={bookmarks}
                currentPage={currentPage}
                versesPerPage={versesPerPage}
              />

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="flex items-center gap-1 text-sm">
                    <span className="hidden sm:inline">Page</span> {currentPage}/{totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listen">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Reciter" />
                </SelectTrigger>
                <SelectContent>
                  {reciters.map(reciter => (
                    <SelectItem key={reciter.id} value={reciter.id}>
                      {reciter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <AudioPlayer
                reciter={selectedReciter}
                surahId={selectedSurah}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Progress Section */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">Reading Progress</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Juz Completion</span>
                <span className="text-muted-foreground">
                  {readingProgress.completedJuz.size}/30 Juz
                </span>
              </div>
              <Progress
                value={(readingProgress.completedJuz.size / 30) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Surah Completion</span>
                <span className="text-muted-foreground">
                  {readingProgress.completedSurah.size}/114 Surah
                </span>
              </div>
              <Progress
                value={(readingProgress.completedSurah.size / 114) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}