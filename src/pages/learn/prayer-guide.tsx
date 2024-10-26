import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Book,
  CheckCircle,
  Clock,
  PlayCircle,
  Users,
} from 'lucide-react';

const prayerTypes = [
  {
    id: 'daily',
    title: 'Daily Prayers',
    description: 'Learn the five daily prayers',
    lessons: [
      {
        id: 1,
        title: 'Fajr Prayer',
        duration: '15 mins',
        steps: [
          'Preparation and Wudu',
          'Two Rakats of Sunnah',
          'Two Rakats of Fard',
        ],
        completed: false,
      },
      {
        id: 2,
        title: 'Dhuhr Prayer',
        duration: '20 mins',
        steps: [
          'Four Rakats of Sunnah',
          'Four Rakats of Fard',
          'Two Rakats of Sunnah',
        ],
        completed: false,
      },
      // Add more daily prayers
    ],
  },
  {
    id: 'jumuah',
    title: 'Jumuah Prayer',
    description: 'Friday congregational prayer',
    lessons: [
      {
        id: 1,
        title: 'Preparation for Jumuah',
        duration: '10 mins',
        steps: [
          'Ghusl and cleanliness',
          'Wearing clean clothes',
          'Early attendance',
        ],
        completed: false,
      },
      // Add more Jumuah lessons
    ],
  },
  {
    id: 'janazah',
    title: 'Janazah Prayer',
    description: 'Funeral prayer',
    lessons: [
      {
        id: 1,
        title: 'Understanding Janazah',
        duration: '15 mins',
        steps: [
          'Purpose and importance',
          'Standing positions',
          'Recitations and duas',
        ],
        completed: false,
      },
      // Add more Janazah lessons
    ],
  },
  {
    id: 'tahajjud',
    title: 'Tahajjud Prayer',
    description: 'Night prayer',
    lessons: [
      {
        id: 1,
        title: 'Introduction to Tahajjud',
        duration: '12 mins',
        steps: [
          'Best time for Tahajjud',
          'Number of rakats',
          'Special duas',
        ],
        completed: false,
      },
      // Add more Tahajjud lessons
    ],
  },
];

export default function PrayerGuide() {
  const [selectedType, setSelectedType] = useState(prayerTypes[0]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prayer Guide</h1>
          <p className="text-muted-foreground">
            Learn how to perform prayers correctly step by step
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {prayerTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-colors hover:bg-accent ${
                selectedType.id === type.id ? 'border-primary' : ''
              }`}
              onClick={() => setSelectedType(type)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{type.title}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{selectedType.title}</h2>
          <Button variant="outline" className="gap-2">
            <PlayCircle className="h-4 w-4" />
            Watch Video Guide
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {selectedType.lessons.map((lesson) => (
            <Card key={lesson.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  {lesson.completed && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {lesson.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lesson.steps.map((step, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {step}
                    </li>
                  ))}
                </ul>
                <Button className="mt-4 w-full">Start Lesson</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}