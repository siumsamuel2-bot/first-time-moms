import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToastHelpers } from '@/components/ui/toaster';
import { ApiError, checkinApi, onboardingApi } from '@/lib/api';
import { BleedingLevel } from '@firstweeks/shared';
import type { Question } from '@firstweeks/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const checkInSchema = z.object({
  date: z.string().min(1),
  sleepHours: z.coerce.number().min(0).max(24).optional(),
  sleepDisruption: z.coerce.number().min(1).max(5).optional(),
  sadness: z.coerce.number().min(1).max(5).optional(),
  anxiety: z.coerce.number().min(1).max(5).optional(),
  painLevel: z.coerce.number().min(1).max(10).optional(),
  bleeding: z.string().optional(),
  feedingIssues: z.boolean().default(false),
  customResponses: z.record(z.unknown()).default({}),
});

type CheckInForm = z.infer<typeof checkInSchema>;

// The question bank stores human-readable option labels; the API expects the
// matching `BleedingLevel` enum value.
const BLEEDING_BY_LABEL: Record<string, BleedingLevel> = {
  None: BleedingLevel.NONE,
  Spotting: BleedingLevel.SPOTTING,
  Light: BleedingLevel.LIGHT,
  Moderate: BleedingLevel.MODERATE,
  'Heavy (soaking pad in <1hr)': BleedingLevel.HEAVY,
};

export function CheckInPage() {
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToastHelpers();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [escalationCreated, setEscalationCreated] = useState(false);

  const { handleSubmit, watch, setValue } = useForm<CheckInForm>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      sleepHours: undefined,
      sleepDisruption: undefined,
      sadness: undefined,
      anxiety: undefined,
      painLevel: undefined,
      bleeding: undefined,
      feedingIssues: false,
      customResponses: {},
    },
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await onboardingApi.getTodaysQuestions();
      setQuestions(data.questions);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'ONBOARDING_REQUIRED') {
        navigate('/onboarding', { replace: true });
      } else {
        toastError('Error', 'Failed to load questions');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const onSubmit = async (data: CheckInForm) => {
    setIsSubmitting(true);
    try {
      const result = await checkinApi.submit({
        ...data,
        bleeding: data.bleeding
          ? (BLEEDING_BY_LABEL[data.bleeding] ?? (data.bleeding as BleedingLevel))
          : undefined,
      });
      if (result.escalationCreated) {
        setEscalationCreated(true);
      } else {
        toastSuccess('Check-in complete!', 'Your responses have been saved.');
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        toastError('Error', err.message);
      } else {
        toastError('Error', 'Failed to save check-in');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAnswer = (value: string | number | boolean) => {
    if (currentQ) {
      const fieldMap: Record<string, keyof CheckInForm> = {
        sleep_hours: 'sleepHours',
        sleep_disruption: 'sleepDisruption',
        sadness: 'sadness',
        anxiety: 'anxiety',
        pain_level: 'painLevel',
        bleeding: 'bleeding',
        feeding_issues: 'feedingIssues',
      };

      const field = fieldMap[currentQ.id];
      if (field) {
        setValue(field, value, { shouldValidate: true });
      } else {
        setValue(
          'customResponses',
          { ...watch('customResponses'), [currentQ.id]: value },
          { shouldValidate: true }
        );
      }
    }
    nextQuestion();
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-8 bg-muted rounded animate-pulse mt-4" />
      </div>
    );
  }

  if (escalationCreated) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <AlertCircle className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Check-in Complete</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Your responses have been saved. Based on your answers, we've flagged this for review by
          your care team. They'll reach out if needed.
        </p>
        <Button onClick={() => navigate('/dashboard', { replace: true })}>Go to Dashboard</Button>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Check className="mx-auto mb-4 h-16 w-16 text-green-600" />
        <h1 className="text-2xl font-bold mb-2">All caught up!</h1>
        <p className="text-muted-foreground">
          You've completed today's check-in. Come back tomorrow.
        </p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'scale':
        return (
          <RadioGroup
            value={
              (fieldMap[currentQ.id] &&
                watch(fieldMap[currentQ.id] as keyof CheckInForm)?.toString()) ||
              ''
            }
            onValueChange={handleAnswer}
          >
            <div className="grid gap-3" role="radiogroup" aria-label={currentQ.text}>
              {currentQ.options?.map((option, i) => {
                const radioId = `scale-${currentQ.id}-${i}`;
                const optionKey = `scale-${option}-${i}`;
                return (
                  <label
                    key={optionKey}
                    htmlFor={radioId}
                    className="peer relative flex cursor-pointer items-center justify-center rounded-lg border p-4 text-center transition-all peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700"
                  >
                    <RadioGroupItem value={String(i + 1)} id={radioId} className="sr-only" />
                    <span className="font-medium">{option}</span>
                  </label>
                );
              })}
            </div>
          </RadioGroup>
        );
      case 'multiple_choice':
        return (
          <RadioGroup
            value={
              (fieldMap[currentQ.id] &&
                watch(fieldMap[currentQ.id] as keyof CheckInForm)?.toString()) ||
              ''
            }
            onValueChange={handleAnswer}
          >
            <div className="grid gap-3" role="radiogroup" aria-label={currentQ.text}>
              {currentQ.options?.map((option) => {
                const radioId = `multi-${currentQ.id}-${option}`;
                return (
                  <label
                    key={radioId}
                    htmlFor={radioId}
                    className="peer relative flex cursor-pointer items-center justify-center rounded-lg border p-4 text-center transition-all peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700"
                  >
                    <RadioGroupItem value={option} id={radioId} className="sr-only" />
                    <span className="font-medium">{option}</span>
                  </label>
                );
              })}
            </div>
          </RadioGroup>
        );
      case 'boolean':
        return (
          <RadioGroup
            value={
              (fieldMap[currentQ.id] &&
                watch(fieldMap[currentQ.id] as keyof CheckInForm)?.toString()) ||
              ''
            }
            onValueChange={handleAnswer}
          >
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={currentQ.text}>
              <label
                htmlFor="boolean-true"
                className="peer relative flex cursor-pointer items-center justify-center rounded-lg border p-4 text-center transition-all peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700"
              >
                <RadioGroupItem value="true" id="boolean-true" className="sr-only" />
                <span className="font-medium">Yes</span>
              </label>
              <label
                htmlFor="boolean-false"
                className="peer relative flex cursor-pointer items-center justify-center rounded-lg border p-4 text-center transition-all peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700"
              >
                <RadioGroupItem value="false" id="boolean-false" className="sr-only" />
                <span className="font-medium">No</span>
              </label>
            </div>
          </RadioGroup>
        );
      case 'text':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Your answer..."
              value={(watch(fieldMap[currentQ.id] as keyof CheckInForm) as string) || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="text-lg"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const fieldMap: Record<string, keyof CheckInForm> = {
    sleep_hours: 'sleepHours',
    sleep_disruption: 'sleepDisruption',
    sadness: 'sadness',
    anxiety: 'anxiety',
    pain_level: 'painLevel',
    bleeding: 'bleeding',
    feeding_issues: 'feedingIssues',
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQ.text}</CardTitle>
          {currentQ.category && (
            <span className="text-xs text-muted-foreground capitalize">{currentQ.category}</span>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {renderQuestion()}

          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {currentQuestion === questions.length - 1 ? (
              <Button type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
                {isSubmitting ? 'Saving...' : 'Complete Check-in'}
                <Check className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={nextQuestion}
                disabled={!watch(fieldMap[currentQ.id] as keyof CheckInForm)}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
