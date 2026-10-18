import { useState, type ReactNode } from "react";
import { cn } from "../utils/cn";

interface ReflectionStep {
  id: string;
  question: string;
  illustration: string;
  children: ReactNode;
}

export interface GuidedReflectionProps {
  steps: ReflectionStep[];
  onComplete: (answers: Record<string, string>) => void;
  onSkip: () => void;
  onPreferNotToSay: () => void;
  title?: string;
}

export function GuidedReflection({
  steps,
  onComplete,
  onSkip,
  onPreferNotToSay,
  title = "Let's check in together",
}: GuidedReflectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [canContinue, setCanContinue] = useState(false);

  const totalSteps = steps.length;
  const step = currentStep < totalSteps ? steps[currentStep] : undefined;

  if (!step) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center min-h-[400px]">
        <p className="text-esc-slate-600">No questions available.</p>
        <button
          type="button"
          onClick={onSkip}
          className="mt-4 text-sm text-esc-indigo-500 underline underline-offset-2"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const handleContinue = () => {
    if (!canContinue) return;

    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      setCanContinue(false);
    } else {
      onComplete(answers);
    }
  };

  const handleSkip = () => {
    setAnswers((prev) => ({ ...prev, [step.id]: "skipped" }));
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      setCanContinue(false);
    } else {
      onComplete(answers);
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [step.id]: value }));
    setCanContinue(true);
  };

  return (
    <div
      className="flex flex-col px-6 pt-10 pb-6 min-h-[400px]"
      role="form"
      aria-labelledby="reflection-title"
    >
      <div className="flex justify-center gap-2 mb-2" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-colors duration-200",
              i <= currentStep ? "bg-esc-indigo-500" : "bg-esc-slate-100",
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="text-xs text-esc-slate-200 text-center mb-6">
        Question {currentStep + 1} of {totalSteps}
      </p>

      <div className="flex justify-center mb-5" aria-hidden="true">
        <span className="text-5xl">{step.illustration || "🌿"}</span>
      </div>

      <h2
        id="reflection-title"
        className="text-xl font-semibold text-esc-slate-800 text-center leading-7 mb-7"
      >
        {currentStep === 0 ? title : step.question}
      </h2>

      <div className="flex-1 flex flex-col justify-center mb-6">
        {step && (
          <div
            key={step.id}
            className="animate-fade-in"
            role="radiogroup"
            aria-label={step.question}
          >
            {step.children && typeof step.children === "function"
              ? (step.children as (props: { onAnswer: (value: string) => void }) => ReactNode)({ onAnswer: handleAnswer })
              : step.children}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue}
        className={cn(
          "w-full py-4 rounded-lg text-base font-semibold transition-all duration-150 touch-target",
          "focus:outline-none focus:ring-2 focus:ring-esc-indigo-400 focus:ring-offset-2",
          canContinue
            ? "bg-esc-indigo-500 text-white hover:bg-esc-indigo-600 active:scale-[0.98]"
            : "bg-esc-indigo-500 text-white opacity-40 cursor-not-allowed",
        )}
      >
        Continue
      </button>

      <button
        type="button"
        onClick={handleSkip}
        className="py-3 text-sm text-esc-slate-600 underline underline-offset-2 hover:text-esc-slate-800 focus:outline-none focus:ring-2 focus:ring-esc-slate-400 focus:ring-offset-2 rounded touch-target"
      >
        Prefer not to say
      </button>
    </div>
  );
}
