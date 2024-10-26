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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Bookmark,
  Search,
  Repeat,
  Volume2,
  Share2,
  List,
  Grid,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { surahs } from '@/data/quran';
import { cn } from '@/lib/utils';
import QuranFlashcard from '@/components/quran/quran-flashcard';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Bookmark {
  id: string;
  verseId: string;
  surahId: number;
  verseNumber: number;
  note?: string;
  timestamp: number;
  arabic?: string;
  translation?: string;
  transliteration?: string;
}

export default function QuranBookmarks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('quran-bookmarks', []);
  const { toast } = useToast();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const surah = surahs.find(s => s.id === bookmark.surahId);
    const matchesSearch = bookmark.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSurah = !selectedSurah || bookmark.surahId === selectedSurah;
    return matchesSearch && matchesSurah;
  });

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    toast({
      title: "Bookmark removed",
      description: "The verse has been removed from your bookmarks",
    });
  };

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-4">
        <Bookmark className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl sm:text-2xl font-semibold text-center">No Bookmarked Verses</h2>
        <p className="text-muted-foreground text-center max-w-md text-sm sm:text-base">
          Start bookmarking verses to save them for later reference and study.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Return to Quran
        </Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Bookmarked Verses</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Your saved verses for reference and study
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Dialog open={showFlashcards} onOpenChange={setShowFlashcards}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Repeat className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Practice Mode</span>
                <span className="sm:hidden">Practice</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Practice Bookmarked Verses</DialogTitle>
                <DialogDescription>
                  Use flashcards to memorize your bookmarked verses
                </DialogDescription>
              </DialogHeader>
              <QuranFlashcard verses={filteredBookmarks} />
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? (
              <Grid className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Filter Bookmarks
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filter Bookmarks</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <Input
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <div className="space-y-2">
                  <Button
                    variant={!selectedSurah ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedSurah(null);
                      setIsFilterOpen(false);
                    }}
                  >
                    All Surahs
                  </Button>
                  {Array.from(new Set(bookmarks.map(b => b.surahId))).map((surahId) => {
                    const surah = surahs.find(s => s.id === surahId);
                    if (!surah) return null;
                    return (
                      <Button
                        key={surahId}
                        variant={selectedSurah === surahId ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedSurah(surahId);
                          setIsFilterOpen(false);
                        }}
                      >
                        {surah.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filter Sidebar */}
        <Card className="hidden lg:block w-64 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <div className="space-y-2">
              <Button
                variant={!selectedSurah ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedSurah(null)}
              >
                All Surahs
              </Button>
              {Array.from(new Set(bookmarks.map(b => b.surahId))).map((surahId) => {
                const surah = surahs.find(s => s.id === surahId);
                if (!surah) return null;
                return (
                  <Button
                    key={surahId}
                    variant={selectedSurah === surahId ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedSurah(surahId)}
                  >
                    {surah.name}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bookmarks Grid */}
        <div className="flex-1">
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1'
          )}>
            {filteredBookmarks.map((bookmark) => {
              const surah = surahs.find(s => s.id === bookmark.surahId);
              if (!surah) return null;

              return (
                <Card key={bookmark.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-4">
                      <div>
                        <h3 className="font-medium">
                          {surah.name} • Verse {bookmark.verseNumber}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(bookmark.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBookmark(bookmark.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {bookmark.arabic && (
                        <p className="text-lg sm:text-xl text-right font-arabic leading-relaxed">
                          {bookmark.arabic}
                        </p>
                      )}
                      {viewMode === 'list' && (
                        <>
                          {bookmark.transliteration && (
                            <p className="text-sm italic text-muted-foreground">
                              {bookmark.transliteration}
                            </p>
                          )}
                          {bookmark.translation && (
                            <p className="text-sm text-muted-foreground">
                              {bookmark.translation}
                            </p>
                          )}
                        </>
                      )}
                      {bookmark.note && (
                        <p className="text-sm bg-muted/50 p-2 rounded">
                          Note: {bookmark.note}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                          <Volume2 className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Listen</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Share</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}