import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToastHelpers } from '@/components/ui/toaster';
import { useAuth } from '@/context/AuthContext';
import { ApiError, onboardingApi } from '@/lib/api';
import { getNotificationPermission, isPushSupported, subscribeToPush } from '@/lib/push';
import { DeliveryType, FeedingMethod } from '@firstweeks/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Baby,
  Bell,
  Brain,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplet,
} from 'lucide-react';
import { useState } from 'react';
import { type FieldErrors, type UseFormRegister, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const onboardingSchema = z.object({
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  deliveryType: z.nativeEnum(DeliveryType),
  feedingMethod: z.nativeEnum(FeedingMethod),
  mentalHealthBaseline: z.object({
    phq2Score: z.number().min(0).max(6),
    gad2Score: z.number().min(0).max(6),
    epdsScore: z.number().min(0).max(30).optional(),
  }),
  complications: z.array(z.string()),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

const STEPS = [
  { id: 'delivery', title: 'Delivery Details', icon: Calendar },
  { id: 'feeding', title: 'Feeding Method', icon: Droplet },
  { id: 'mental-health', title: 'Mental Health Baseline', icon: Brain },
  { id: 'complications', title: 'Complications', icon: AlertCircle },
  { id: 'notifications', title: 'Notifications', icon: Bell },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const { success: toastSuccess, error: toastError } = useToastHelpers();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      deliveryDate: '',
      deliveryType: DeliveryType.VAGINAL,
      feedingMethod: FeedingMethod.BREASTFEEDING,
      mentalHealthBaseline: { phq2Score: 0, gad2Score: 0 },
      complications: [],
    },
  });

  const deliveryDate = watch('deliveryDate');
  const deliveryType = watch('deliveryType');
  const feedingMethod = watch('feedingMethod');
  const phq2Score = watch('mentalHealthBaseline.phq2Score');
  const gad2Score = watch('mentalHealthBaseline.gad2Score');
  const complications = watch('complications');

  const onSubmit = async (data: OnboardingForm) => {
    setIsLoading(true);
    try {
      await onboardingApi.submit(data);
      toastSuccess('Onboarding complete!', 'Your recovery profile has been created.');
      await refresh();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        toastError('Error', err.message);
      } else {
        toastError('Error', 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!deliveryDate && !!deliveryType;
      case 1:
        return !!feedingMethod;
      case 2:
        return phq2Score !== undefined && gad2Score !== undefined;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <DeliveryStep register={register} errors={errors} />;
      case 1:
        return <FeedingStep register={register} errors={errors} />;
      case 2:
        return <MentalHealthStep register={register} errors={errors} />;
      case 3:
        return <ComplicationsStep setValue={setValue} complications={complications} />;
      case 4:
        return <NotificationStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Progress value={((currentStep + 1) / STEPS.length) * 100} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          {STEPS.map((step, i) => (
            <div key={step.id} className={i === currentStep ? 'font-medium text-primary-600' : ''}>
              {step.title}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle as="h1">{STEPS[currentStep].title}</CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {STEPS.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}

            <div className="flex justify-between pt-4 border-t">
              <Button
                key="back"
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              {currentStep === STEPS.length - 1 ? (
                <Button key="submit" type="submit" disabled={isLoading || !isStepValid()}>
                  {isLoading ? 'Completing...' : 'Complete Onboarding'}
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button key="next" type="button" onClick={nextStep} disabled={!isStepValid()}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function DeliveryStep({
  register,
  errors,
}: {
  register: UseFormRegister<OnboardingForm>;
  errors: FieldErrors<OnboardingForm>;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="deliveryDate">Delivery Date</Label>
        <Input
          id="deliveryDate"
          type="date"
          max={new Date().toISOString().split('T')[0]}
          {...register('deliveryDate')}
        />
        {errors.deliveryDate && (
          <p className="text-sm text-red-600">{errors.deliveryDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Delivery Type</Label>
        <RadioGroup {...register('deliveryType')}>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(DeliveryType).map(([key, value]) => {
              const radioId = `delivery-type-${value}`;
              return (
                <label
                  key={value}
                  htmlFor={radioId}
                  className="peer relative flex cursor-pointer items-center justify-center rounded-lg border p-4 text-center transition-all peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700"
                >
                  <RadioGroupItem value={value} id={radioId} className="sr-only" />
                  <div className="flex flex-col items-center gap-2">
                    {key === 'VAGINAL' && <Baby className="h-6 w-6" />}
                    {key === 'C_SECTION' && <span className="text-xl">🏥</span>}
                    {key === 'VBAC' && <span className="text-xl">👶</span>}
                    <span className="font-medium">{key.replace('_', ' ')}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </RadioGroup>
        {errors.deliveryType && (
          <p className="text-sm text-red-600">{errors.deliveryType.message}</p>
        )}
      </div>
    </div>
  );
}

function FeedingStep({
  register,
  errors,
}: {
  register: UseFormRegister<OnboardingForm>;
  errors: FieldErrors<OnboardingForm>;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Feeding Method</Label>
        <RadioGroup {...register('feedingMethod')}>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(FeedingMethod).map(([key, value]) => {
              const radioId = `feeding-method-${value}`;
              return (
                <label
                  key={value}
                  htmlFor={radioId}
                  className="peer relative flex cursor-pointer items-center justify-center rounded-lg border p-4 text-center transition-all peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700"
                >
                  <RadioGroupItem value={value} id={radioId} className="sr-only" />
                  <div className="flex flex-col items-center gap-2">
                    {key === 'BREASTFEEDING' && <span className="text-xl">🤱</span>}
                    {key === 'FORMULA' && <span className="text-xl">🍼</span>}
                    {key === 'COMBO' && <span className="text-xl">🤱🍼</span>}
                    {key === 'PUMPING' && <span className="text-xl">🫙</span>}
                    <span className="font-medium">
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </RadioGroup>
        {errors.feedingMethod && (
          <p className="text-sm text-red-600">{errors.feedingMethod.message}</p>
        )}
      </div>
    </div>
  );
}

function MentalHealthStep({
  register,
  errors,
}: {
  register: UseFormRegister<OnboardingForm>;
  errors: FieldErrors<OnboardingForm>;
}) {
  const renderScoreSelector = (
    label: string,
    name: keyof OnboardingForm['mentalHealthBaseline'],
    description: string,
    max: number
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Select {...register(`mentalHealthBaseline.${name}`)}>
        <SelectTrigger>
          <SelectValue placeholder="Select score" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: max + 1 }, (_, i) => (
            <SelectItem key={String(i)} value={String(i)}>
              {i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.mentalHealthBaseline?.[name] && (
        <p className="text-sm text-red-600">{errors.mentalHealthBaseline[name].message}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          These questions help us personalize your daily check-ins. Your answers are private and
          used only to tailor your experience.
        </p>
      </div>

      {renderScoreSelector(
        'Little interest or pleasure in doing things (PHQ-2)',
        'phq2Score',
        'Over the past 2 weeks, how often have you been bothered by this? (0 = Not at all, 3 = Nearly every day)',
        3
      )}

      {renderScoreSelector(
        'Feeling down, depressed, or hopeless (PHQ-2)',
        'gad2Score',
        'Over the past 2 weeks, how often have you been bothered by this? (0 = Not at all, 3 = Nearly every day)',
        3
      )}
    </div>
  );
}

function ComplicationsStep({
  setValue,
  complications,
}: { setValue: ReturnType<typeof useForm<OnboardingForm>>['setValue']; complications: string[] }) {
  const commonComplications = [
    'preeclampsia',
    'gestational_diabetes',
    'postpartum_hemorrhage',
    'c_section_infection',
    'perineal_tear',
    'mastitis',
    'thyroid_issues',
    'anemia',
  ];

  const toggleComplication = (comp: string) => {
    const updated = complications.includes(comp)
      ? complications.filter((c) => c !== comp)
      : [...complications, comp];
    setValue('complications', updated, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Any complications during or after delivery?</Label>
        <p className="text-sm text-muted-foreground">Select all that apply (optional)</p>
        <div className="flex flex-wrap gap-2">
          {commonComplications.map((comp) => (
            <label
              key={comp}
              className="peer relative inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700"
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={complications.includes(comp)}
                onChange={() => toggleComplication(comp)}
              />
              <span className="capitalize">{comp.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otherComplications">Other (specify)</Label>
        <Input
          id="otherComplications"
          placeholder="Type and press Enter to add"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              const val = e.currentTarget.value.trim();
              if (!complications.includes(val)) {
                setValue('complications', [...complications, val], { shouldValidate: true });
              }
              e.currentTarget.value = '';
            }
          }}
        />
        {complications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {complications.map((comp) => (
              <span
                key={comp}
                className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs text-primary-700"
              >
                {comp}
                <button
                  type="button"
                  onClick={() => toggleComplication(comp)}
                  className="hover:text-primary-900"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationStep() {
  const { success: toastSuccess, error: toastError } = useToastHelpers();
  const navigate = useNavigate();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [pushSupported] = useState(() => isPushSupported());
  const [permission, setPermission] = useState(() => getNotificationPermission());

  const handleEnableNotifications = async () => {
    if (!pushSupported) {
      toastError('Not Supported', 'Push notifications are not supported in this browser');
      return;
    }

    setIsSubscribing(true);
    try {
      const subscription = await subscribeToPush();
      if (subscription) {
        await onboardingApi.savePushSubscription(subscription);
        toastSuccess('Enabled', 'You will receive daily check-in reminders at 9 AM');
        setPermission('granted');
      } else {
        toastError('Permission Denied', 'Please enable notifications in your browser settings');
      }
    } catch (err) {
      console.error('Failed to enable notifications:', err);
      toastError('Error', 'Failed to enable notifications');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleComplete = () => {
    navigate('/dashboard', { replace: true });
  };

  if (!pushSupported) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Bell className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold">Daily Reminders</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Push notifications are not supported in this browser. You can still complete daily
          check-ins manually from the dashboard.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <Button variant="outline" onClick={handleSkip}>
            Continue to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (permission === 'granted') {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Bell className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold">Notifications Enabled</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          You&apos;ll receive a daily reminder at 9 AM to complete your check-in. You can adjust
          this in your profile settings anytime.
        </p>
        <Button onClick={handleComplete}>Continue to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
        <Bell className="h-8 w-8 text-primary-600" />
      </div>
      <h2 className="text-xl font-bold">Stay on Track with Daily Reminders</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Get a gentle nudge at 9 AM each day to complete your check-in. It takes less than 2 minutes
        and helps your care team monitor your recovery.
      </p>
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-left">
        <p className="font-medium text-blue-800 mb-2">What you&apos;ll receive:</p>
        <ul className="space-y-1 text-blue-700">
          <li className="flex items-center gap-2">✓ Daily check-in reminder (9 AM)</li>
          <li className="flex items-center gap-2">
            ✓ Escalation alerts if your care team needs to reach out
          </li>
        </ul>
        <p className="text-xs text-blue-600 mt-2">
          Your data is private. Notifications only contain reminders — no health information.
        </p>
      </div>
      <div className="flex gap-3 justify-center pt-4">
        <Button variant="outline" onClick={handleSkip} disabled={isSubscribing}>
          Skip for Now
        </Button>
        <Button onClick={handleEnableNotifications} disabled={isSubscribing}>
          {isSubscribing ? 'Enabling...' : 'Enable Reminders'}
        </Button>
      </div>
      {permission === 'denied' && (
        <p className="text-sm text-amber-600">
          Notifications are blocked. You can enable them later in your browser settings or profile
          page.
        </p>
      )}
    </div>
  );
}
