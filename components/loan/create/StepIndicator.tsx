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
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                currentStep === s.num
                  ? 'bg-blue-600 text-white'
                  : currentStep > s.num
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s.num}
            </div>
            <span>{s.label}</span>
          </div>
          {idx < steps.length - 1 && <div className="mx-3 h-px w-16 bg-gray-200" />}
        </div>
      ))}
    </div>
  );
}
