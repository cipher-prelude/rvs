"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface OnboardingConfigFormProps {
  initialConfig: {
    id?: string
    step2_components?: string[]
    step3_components?: string[]
  }
}

export function OnboardingConfigForm({ initialConfig }: OnboardingConfigFormProps) {
  const [step2Components, setStep2Components] = useState<string[]>(initialConfig.step2_components || [])
  const [step3Components, setStep3Components] = useState<string[]>(initialConfig.step3_components || [])
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const supabase = createClient()

  const componentOptions = [
    { id: "about_me", label: "About Me (Text Area)" },
    { id: "address", label: "Address Collection" },
    { id: "birthdate", label: "Birthdate Selection" },
  ]

  const handleStep2Change = (id: string, checked: boolean) => {
    if (checked) {
      setStep2Components([...step2Components, id])
    } else {
      setStep2Components(step2Components.filter((item) => item !== id))
    }
  }

  const handleStep3Change = (id: string, checked: boolean) => {
    if (checked) {
      setStep3Components([...step3Components, id])
    } else {
      setStep3Components(step3Components.filter((item) => item !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.from("onboarding_config").upsert({
        id: initialConfig.id || "1",
        step2_components: step2Components,
        step3_components: step3Components,
      })

      if (error) throw error

      toast({
        title: "Configuration saved",
        description: "The onboarding configuration has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 2 Components</CardTitle>
            <CardDescription>
              Select the components that should appear in step 2 of the onboarding process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {componentOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`step2-${option.id}`}
                    checked={step2Components.includes(option.id)}
                    onCheckedChange={(checked) => handleStep2Change(option.id, checked as boolean)}
                  />
                  <Label htmlFor={`step2-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3 Components</CardTitle>
            <CardDescription>
              Select the components that should appear in step 3 of the onboarding process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {componentOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`step3-${option.id}`}
                    checked={step3Components.includes(option.id)}
                    onCheckedChange={(checked) => handleStep3Change(option.id, checked as boolean)}
                  />
                  <Label htmlFor={`step3-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </form>
  )
}

