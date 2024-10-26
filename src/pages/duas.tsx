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
  Filter,
  Heart,
  Search,
  Star,
  Clock,
  MoreVertical,
  Share2,
  BookmarkPlus,
  Repeat,
  Volume2,
  Download,
  Image as ImageIcon,
  Copy,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DuaFlashcard from '@/components/dua-flashcard';
import { cn } from '@/lib/utils';
import { duaCategories, popularDuas } from '@/data/duas';
import html2canvas from 'html2canvas';
import { useTheme } from '@/components/theme-provider';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function Duas() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [duas, setDuas] = useState(popularDuas);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [favoriteDuas, setFavoriteDuas] = useLocalStorage<typeof popularDuas>('favorite-duas', []);
  const { toast } = useToast();
  const { theme } = useTheme();

  const filteredDuas = duas.filter(dua => {
    const matchesSearch = dua.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dua.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (dua: typeof duas[0]) => {
    const isFavorite = favoriteDuas.some(fav => fav.id === dua.id);
    
    if (isFavorite) {
      setFavoriteDuas(favoriteDuas.filter(fav => fav.id !== dua.id));
      toast({
        title: "Removed from favorites",
        description: "Du'a has been removed from your favorites",
      });
    } else {
      setFavoriteDuas([...favoriteDuas, dua]);
      toast({
        title: "Added to favorites",
        description: "Du'a has been added to your favorites",
      });
    }
  };

  const handleShare = async (dua: typeof duas[0]) => {
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

  const saveDuaAsImage = async (duaId: string) => {
    const duaElement = document.getElementById(`dua-card-${duaId}`);
    if (!duaElement) return;

    try {
      const canvas = await html2canvas(duaElement, {
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `dua-${duaId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Success",
        description: "Du'a saved as image",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Du'a Collection</h1>
          <p className="text-muted-foreground">
            Authentic supplications from the Quran and Sunnah
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showFlashcards} onOpenChange={setShowFlashcards}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Repeat className="mr-2 h-4 w-4" />
                Flashcards
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Du'a Flashcards</DialogTitle>
                <DialogDescription>
                  Practice and memorize du'as with flashcards
                </DialogDescription>
              </DialogHeader>
              <DuaFlashcard duas={filteredDuas} />
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" asChild>
            <Link to="/duas/favorites">
              <Heart className="mr-2 h-4 w-4" />
              Favorites ({favoriteDuas.length})
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedCategory === 'all' ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory('all')}
              >
                <Star className="mr-2 h-4 w-4" />
                All Du'as
              </Button>
              {duaCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon className="mr-2 h-4 w-4" />
                  {category.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search du'as..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            {filteredDuas.map((dua) => (
              <Card key={dua.id} className="relative" id={`dua-card-${dua.id}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">{dua.title || 'Du\'a'}</h3>
                      <p className="text-sm text-muted-foreground">{dua.reference}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => saveDuaAsImage(dua.id)}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(dua)}
                        className={cn(
                          favoriteDuas.some(fav => fav.id === dua.id) && 
                          "text-primary fill-primary"
                        )}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xl text-right font-arabic leading-relaxed">
                      {dua.arabic}
                    </p>
                    <p className="text-sm italic text-muted-foreground">
                      {dua.transliteration}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {dua.translation}
                    </p>
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