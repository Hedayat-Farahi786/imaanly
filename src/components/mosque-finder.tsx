import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation, AlertCircle } from 'lucide-react';
import { mosqueService } from '@/lib/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

export default function MosqueFinder() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [mapKey, setMapKey] = useState(0);

  const requestLocationPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setLocationStatus(result.state);

      if (result.state === 'granted') {
        getCurrentLocation();
      } else if (result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationStatus('granted');
            handleLocationSuccess(position);
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError,
        {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  const handleLocationSuccess = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setUserLocation({ latitude, longitude });
    setMapKey(prev => prev + 1);
    
    try {
      const nearbyMosques = await mosqueService.getNearby(latitude, longitude);
      const serializedMosques = nearbyMosques.map(mosque => ({
        id: mosque.id,
        name: mosque.name,
        latitude: Number(mosque.latitude),
        longitude: Number(mosque.longitude),
        address: mosque.address,
        distance: mosque.distance ? Number(mosque.distance) : undefined
      }));
      setMosques(serializedMosques);
      setError(null);
    } catch (error) {
      console.error('Error fetching mosques:', error);
      toast.error('Unable to fetch nearby mosques');
      setError('Failed to fetch nearby mosques');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    let errorMessage = 'Unable to get your location';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
    }

    setError(errorMessage);
    toast.error(errorMessage);
    setLoading(false);
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const openDirections = (mosque: Mosque) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${mosque.latitude},${mosque.longitude}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading nearby mosques...</p>
        </CardContent>
      </Card>
    );
  }

  if (locationStatus === 'denied') {
    return (
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Location access is required to find nearby mosques.
          <Button
            variant="link"
            className="px-2 text-sm"
            onClick={requestLocationPermission}
          >
            Grant Access
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {userLocation && (
        <div className="h-[300px] rounded-lg overflow-hidden">
          <MapContainer
            key={mapKey}
            center={[userLocation.latitude, userLocation.longitude]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={[userLocation.latitude, userLocation.longitude]} />
            
            {/* User location marker */}
            <Marker position={[userLocation.latitude, userLocation.longitude]}>
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

      <div className="space-y-4">
        {mosques.length === 0 ? (
          <p className="text-center text-muted-foreground">No mosques found nearby</p>
        ) : (
          mosques.map((mosque) => (
            <Card key={mosque.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <p className="font-medium">{mosque.name}</p>
                  <p className="text-sm text-muted-foreground">{mosque.address}</p>
                  {mosque.distance && (
                    <p className="text-sm font-medium">{mosque.distance.toFixed(1)} km away</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => openDirections(mosque)}
                >
                  <Navigation className="h-4 w-4" />
                  Directions
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}