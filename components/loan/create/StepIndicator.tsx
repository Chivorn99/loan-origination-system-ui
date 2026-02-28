import { Check } from 'lucide-react';

interface Step {
  num: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8 flex items-center">
      {steps.map((s, idx) => (
        <div key={s.num} className="flex items-center">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                currentStep > s.num
                  ? 'bg-primary text-primary-foreground'
                  : currentStep === s.num
                    ? 'bg-primary text-primary-foreground ring-primary/20 ring-4'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {currentStep > s.num ? <Check className="h-4 w-4" /> : s.num}
            </div>
            <span
              className={`text-sm font-medium ${currentStep >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {s.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`mx-4 h-px w-12 transition-colors ${currentStep > s.num ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
