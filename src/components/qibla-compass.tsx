import { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';

interface QiblaCompassProps {
  latitude: number;
  longitude: number;
}

export default function QiblaCompass({ latitude, longitude }: QiblaCompassProps) {
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [compassHeading, setCompassHeading] = useState<number>(0);

  useEffect(() => {
    // Calculate Qibla direction
    const calculateQibla = () => {
      const kaabaLat = 21.4225; // Kaaba latitude
      const kaabaLng = 39.8262; // Kaaba longitude

      const latRad = (latitude * Math.PI) / 180;
      const longRad = (longitude * Math.PI) / 180;
      const kaabaLatRad = (kaabaLat * Math.PI) / 180;
      const kaabaLongRad = (kaabaLng * Math.PI) / 180;

      const y = Math.sin(kaabaLongRad - longRad);
      const x =
        Math.cos(latRad) * Math.tan(kaabaLatRad) -
        Math.sin(latRad) * Math.cos(kaabaLongRad - longRad);

      let qibla = Math.atan2(y, x);
      qibla = (qibla * 180) / Math.PI;
      qibla = (qibla + 360) % 360;

      setQiblaDirection(qibla);
    };

    if (latitude && longitude) {
      calculateQibla();
    }

    // Handle device orientation for compass
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.webkitCompassHeading) {
        // For iOS devices
        setCompassHeading(event.webkitCompassHeading);
      } else if (event.alpha) {
        // For Android devices
        setCompassHeading(360 - event.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [latitude, longitude]);

  const rotation = qiblaDirection - compassHeading;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className="relative h-48 w-48 rounded-full border-2 border-primary p-4"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.5s ease-out',
        }}
      >
        <Compass className="h-full w-full text-primary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Qibla direction: {Math.round(qiblaDirection)}°
      </p>
    </div>
  );
}