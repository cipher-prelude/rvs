"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface Step1FormProps {
  userEmail: string
}

export function Step1Form({ userEmail }: Step1FormProps) {
  const [email, setEmail] = useState(userEmail)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not found")

      // Update or create user onboarding record
      // const { error: onboardingError } = await supabase.from("user_onboarding").upsert({
      //   user_id: user.id,
      //   step1_completed: true,
      //   step2_completed: false,
      //   step3_completed: false,
      // })

      // if (onboardingError) throw onboardingError

      // Create or update profile
 //     const { error: profileError } = await supabase.from("profiles").upsert({
 //       id: user.id,
 //       email: email,
 //       onboarding_completed: false,
 //       role: "user",
 //     })

 //     if (profileError) throw profileError

      toast({
        title: "Step completed",
        description: "Your account details have been saved.",
      })

      router.push("/onboarding/step2")
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled
          className="bg-gray-50"
        />
        <p className="text-sm text-gray-500">This is the email you registered with.</p>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  )
}

