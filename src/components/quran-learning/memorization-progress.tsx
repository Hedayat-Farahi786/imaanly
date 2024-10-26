import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface MemorizationProgress {
  totalVerses: number;
  memorizedVerses: number;
  lastRevised: string;
  streak: number;
  surahProgress: {
    [key: string]: {
      total: number;
      memorized: number;
    };
  };
}

export default function MemorizationProgress() {
  const [progress] = useLocalStorage<MemorizationProgress>('memorization-progress', {
    totalVerses: 6236,
    memorizedVerses: 0,
    lastRevised: new Date().toISOString(),
    streak: 0,
    surahProgress: {},
  });

  const percentComplete = (progress.memorizedVerses / progress.totalVerses) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memorization Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>
              {progress.memorizedVerses} / {progress.totalVerses} verses
            </span>
          </div>
          <Progress value={percentComplete} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {percentComplete.toFixed(1)}% of the Quran memorized
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{progress.streak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">
                {new Date(progress.lastRevised).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">Last Revision</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Recently Memorized Surahs</h3>
          {Object.entries(progress.surahProgress).map(([surah, { total, memorized }]) => (
            <div key={surah} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{surah}</span>
                <span>
                  {memorized} / {total} verses
                </span>
              </div>
              <Progress value={(memorized / total) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}