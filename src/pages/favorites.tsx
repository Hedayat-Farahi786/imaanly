import { useState } from 'react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Heart,
  Search,
  Repeat,
  Volume2,
  Share2,
  Image as ImageIcon,
  List,
  Grid,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DuaFlashcard from '@/components/dua-flashcard';
import { cn } from '@/lib/utils';
import { duaCategories, popularDuas } from '@/data/duas';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favoriteDuas, setFavoriteDuas] = useLocalStorage<typeof popularDuas>('favorite-duas', []);
  const { toast } = useToast();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filteredDuas = favoriteDuas.filter(dua => {
    const matchesSearch = (
      dua.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesCategory = !selectedCategory || dua.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(favoriteDuas.map(dua => dua.category)));

  const removeFavorite = (duaId: string) => {
    setFavoriteDuas(favoriteDuas.filter(dua => dua.id !== duaId));
    toast({
      title: "Removed from favorites",
      description: "Du'a has been removed from your favorites",
    });
  };

  const handleShare = async (dua: typeof popularDuas[0]) => {
    try {
      await navigator.share({
        title: dua.title || "Du'a Share",
        text: `${dua.arabic}\n\n${dua.translation}\n\n- ${dua.reference}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to share. Try copying instead.",
        variant: "destructive",
      });
    }
  };

  if (favoriteDuas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-4">
        <Heart className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl sm:text-2xl font-semibold text-center">No Favorite Du'as Yet</h2>
        <p className="text-muted-foreground text-center max-w-md text-sm sm:text-base">
          Start adding du'as to your favorites to practice and memorize them more easily.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Browse Du'as
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Favorite Du'as</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Your personal collection of saved du'as
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Dialog open={showFlashcards} onOpenChange={setShowFlashcards}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Repeat className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Practice Mode</span>
                <span className="sm:hidden">Practice Mode</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Practice Favorite Du'as</DialogTitle>
                <DialogDescription>
                  Use flashcards to memorize your favorite du'as
                </DialogDescription>
              </DialogHeader>
              <DuaFlashcard duas={filteredDuas} />
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
                Filter Du'as
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filter Du'as</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <Input
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <div className="space-y-2">
                  <Button
                    variant={!selectedCategory ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedCategory(null);
                      setIsFilterOpen(false);
                    }}
                  >
                    All Categories
                  </Button>
                  {categories.map((categoryId) => {
                    const category = duaCategories.find(c => c.id === categoryId);
                    if (!category) return null;
                    return (
                      <Button
                        key={categoryId}
                        variant={selectedCategory === categoryId ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedCategory(categoryId);
                          setIsFilterOpen(false);
                        }}
                      >
                        <category.icon className="mr-2 h-4 w-4" />
                        {category.name}
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
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search favorites..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Button
                variant={!selectedCategory ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories.map((categoryId) => {
                const category = duaCategories.find(c => c.id === categoryId);
                if (!category) return null;
                return (
                  <Button
                    key={categoryId}
                    variant={selectedCategory === categoryId ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Du'as Grid */}
        <div className="flex-1">
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1'
          )}>
            {filteredDuas.map((dua) => (
              <Card key={dua.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-4">
                    <div>
                      <h3 className="font-medium">{dua.title || 'Du\'a'}</h3>
                      <p className="text-sm text-muted-foreground">{dua.reference}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFavorite(dua.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-lg sm:text-xl text-right font-arabic leading-relaxed">
                      {dua.arabic}
                    </p>
                    {viewMode === 'list' && (
                      <>
                        <p className="text-sm italic text-muted-foreground">
                          {dua.transliteration}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {dua.translation}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                        <Volume2 className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Listen</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(dua)}
                        className="text-xs sm:text-sm"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Share</span>
                      </Button>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      For {duaCategories.find(cat => cat.id === dua.category)?.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}