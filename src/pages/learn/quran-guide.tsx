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
import {
  BookOpen,
  GraduationCap,
  Languages,
  Mic2,
  PlayCircle,
  Volume2,
} from 'lucide-react';
import TajweedLesson from '@/components/quran-learning/tajweed-lesson';
import MemorizationTool from '@/components/quran-learning/memorization-tool';
import { useQuery } from '@tanstack/react-query';
import { quranService } from '@/lib/api';

const learningTracks = [
  {
    id: 'basics',
    title: 'Basics of Quran',
    description: 'Start with the fundamentals',
    icon: BookOpen,
    progress: 0,
    modules: [
      {
        id: 1,
        title: 'Arabic Alphabet',
        lessons: [
          {
            id: 'l1',
            title: 'Introduction to Arabic Letters',
            duration: '10 mins',
            completed: false,
          },
          {
            id: 'l2',
            title: 'Letter Forms and Positions',
            duration: '15 mins',
            completed: false,
          },
        ],
      },
      {
        id: 2,
        title: 'Basic Pronunciation',
        lessons: [
          {
            id: 'l3',
            title: 'Vowel Marks (Harakat)',
            duration: '12 mins',
            completed: false,
          },
          {
            id: 'l4',
            title: 'Connecting Letters',
            duration: '15 mins',
            completed: false,
          },
        ],
      },
    ],
  },
  // ... rest of the tracks
];

export default function QuranGuide() {
  const [selectedTrack, setSelectedTrack] = useState(learningTracks[0]);
  const [activeModule, setActiveModule] = useState(selectedTrack.modules[0]);

  const { data: quranData, isLoading } = useQuery({
    queryKey: ['quran-lesson'],
    queryFn: () => quranService.getSurah(1), // Start with Al-Fatiha
  });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Learn to Read Quran
          </h1>
          <p className="text-muted-foreground">
            Step by step guide to reading and understanding the Holy Quran
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {learningTracks.map((track) => {
            const Icon = track.icon;
            return (
              <Card
                key={track.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedTrack.id === track.id ? 'border-primary' : ''
                }`}
                onClick={() => {
                  setSelectedTrack(track);
                  setActiveModule(track.modules[0]);
                }}
              >
                <CardHeader>
                  <Icon className="h-8 w-8 mb-2" />
                  <CardTitle className="text-lg">{track.title}</CardTitle>
                  <CardDescription>{track.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={track.progress} className="h-2" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {track.progress}% Complete
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{selectedTrack.title}</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Volume2 className="h-4 w-4" />
              Audio Lessons
            </Button>
            <Button variant="outline" className="gap-2">
              <PlayCircle className="h-4 w-4" />
              Video Tutorials
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {selectedTrack.modules.map((module) => (
            <Card key={module.id}>
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {module.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Duration: {lesson.duration}
                        </p>
                      </div>
                      <Button
                        variant={lesson.completed ? 'secondary' : 'default'}
                        size="sm"
                      >
                        {lesson.completed ? 'Review' : 'Start'}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Learning Tools</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <TajweedLesson />
          <MemorizationTool />
        </div>
      </section>
    </div>
  );
}