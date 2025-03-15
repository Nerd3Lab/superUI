import { Icon } from '@iconify/react';

interface Step {
  label: string;
  description: string;
  icon: string;
  active: boolean;
}

const steps: Step[] = [
  {
    label: 'Developer Setting',
    description: 'Configure your development environment',
    icon: 'mdi:cog-outline',
    active: false,
  },
  {
    label: 'Contract Detail',
    description: 'Review contract parameters before deployment',
    icon: 'mdi:code-json',
    active: true,
  },
  {
    label: 'Deploy contract',
    description: 'Unleash your contract on the Superchain',
    icon: 'mdi:cloud-upload-outline',
    active: false,
  },
];

export default function Stepper() {
  return (
    <div className="relative flex flex-col space-y-6">
      {steps.map((step, index) => (
        <div key={index} className="relative flex items-start space-x-4">
          {index !== steps.length - 1 && (
            <div className="absolute left-[19px] top-10 w-0.5 h-full bg-gray-300"></div>
          )}
          <div
            className={`relative w-10 h-10 flex items-center justify-center rounded-full z-10 ${
              step.active
                ? 'bg-gradient-to-r from-green-400 to-purple-400 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Icon icon={step.icon} className="text-xl" />
          </div>
          <div>
            <h3
              className={`font-semibold ${
                step.active ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {step.label}
            </h3>
            <p className="text-gray-500 text-sm">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
