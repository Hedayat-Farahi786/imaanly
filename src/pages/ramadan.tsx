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
  Calendar,
  Moon,
  Sun,
  Star,
  Clock,
  BookOpen,
  Heart,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface FastingDay {
  date: string;
  suhoorTime: string;
  iftarTime: string;
  completed: boolean;
  taraweehCompleted: boolean;
}

export default function Ramadan() {
  const [fastingDays, setFastingDays] = useLocalStorage<FastingDay[]>('ramadan-fasting', []);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: prayerTimes, isLoading } = useQuery({
    queryKey: ['ramadan-times'],
    queryFn: async () => {
      // Fetch Ramadan prayer times
      return null;
    },
  });

  const completedFasts = fastingDays.filter(day => day.completed).length;
  const completedTaraweeh = fastingDays.filter(day => day.taraweehCompleted).length;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ramadan Mubarak</h1>
          <p className="text-muted-foreground">
            Track your fasting, prayers, and spiritual goals during the blessed month
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Moon className="h-8 w-8 mb-2" />
              <CardTitle>Fasting Tracker</CardTitle>
              <CardDescription>Track your daily fasts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{completedFasts}/30 days</span>
                </div>
                <Progress value={(completedFasts / 30) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-8 w-8 mb-2" />
              <CardTitle>Taraweeh Prayers</CardTitle>
              <CardDescription>Track nightly prayers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed</span>
                  <span>{completedTaraweeh}/30 nights</span>
                </div>
                <Progress value={(completedTaraweeh / 30) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-8 w-8 mb-2" />
              <CardTitle>Good Deeds</CardTitle>
              <CardDescription>Track charitable acts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Add Good Deed
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <CardTitle>Today's Schedule</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Suhoor Ends</p>
                  <p className="text-sm text-muted-foreground">Dawn Prayer (Fajr)</p>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-lg font-semibold">04:30 AM</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Iftar Time</p>
                  <p className="text-sm text-muted-foreground">Sunset Prayer (Maghrib)</p>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-lg font-semibold">07:45 PM</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Taraweeh Prayer</p>
                  <p className="text-sm text-muted-foreground">Night Prayer</p>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-lg font-semibold">09:30 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <CardTitle>Daily Worship Goals</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">Quran Reading</p>
                  <p className="text-sm text-muted-foreground">1 Juz per day</p>
                </div>
                <Progress value={30} className="w-24 h-2" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">Dhikr</p>
                  <p className="text-sm text-muted-foreground">100 Tasbeeh</p>
                </div>
                <Progress value={65} className="w-24 h-2" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">Charity</p>
                  <p className="text-sm text-muted-foreground">Daily Sadaqah</p>
                </div>
                <Progress value={45} className="w-24 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Overview</CardTitle>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add calendar component here */}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}