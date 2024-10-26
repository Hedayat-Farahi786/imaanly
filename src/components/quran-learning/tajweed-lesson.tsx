import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const tajweedRules = [
  {
    id: 1,
    name: 'Ghunnah',
    arabic: 'غُنَّة',
    description: 'Nasalization of noon and meem mushaddad',
    example: 'ثُمَّ',
    audioUrl: '/audio/ghunnah.mp3',
    completed: false,
  },
  {
    id: 2,
    name: 'Idgham',
    arabic: 'إدغام',
    description: 'Merging of noon sakinah or tanween',
    example: 'مَن يَّقُولُ',
    audioUrl: '/audio/idgham.mp3',
    completed: false,
  },
  // Add more rules
];

export default function TajweedLesson() {
  const [selectedRule, setSelectedRule] = useState(tajweedRules[0]);
  const [completedRules, setCompletedRules] = useState<Set<number>>(new Set());

  const markComplete = (ruleId: number) => {
    const newCompleted = new Set(completedRules);
    newCompleted.add(ruleId);
    setCompletedRules(newCompleted);
  };

  const progress = (completedRules.size / tajweedRules.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tajweed Rules</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {completedRules.size}/{tajweedRules.length} completed
            </span>
            <Progress value={progress} className="w-24 h-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">{selectedRule.name}</h3>
            <p className="text-2xl text-right font-arabic">{selectedRule.arabic}</p>
            <p className="text-sm text-muted-foreground">
              {selectedRule.description}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Example:</p>
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
              <p className="text-xl font-arabic">{selectedRule.example}</p>
              <Button variant="ghost" size="icon">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            className="w-full"
            variant={completedRules.has(selectedRule.id) ? 'secondary' : 'default'}
            onClick={() => markComplete(selectedRule.id)}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {completedRules.has(selectedRule.id) ? 'Completed' : 'Mark as Complete'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {tajweedRules.map((rule) => (
            <Button
              key={rule.id}
              variant={selectedRule.id === rule.id ? 'default' : 'outline'}
              onClick={() => setSelectedRule(rule)}
              className="justify-start"
            >
              {completedRules.has(rule.id) && (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              {rule.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}