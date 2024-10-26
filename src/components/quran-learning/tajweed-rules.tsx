import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Volume2, CheckCircle } from 'lucide-react';

const tajweedRules = [
  {
    id: 1,
    category: 'Noon Sakinah',
    rules: [
      {
        id: 'izhar',
        name: 'Izhar',
        arabic: 'إظهار',
        description: 'Clear pronunciation of noon sakinah before throat letters',
        letters: 'ء ه ع ح غ خ',
        example: 'مِنْ خَيْرٍ',
        audioUrl: '/audio/izhar.mp3',
      },
      {
        id: 'idgham',
        name: 'Idgham',
        arabic: 'إدغام',
        description: 'Merging of noon sakinah with certain letters',
        letters: 'ي ن م و ل ر',
        example: 'مَن يَّقُولُ',
        audioUrl: '/audio/idgham.mp3',
      },
      // Add more rules
    ],
  },
  // Add more categories
];

export default function TajweedRules() {
  const [selectedCategory, setSelectedCategory] = useState(tajweedRules[0]);
  const [selectedRule, setSelectedRule] = useState(selectedCategory.rules[0]);
  const [completedRules, setCompletedRules] = useState<Set<string>>(new Set());

  const markComplete = (ruleId: string) => {
    setCompletedRules(new Set([...completedRules, ruleId]));
  };

  const progress = (completedRules.size / tajweedRules.reduce((acc, cat) => acc + cat.rules.length, 0)) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tajweed Rules</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {completedRules.size} rules mastered
            </span>
            <Progress value={progress} className="w-24 h-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          {tajweedRules.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory.id === category.id ? 'default' : 'outline'}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedRule(category.rules[0]);
              }}
            >
              {category.category}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">{selectedRule.name}</h3>
              <p className="text-2xl text-right font-arabic">{selectedRule.arabic}</p>
              <p className="text-sm text-muted-foreground">
                {selectedRule.description}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Letters:</p>
              <p className="text-xl text-right font-arabic">{selectedRule.letters}</p>
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
              {completedRules.has(selectedRule.id) ? 'Mastered' : 'Mark as Mastered'}
            </Button>
          </div>

          <div className="space-y-2">
            {selectedCategory.rules.map((rule) => (
              <Card
                key={rule.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedRule.id === rule.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedRule(rule)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {rule.description}
                      </p>
                    </div>
                    {completedRules.has(rule.id) && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}