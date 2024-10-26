import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, PlayCircle } from 'lucide-react';

const salahSteps = [
  {
    id: 1,
    title: 'Standing (Qiyam)',
    description: 'Stand facing the Qibla with the intention to pray',
    dua: 'اللَّهُ أَكْبَرُ',
    translation: 'Allah is the Greatest',
    imageUrl: 'https://example.com/salah/standing.jpg',
    videoUrl: 'https://example.com/salah/standing.mp4',
  },
  {
    id: 2,
    title: 'Recitation (Qira\'ah)',
    description: 'Recite Surah Al-Fatihah and another surah',
    imageUrl: 'https://example.com/salah/recitation.jpg',
    videoUrl: 'https://example.com/salah/recitation.mp4',
  },
  {
    id: 3,
    title: 'Bowing (Ruku)',
    description: 'Bow down with your back straight',
    dua: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    translation: 'Glory be to my Lord, the Most Great',
    imageUrl: 'https://example.com/salah/ruku.jpg',
    videoUrl: 'https://example.com/salah/ruku.mp4',
  },
  // Add more steps
];

export default function SalahGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const markStepComplete = (stepId: number) => {
    setCompletedSteps(new Set([...completedSteps, stepId]));
    if (currentStep < salahSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progress = (completedSteps.size / salahSteps.length) * 100;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Prayer Guide</h2>
        <p className="text-muted-foreground">
          Learn how to perform salah (prayer) step by step
        </p>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Step</CardTitle>
            <CardDescription>
              {salahSteps[currentStep].title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video rounded-lg bg-accent">
              {/* Add video or image component */}
            </div>
            <p>{salahSteps[currentStep].description}</p>
            {salahSteps[currentStep].dua && (
              <div className="space-y-2">
                <p className="text-right font-arabic text-lg">
                  {salahSteps[currentStep].dua}
                </p>
                <p className="text-sm text-muted-foreground">
                  {salahSteps[currentStep].translation}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => markStepComplete(salahSteps[currentStep].id)}
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
          {salahSteps.map((step, index) => (
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
                    <CardDescription className="text-sm">
                      {step.description}
                    </CardDescription>
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