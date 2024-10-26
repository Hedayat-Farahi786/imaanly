import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Preset {
  id: string;
  phrase: string;
  translation: string;
  target: number;
}

const presets: Preset[] = [
  {
    id: 'subhanallah',
    phrase: 'سُبْحَانَ اللَّهِ',
    translation: 'Glory be to Allah',
    target: 33,
  },
  {
    id: 'alhamdulillah',
    phrase: 'الْحَمْدُ لِلَّهِ',
    translation: 'All praise is due to Allah',
    target: 33,
  },
  {
    id: 'allahuakbar',
    phrase: 'اللَّهُ أَكْبَرُ',
    translation: 'Allah is the Greatest',
    target: 33,
  },
  {
    id: 'lailahaillallah',
    phrase: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    translation: 'There is no deity except Allah',
    target: 100,
  },
  {
    id: 'astagfirullah',
    phrase: 'أَسْتَغْفِرُ اللَّهَ',
    translation: 'I seek forgiveness from Allah',
    target: 100,
  },
];

interface TasbihPresetsProps {
  onSelect: (preset: Preset) => void;
}

export default function TasbihPresets({ onSelect }: TasbihPresetsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Common Dhikr</CardTitle>
        <CardDescription>
          Select from commonly recited phrases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={() => onSelect(preset)}
          >
            <div className="text-left">
              <p className="font-arabic text-lg">{preset.phrase}</p>
              <p className="text-sm text-muted-foreground">
                {preset.translation} • {preset.target}x
              </p>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}