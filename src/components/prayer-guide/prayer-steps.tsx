import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, PlayCircle } from 'lucide-react';

interface PrayerStep {
  id: number;
  title: string;
  description: string;
  arabic?: string;
  translation?: string;
  imageUrl: string;
  videoUrl: string;
}

const prayerSteps: PrayerStep[] = [
  {
    id: 1,
    title: 'Standing (Qiyam)',
    description: 'Stand facing the Qibla with the intention to pray',
    arabic: 'اللَّهُ أَكْبَرُ',
    translation: 'Allah is the Greatest',
    imageUrl: '/images/prayer/standing.jpg',
    videoUrl: '/videos/prayer/standing.mp4',
  },
  {
    id: 2,
    title: 'Bowing (Ruku)',
    description: 'Bow down with your back straight',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    translation: 'Glory be to my Lord, the Most Great',
    imageUrl: '/images/prayer/ruku.jpg',
    videoUrl: '/videos/prayer/ruku.mp4',
  },
  // Add more steps
];

export default function PrayerSteps() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const progress = (completedSteps.size / prayerSteps.length) * 100;

  const markComplete = (stepId: number) => {
    setCompletedSteps(new Set([...completedSteps, stepId]));
    if (currentStep < prayerSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Prayer Steps</h2>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground">
          {completedSteps.size} of {prayerSteps.length} steps completed
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{prayerSteps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video rounded-lg bg-accent">
              {/* Add video player component */}
            </div>
            <p>{prayerSteps[currentStep].description}</p>
            {prayerSteps[currentStep].arabic && (
              <div className="space-y-2">
                <p className="text-right font-arabic text-lg">
                  {prayerSteps[currentStep].arabic}
                </p>
                <p className="text-sm text-muted-foreground">
                  {prayerSteps[currentStep].translation}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                className="w-full"
                onClick={() => markComplete(prayerSteps[currentStep].id)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Step
              </Button>
              <Button variant="outline" size="icon">
                <PlayCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {prayerSteps.map((step, index) => (
            <Card
              key={step.id}
              className={index === currentStep ? 'border-primary' : ''}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      {index + 1}. {step.title}
                    </CardTitle>
                  </div>
                  {completedSteps.has(step.id) && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}