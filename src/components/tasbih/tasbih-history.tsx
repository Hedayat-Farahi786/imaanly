import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface TasbihSession {
  id: string;
  phrase: string;
  count: number;
  target: number;
  timestamp: number;
}

interface TasbihHistoryProps {
  sessions: TasbihSession[];
}

export default function TasbihHistory({ sessions }: TasbihHistoryProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>
            Your dhikr sessions will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No sessions recorded yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>
          Your recent dhikr sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
          >
            <div>
              <p className="font-arabic">{session.phrase}</p>
              <p className="text-sm text-muted-foreground">
                {session.count}/{session.target} counts •{' '}
                {formatDistanceToNow(session.timestamp, { addSuffix: true })}
              </p>
            </div>
            <div className="text-2xl font-bold tabular-nums">
              {session.count}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}