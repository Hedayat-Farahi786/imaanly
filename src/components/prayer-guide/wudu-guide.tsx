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

const wuduSteps = [
  {
    id: 1,
    title: 'Intention (Niyyah)',
    description: 'Make the intention to perform wudu for prayer',
    dua: 'بِسْمِ اللَّهِ',
    translation: 'In the name of Allah',
    imageUrl: 'https://example.com/wudu/intention.jpg',
    videoUrl: 'https://example.com/wudu/intention.mp4',
  },
  {
    id: 2,
    title: 'Washing Hands',
    description: 'Wash both hands up to the wrists three times',
    imageUrl: 'https://example.com/wudu/hands.jpg',
    videoUrl: 'https://example.com/wudu/hands.mp4',
  },
  {
    id: 3,
    title: 'Rinsing Mouth',
    description: 'Take water into mouth and rinse thoroughly three times',
    imageUrl: 'https://example.com/wudu/mouth.jpg',
    videoUrl: 'https://example.com/wudu/mouth.mp4',
  },
  // Add more steps
];

export default function WuduGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const markStepComplete = (stepId: number) => {
    setCompletedSteps(new Set([...completedSteps, stepId]));
    if (currentStep < wuduSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progress = (completedSteps.size / wuduSteps.length) * 100;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Wudu Guide</h2>
        <p className="text-muted-foreground">
          Learn how to perform wudu (ablution) step by step
        </p>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Step</CardTitle>
            <CardDescription>
              {wuduSteps[currentStep].title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video rounded-lg bg-accent">
              {/* Add video or image component */}
            </div>
            <p>{wuduSteps[currentStep].description}</p>
            {wuduSteps[currentStep].dua && (
              <div className="space-y-2">
                <p className="text-right font-arabic text-lg">
                  {wuduSteps[currentStep].dua}
                </p>
                <p className="text-sm text-muted-foreground">
                  {wuduSteps[currentStep].translation}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => markStepComplete(wuduSteps[currentStep].id)}
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
          {wuduSteps.map((step, index) => (
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