import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DuaCategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    subcategories?: any[];
  };
  isSelected?: boolean;
  onClick?: () => void;
}

export default function DuaCategoryCard({
  category,
  isSelected,
  onClick,
}: DuaCategoryCardProps) {
  const Icon = category.icon;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent",
        isSelected && "border-primary"
      )}
      onClick={onClick}
    >
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <Icon className="h-4 w-4 mb-2" />
          {category.subcategories && (
            <Button variant="ghost" size="sm">
              {category.subcategories.length} subcategories
            </Button>
          )}
        </div>
        <CardTitle className="text-lg">{category.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </CardContent>
    </Card>
  );
}