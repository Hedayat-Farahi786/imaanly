import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bookmark, Clock, Heart, Moon, HandCoins, Sun, MapPin, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { prayerService } from '@/lib/api';
import VerseCarousel from '@/components/verse-carousel';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MosqueFinder from '@/components/mosque-finder';

const defaultPrayers = [
  { id: 'fajr', name: 'Fajr', time: '05:30', completed: false, isPassed: false, isNext: true },
  { id: 'dhuhr', name: 'Dhuhr', time: '13:00', completed: false, isPassed: false, isNext: false },
  { id: 'asr', name: 'Asr', time: '16:30', completed: false, isPassed: false, isNext: false },
  { id: 'maghrib', name: 'Maghrib', time: '19:45', completed: false, isPassed: false, isNext: false },
  { id: 'isha', name: 'Isha', time: '21:15', completed: false, isPassed: false, isNext: false },
];

export default function Home() {
  const { data: prayerTimes, isLoading, error, refetch } = useQuery({
    queryKey: ['prayerTimes'],
    queryFn: async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
          }

          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              timeout: 10000,
              maximumAge: 0,
              enableHighAccuracy: true
            }
          );
        });

        const times = await prayerService.getTimes(
          position.coords.latitude,
          position.coords.longitude
        );
        return times;
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        toast.error('Using estimated prayer times');
        return defaultPrayers;
      }
    },
    retry: 1,
  });

  const togglePrayer = async (prayerId: string) => {
    try {
      const prayer = prayerTimes?.find(p => p.id === prayerId);
      if (!prayer) return;

      await prayerService.trackPrayer(prayerId, !prayer.completed);
      await refetch();
      toast.success(`${prayer.name} prayer ${!prayer.completed ? 'completed' : 'uncompleted'}`);
    } catch (error) {
      console.error('Error updating prayer status:', error);
      toast.error('Failed to update prayer status. Please try again.');
    }
  };

  const completedCount = prayerTimes?.filter(prayer => prayer.completed).length ?? 0;
  const totalPrayers = prayerTimes?.length ?? 5;
  const progress = (completedCount / totalPrayers) * 100;

  return (
    <div className="space-y-8">
      <section className="relative space-y-4 text-center">
        <div
          className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background -z-10"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)",
          }}
        />
        <div className="pt-8 pb-16 space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Begin Your Spiritual Journey
          </h1>
          <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Strengthen your connection with Allah through guided prayers,
            meditation, and daily remembrance
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/prayers">
                <HandCoins className="mr-2 h-4 w-4" />
                Start Prayer
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/quran">
                <Bookmark className="mr-2 h-4 w-4" />
                Explore Quran
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <VerseCarousel />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Prayer Tracker
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Find Mosques
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Nearby Mosques</DialogTitle>
                  <DialogDescription>
                    Find mosques in your area for prayer
                  </DialogDescription>
                </DialogHeader>
                <MosqueFinder />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Progress</span>
                  <span className="text-muted-foreground">
                    {completedCount}/{totalPrayers} Prayers
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading prayer times...
                </div>
              ) : error ? (
                <div className="text-center py-4 text-muted-foreground">
                  Using estimated prayer times
                </div>
              ) : (
                <div className="space-y-2">
                  {(prayerTimes ?? defaultPrayers).map((prayer) => (
                    <div
                      key={prayer.id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-lg transition-colors",
                        prayer.isNext && "bg-primary/5",
                        prayer.isPassed && !prayer.completed && "opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={cn(
                          "h-4 w-4",
                          prayer.isNext && "text-primary"
                        )} />
                        <div>
                          <p className="font-medium">{prayer.name}</p>
                          <p className="text-sm text-muted-foreground">{prayer.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {prayer.isNext && (
                          <span className="text-xs font-medium text-primary">Next Prayer</span>
                        )}
                        <Button
                          variant={prayer.completed ? "default" : "outline"}
                          size="sm"
                          onClick={() => togglePrayer(prayer.id)}
                          className={cn(prayer.completed && "bg-green-500 hover:bg-green-600")}
                        >
                          <CheckCircle className={cn(
                            "h-4 w-4",
                            prayer.completed && "text-white"
                          )} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="transition-colors hover:bg-accent">
            <CardHeader>
              <Bookmark className="h-8 w-8 mb-2" />
              <CardTitle>Quran & Du'a</CardTitle>
              <CardDescription>
                Access Quran recitations, translations, and daily Du'a
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">Continue Reading</p>
                <p className="text-sm text-muted-foreground">
                  Surah Al-Baqarah, Verse 255
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-colors hover:bg-accent">
            <CardHeader>
              <Moon className="h-8 w-8 mb-2" />
              <CardTitle>Evening Adhkar</CardTitle>
              <CardDescription>
                End your day with peaceful evening remembrance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">Today's Progress</p>
                <p className="text-sm text-muted-foreground">
                  12/33 Evening Adhkar completed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}