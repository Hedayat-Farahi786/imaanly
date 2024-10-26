import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { prayerService } from '@/lib/api';
import MosqueFinder from './mosque-finder';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Prayer {
  id: string;
  name: string;
  time: string;
  completed: boolean;
  isPassed: boolean;
  isNext: boolean;
}

const defaultPrayers: Prayer[] = [
  { id: 'fajr', name: 'Fajr', time: '05:30', completed: false, isPassed: false, isNext: true },
  { id: 'dhuhr', name: 'Dhuhr', time: '13:00', completed: false, isPassed: false, isNext: false },
  { id: 'asr', name: 'Asr', time: '16:30', completed: false, isPassed: false, isNext: false },
  { id: 'maghrib', name: 'Maghrib', time: '19:45', completed: false, isPassed: false, isNext: false },
  { id: 'isha', name: 'Isha', time: '21:15', completed: false, isPassed: false, isNext: false },
];

export default function PrayerTracker() {
  const [prayers, setPrayers] = useState<Prayer[]>(defaultPrayers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [completedPrayers, setCompletedPrayers] = useLocalStorage<Record<string, string[]>>('completed-prayers', {});

  const requestLocationPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setLocationStatus(result.state);

      if (result.state === 'granted') {
        fetchPrayerTimes();
      } else if (result.state === 'prompt') {
        // This will trigger the browser's location permission prompt
        navigator.geolocation.getCurrentPosition(
          () => {
            setLocationStatus('granted');
            fetchPrayerTimes();
          },
          (error) => {
            console.error('Location error:', error);
            setLocationStatus('denied');
            handleLocationError(error);
          },
          { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
        );
      }
    } catch (error) {
      console.error('Permission check error:', error);
      setLocationStatus('denied');
    }
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    let errorMessage = 'Unable to get your location. Using estimated prayer times.';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied. Using estimated prayer times.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable. Using estimated prayer times.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out. Using estimated prayer times.';
        break;
    }

    setError(errorMessage);
    toast.error(errorMessage);
    
    // Update completion status for default prayers
    const today = new Date().toISOString().split('T')[0];
    const completedToday = completedPrayers[today] || [];
    
    setPrayers(defaultPrayers.map(prayer => ({
      ...prayer,
      completed: completedToday.includes(prayer.id)
    })));
    
    setLoading(false);
  };

  const fetchPrayerTimes = async () => {
    try {
      setLoading(true);
      setError(null);

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true
        });
      });

      const times = await prayerService.getTimes(
        position.coords.latitude,
        position.coords.longitude
      );

      // Add Jumuah prayer on Fridays
      if (new Date().getDay() === 5) {
        times.splice(1, 0, {
          id: 'jumuah',
          name: 'Jumuah',
          time: '13:30',
          completed: false,
          isPassed: false,
          isNext: false
        });
      }

      // Update completion status
      const today = new Date().toISOString().split('T')[0];
      const completedToday = completedPrayers[today] || [];
      
      const updatedTimes = times.map(prayer => ({
        ...prayer,
        completed: completedToday.includes(prayer.id)
      }));

      setPrayers(updatedTimes);
      setError(null);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      handleLocationError(error as GeolocationPositionError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const togglePrayer = async (prayerId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const completedToday = completedPrayers[today] || [];
      
      const isCompleted = completedToday.includes(prayerId);
      const updatedCompleted = isCompleted
        ? completedToday.filter(id => id !== prayerId)
        : [...completedToday, prayerId];

      setCompletedPrayers({
        ...completedPrayers,
        [today]: updatedCompleted
      });

      setPrayers(prayers.map(prayer =>
        prayer.id === prayerId ? { ...prayer, completed: !isCompleted } : prayer
      ));

      const prayer = prayers.find(p => p.id === prayerId);
      if (!prayer) return;

      await prayerService.trackPrayer(prayerId, !isCompleted);
      toast.success(`${prayer.name} prayer ${!isCompleted ? 'completed' : 'uncompleted'}`);
    } catch (error) {
      console.error('Error updating prayer status:', error);
      toast.error('Failed to update prayer status. Please try again.');
    }
  };

  const completedCount = prayers.filter(prayer => prayer.completed).length;
  const totalPrayers = prayers.length;
  const progress = (completedCount / totalPrayers) * 100;

  return (
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

          {locationStatus === 'denied' && (
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Location access is required for accurate prayer times.
                <Button
                  variant="link"
                  className="px-2 text-sm"
                  onClick={requestLocationPermission}
                >
                  Grant Access
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading prayer times...
            </div>
          ) : error ? (
            <div className="text-center py-4 text-muted-foreground">
              {error}
            </div>
          ) : (
            <div className="space-y-2">
              {prayers.map((prayer) => (
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
  );
}