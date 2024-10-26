import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  CircleDot,
  Heart,
  MoonIcon,
  RotateCcw,
  SunIcon,
  Timer,
  Plus,
  Settings,
  Volume2,
  Pause,
  Play,
  Circle,
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import CustomDhikr from '@/components/dhikr/custom-dhikr';

interface DhikrItem {
  id: number;
  arabic: string;
  translation: string;
  count: number;
  targetCount: number;
  category: string;
  audio?: string;
}

interface CustomDhikr {
  id: number;
  name: string;
  targetCount: number;
  count: number;
}

export default function Dhikr() {
  const [activeCategory, setActiveCategory] = useState('morning');
  const [dhikrs, setDhikrs] = useLocalStorage<DhikrItem[]>('dhikrs', [
    {
      id: 1,
      arabic: 'سُبْحَانَ اللَّهِ',
      translation: 'Glory be to Allah',
      count: 0,
      targetCount: 33,
      category: 'morning',
    },
    {
      id: 2,
      arabic: 'الْحَمْدُ لِلَّهِ',
      translation: 'All praise is due to Allah',
      count: 0,
      targetCount: 33,
      category: 'morning',
    },
    {
      id: 3,
      arabic: 'اللَّهُ أَكْبَرُ',
      translation: 'Allah is the Greatest',
      count: 0,
      targetCount: 33,
      category: 'morning',
    },
  ]);

  const [customDhikrs, setCustomDhikrs] = useLocalStorage<CustomDhikr[]>('custom-dhikrs', []);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [meditationAudio, setMeditationAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCount = (id: number) => {
    setDhikrs(dhikrs.map(dhikr => {
      if (dhikr.id === id && dhikr.count < dhikr.targetCount) {
        return { ...dhikr, count: dhikr.count + 1 };
      }
      return dhikr;
    }));
  };

  const handleCustomCount = (id: number) => {
    setCustomDhikrs(customDhikrs.map(dhikr => {
      if (dhikr.id === id && dhikr.count < dhikr.targetCount) {
        return { ...dhikr, count: dhikr.count + 1 };
      }
      return dhikr;
    }));
  };

  const handleDeleteCustomDhikr = (id: number) => {
    setCustomDhikrs(customDhikrs.filter(dhikr => dhikr.id !== id));
  };

  const resetCounts = () => {
    setDhikrs(dhikrs.map(dhikr => ({ ...dhikr, count: 0 })));
    setCustomDhikrs(customDhikrs.map(dhikr => ({ ...dhikr, count: 0 })));
  };

  const addCustomDhikr = (name: string, targetCount: number) => {
    const newDhikr: CustomDhikr = {
      id: Date.now(),
      name,
      targetCount,
      count: 0,
    };
    setCustomDhikrs([...customDhikrs, newDhikr]);
  };

  const startTimer = (minutes: number) => {
    setTimerDuration(minutes * 60);
    setTimeRemaining(minutes * 60);
    setTimerActive(true);
  };

  const toggleMeditationAudio = () => {
    if (meditationAudio) {
      if (isPlaying) {
        meditationAudio.pause();
      } else {
        meditationAudio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Dhikr</h1>
            <p className="text-muted-foreground">
              Strengthen your connection with Allah through daily remembrance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dhikr/tasbih">
                <Circle className="mr-2 h-4 w-4" />
                Digital Tasbih
              </Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Dhikr</DialogTitle>
                  <DialogDescription>
                    Create your own dhikr counter with a custom target
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    addCustomDhikr(
                      formData.get('name') as string,
                      parseInt(formData.get('target') as string, 10)
                    );
                    (e.target as HTMLFormElement).reset();
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Dhikr Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Count</Label>
                    <Input
                      id="target"
                      name="target"
                      type="number"
                      min="1"
                      required
                    />
                  </div>
                  <Button type="submit">Add Dhikr</Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Timer className="mr-2 h-4 w-4" />
                  Set Timer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Meditation Timer</DialogTitle>
                  <DialogDescription>
                    Set a timer for your dhikr session
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2">
                  {[5, 10, 15, 20, 30].map((mins) => (
                    <Button
                      key={mins}
                      variant="outline"
                      onClick={() => startTimer(mins)}
                    >
                      {mins}m
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {timerActive && (
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Meditation Timer</p>
                  <p className="text-2xl font-bold">
                    {formatTime(timeRemaining)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMeditationAudio}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTimerActive(false)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Progress
                value={(timeRemaining / timerDuration) * 100}
                className="mt-4 h-2"
              />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className={cn(
              "cursor-pointer transition-colors hover:bg-accent",
              activeCategory === 'morning' && "border-primary"
            )}
            onClick={() => setActiveCategory('morning')}
          >
            <CardHeader className="space-y-1">
              <SunIcon className="h-4 w-4 mb-2" />
              <CardTitle className="text-lg">Morning Adhkar</CardTitle>
              <CardDescription>After Fajr prayer</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className={cn(
              "cursor-pointer transition-colors hover:bg-accent",
              activeCategory === 'evening' && "border-primary"
            )}
            onClick={() => setActiveCategory('evening')}
          >
            <CardHeader className="space-y-1">
              <MoonIcon className="h-4 w-4 mb-2" />
              <CardTitle className="text-lg">Evening Adhkar</CardTitle>
              <CardDescription>After Asr prayer</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className={cn(
              "cursor-pointer transition-colors hover:bg-accent",
              activeCategory === 'daily' && "border-primary"
            )}
            onClick={() => setActiveCategory('daily')}
          >
            <CardHeader className="space-y-1">
              <Heart className="h-4 w-4 mb-2" />
              <CardTitle className="text-lg">Daily Adhkar</CardTitle>
              <CardDescription>Throughout the day</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Current Session</h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={resetCounts}
          >
            <RotateCcw className="h-4 w-4" />
            Reset All
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {dhikrs
            .filter((dhikr) => dhikr.category === activeCategory)
            .map((dhikr) => (
              <Card key={dhikr.id} className="relative overflow-hidden">
                <CardContent className="space-y-4 p-4">
                  <div className="space-y-2">
                    <p className="text-2xl text-right font-arabic">
                      {dhikr.arabic}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {dhikr.translation}
                    </p>
                  </div>

                  <Progress
                    value={(dhikr.count / dhikr.targetCount) * 100}
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {dhikr.count} / {dhikr.targetCount}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const audio = new Audio(dhikr.audio);
                          audio.play();
                        }}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="gap-2"
                        onClick={() => handleCount(dhikr.id)}
                        disabled={dhikr.count >= dhikr.targetCount}
                      >
                        <CircleDot className="h-4 w-4" />
                        Count
                      </Button>
                    </div>
                  </div>
                </CardContent>
                {dhikr.count >= dhikr.targetCount && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <span className="text-xl font-semibold text-primary">
                      Completed! ✨
                    </span>
                  </div>
                )}
              </Card>
            ))}

          {customDhikrs.map((dhikr) => (
            <CustomDhikr
              key={dhikr.id}
              dhikr={dhikr}
              onCount={handleCustomCount}
              onDelete={handleDeleteCustomDhikr}
            />
          ))}
        </div>
      </section>
    </div>
  );
}