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

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favoriteDuas, setFavoriteDuas] = useLocalStorage<typeof popularDuas>('favorite-duas', []);
  const { toast } = useToast();

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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Heart className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">No Favorite Du'as Yet</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Start adding du'as to your favorites to practice and memorize them more easily.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Browse Du'as
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Favorite Du'as</h1>
          <p className="text-muted-foreground">
            Your personal collection of saved du'as
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showFlashcards} onOpenChange={setShowFlashcards}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Repeat className="mr-2 h-4 w-4" />
                Practice Mode
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

      <div className="flex gap-4">
        <div className="w-1/4">
          <Card>
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
                      onClick={() => setSelectedCategory(categoryId)}
                    >
                      <category.icon className="mr-2 h-4 w-4" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'
          )}>
            {filteredDuas.map((dua) => (
              <Card key={dua.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
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
                    <p className="text-xl text-right font-arabic leading-relaxed">
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

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Volume2 className="mr-2 h-4 w-4" />
                        Listen
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(dua)}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {duaCategories.find(cat => cat.id === dua.category)?.name}
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