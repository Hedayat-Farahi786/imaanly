import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Compass, 
  MapPin, 
  CheckCircle, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import PrayerTracker from '@/components/prayer-tracker';
import QiblaCompass from '@/components/qibla-compass';
import { prayerService, mosqueService } from '@/lib/api';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isFriday, isToday } from 'date-fns';
import L from 'leaflet';
import { cn } from '@/lib/utils';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Mosque {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  distance?: number;
}

// Component to update map center when user location changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function Prayers() {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [completedPrayers, setCompletedPrayers] = useLocalStorage<Record<string, string[]>>('completed-prayers', {});

  // Get calendar days
  const calendarDays = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate),
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          try {
            // Fetch nearby mosques
            const nearbyMosques = await mosqueService.getNearby(latitude, longitude);
            setMosques(nearbyMosques);
          } catch (error) {
            console.error('Error fetching mosques:', error);
            toast.error('Failed to fetch nearby mosques');
          }
          
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location');
          setLoading(false);
        }
      );
    }
  }, []);

  const openDirections = (mosque: Mosque) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${mosque.latitude},${mosque.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
          <h1 className="text-4xl font-bold tracking-tighter">Prayer Times</h1>
          <p className="text-muted-foreground">
            Track your daily prayers and find nearby mosques
          </p>
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <PrayerTracker />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Prayer Calendar</h2>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{format(selectedDate, 'MMMM yyyy')}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-sm font-medium p-2">
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((date, index) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      const prayers = completedPrayers[dateStr] || [];
                      const totalPrayers = isFriday(date) ? 6 : 5;
                      const dayProgress = (prayers.length / totalPrayers) * 100;

                      return (
                        <div
                          key={date.toString()}
                          className={cn(
                            "aspect-square p-1 relative",
                            isToday(date) && "bg-primary/5 rounded-md"
                          )}
                        >
                          <div className="text-sm">{format(date, 'd')}</div>
                          {prayers.length > 0 && (
                            <Progress
                              value={dayProgress}
                              className="h-1 mt-1"
                            />
                          )}
                          {isFriday(date) && (
                            <div className="absolute bottom-1 right-1 w-1 h-1 bg-primary rounded-full" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Qibla & Mosques</h2>
          <Card>
            <CardContent className="p-6">
              <QiblaCompass latitude={location.latitude} longitude={location.longitude} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Nearby Masjids
              </CardTitle>
              <CardDescription>
                Find the closest masjids in your area
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {location.latitude !== 0 && location.longitude !== 0 && (
                <div className="h-[400px] rounded-lg overflow-hidden">
                  <MapContainer
                    center={[location.latitude, location.longitude]}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      className="grayscale"
                    />
                    <MapUpdater center={[location.latitude, location.longitude]} />
                    
                    {/* User location marker */}
                    <Marker position={[location.latitude, location.longitude]}>
                      <Popup>Your location</Popup>
                    </Marker>

                    {/* Mosque markers */}
                    {mosques.map((mosque) => (
                      <Marker
                        key={mosque.id}
                        position={[mosque.latitude, mosque.longitude]}
                      >
                        <Popup>
                          <div className="space-y-2">
                            <p className="font-medium">{mosque.name}</p>
                            <p className="text-sm">{mosque.address}</p>
                            {mosque.distance && (
                              <p className="text-sm text-muted-foreground">
                                {mosque.distance.toFixed(1)} km away
                              </p>
                            )}
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => openDirections(mosque)}
                            >
                              Get Directions
                            </Button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}