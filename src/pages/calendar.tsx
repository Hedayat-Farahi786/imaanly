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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Moon,
} from 'lucide-react';

interface IslamicDate {
  day: number;
  month: string;
  year: number;
}

interface IslamicEvent {
  title: string;
  description: string;
  date: IslamicDate;
  type: 'holiday' | 'event' | 'worship';
}

export default function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState<string>('Ramadan');
  const [selectedYear, setSelectedYear] = useState<number>(1445);

  const islamicMonths = [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Jumada al-Awwal',
    'Jumada al-Thani',
    'Rajab',
    'Shaban',
    'Ramadan',
    'Shawwal',
    'Dhu al-Qadah',
    'Dhu al-Hijjah',
  ];

  const events: IslamicEvent[] = [
    {
      title: 'Start of Ramadan',
      description: 'Beginning of the blessed month of fasting',
      date: { day: 1, month: 'Ramadan', year: 1445 },
      type: 'holiday',
    },
    {
      title: 'Laylat al-Qadr',
      description: 'The Night of Power',
      date: { day: 27, month: 'Ramadan', year: 1445 },
      type: 'worship',
    },
    // Add more events
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Islamic Calendar</h1>
          <p className="text-muted-foreground">
            Track Islamic dates and important events
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {islamicMonths.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1444, 1445, 1446].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year} AH
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add calendar grid here */}
            <div className="grid grid-cols-7 gap-4">
              {/* Calendar days */}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-accent/50"
                >
                  <Moon className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {event.date.day} {event.date.month} {event.date.year} AH
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>
              Important dates and events for {selectedMonth}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add monthly events and highlights */}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}