import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CircleDot, Trash } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface CustomDhikrProps {
  dhikr: {
    id: number;
    name: string;
    targetCount: number;
    count: number;
  };
  onCount: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function CustomDhikr({ dhikr, onCount, onDelete }: CustomDhikrProps) {
  const handleDelete = () => {
    onDelete(dhikr.id);
    toast.success('Custom dhikr deleted');
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="space-y-4 p-4">
        <Progress
          value={(dhikr.count / dhikr.targetCount) * 100}
          className="h-2"
        />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{dhikr.name}</p>
            <span className="text-sm text-muted-foreground">
              {dhikr.count} / {dhikr.targetCount}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600"
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => onCount(dhikr.id)}
              disabled={dhikr.count >= dhikr.targetCount}
            >
              <CircleDot className="h-4 w-4" />
              Count
            </Button>
          </div>
        </div>
      </CardContent>
      {dhikr.count >= dhikr.targetCount && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <span className="text-xl font-semibold text-primary">
            Completed! ✨
          </span>
        </div>
      )}
    </Card>
  );
}