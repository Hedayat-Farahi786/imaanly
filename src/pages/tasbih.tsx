import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import {
  RotateCcw,
  Plus,
  Save,
  Volume2,
  VolumeX,
  Vibrate,
  Timer,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import TasbihPresets from '@/components/tasbih/tasbih-presets';
import TasbihHistory from '@/components/tasbih/tasbih-history';
import { toast } from 'sonner';

interface TasbihSession {
  id: string;
  phrase: string;
  count: number;
  target: number;
  timestamp: number;
}

export default function Tasbih() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [phrase, setPhrase] = useState('سُبْحَانَ اللَّهِ');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [sessions, setSessions] = useLocalStorage<TasbihSession[]>('tasbih-sessions', []);
  const { theme } = useTheme();

  const clickSound = new Audio('/sounds/click.mp3');

  const handleCount = () => {
    setCount(prev => {
      const newCount = prev + 1;
      
      // Vibration feedback
      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(20);
      }

      // Sound feedback
      if (soundEnabled) {
        clickSound.currentTime = 0;
        clickSound.play();
      }

      // Target reached notification
      if (newCount === target) {
        toast.success('Target count reached! 🎉');
        if (vibrationEnabled && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }

      return newCount;
    });
  };

  const resetCount = () => {
    setCount(0);
  };

  const saveSession = () => {
    const newSession: TasbihSession = {
      id: Date.now().toString(),
      phrase,
      count,
      target,
      timestamp: Date.now(),
    };
    setSessions([newSession, ...sessions]);
    toast.success('Session saved successfully');
    resetCount();
  };

  const progress = (count / target) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Digital Tasbih</h1>
        <p className="text-muted-foreground">
          Keep track of your dhikr with this virtual counter
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-4">
                <p className="text-2xl font-arabic">{phrase}</p>
                <div className="text-7xl font-bold tabular-nums">
                  {count}
                </div>
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Target: {count}/{target}
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setVibrationEnabled(!vibrationEnabled)}
                  className={cn(vibrationEnabled && "text-primary")}
                >
                  <Vibrate className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={resetCount}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={saveSession}
                  disabled={count === 0}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="lg"
                className="w-full h-24 text-2xl"
                onClick={handleCount}
              >
                Tap to Count
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Settings</CardTitle>
              <CardDescription>
                Set your target count and custom phrase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Count</label>
                <Input
                  type="number"
                  min="1"
                  value={target}
                  onChange={(e) => setTarget(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Phrase</label>
                <Input
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  className="font-arabic text-right"
                  dir="rtl"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <TasbihPresets
            onSelect={(preset) => {
              setPhrase(preset.phrase);
              setTarget(preset.target);
            }}
          />
          <TasbihHistory sessions={sessions} />
        </div>
      </div>
    </div>
  );
}