import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle } from 'lucide-react';

interface PrayerCardProps {
  name: string;
  time: string;
  isNext: boolean;
  isPassed: boolean;
  completed?: boolean;
  onToggleComplete: () => void;
}

export default function PrayerCard({
  name,
  time,
  isNext,
  isPassed,
  completed,
  onToggleComplete
}: PrayerCardProps) {
  return (
    <Card className={cn(
      'transition-colors',
      isNext && 'border-primary',
      isPassed && !completed && 'opacity-50'
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className={cn(
              'h-4 w-4',
              isNext && 'text-primary'
            )} />
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">{time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isNext && (
              <span className="text-xs font-medium text-primary">Next Prayer</span>
            )}
            <Button
              variant={completed ? "default" : "outline"}
              size="sm"
              onClick={onToggleComplete}
              className={cn(completed && "bg-green-500 hover:bg-green-600")}
            >
              <CheckCircle className={cn(
                "h-4 w-4",
                completed && "text-white"
              )} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}