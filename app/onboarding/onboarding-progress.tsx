"use client"

import { usePathname } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

export function OnboardingProgress() {
  const pathname = usePathname()

  const steps = [
    { name: "Account Setup", path: "/onboarding/step1" },
    { name: "Profile Details", path: "/onboarding/step2" },
    { name: "Final Steps", path: "/onboarding/step3" },
  ]

  const currentStepIndex = steps.findIndex((step) => step.path === pathname)

  return (
    <div className="relative">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => (
          <div
            key={step.name}
            className={`flex flex-col items-center relative z-10 ${
              index <= currentStepIndex ? "text-primary" : "text-gray-400"
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index < currentStepIndex
                  ? "bg-primary text-white border-primary"
                  : index === currentStepIndex
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-400"
              }`}
            >
              {index < currentStepIndex ? <CheckCircle2 className="w-6 h-6" /> : <span>{index + 1}</span>}
            </div>
            <span className="mt-2 text-sm font-medium">{step.name}</span>
          </div>
        ))}
      </div>
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}

