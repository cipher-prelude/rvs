"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface Step2FormProps {
  components: string[]
}

export function Step2Form({ components }: Step2FormProps) {
  const [aboutMe, setAboutMe] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [birthdate, setBirthdate] = useState<Date | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

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

      // Prepare profile data based on components
      const profileData: any = {
        id: user.id,
      }

      if (components.includes("about_me")) {
        profileData.about_me = aboutMe
      }

      if (components.includes("address")) {
        profileData.address = {
          street,
          city,
          state,
          zip,
        }
      }

      if (components.includes("birthdate") && birthdate) {
        profileData.birthdate = birthdate.toISOString()
      }

      // Update profile
      const { error: profileError } = await supabase.from("profiles").upsert(profileData)

      if (profileError) throw profileError

      // Update onboarding progress
      const { error: onboardingError } = await supabase
        .from("user_onboarding")
        .update({
          step2_completed: true,
        })
        .eq("user_id", user.id)

      if (onboardingError) throw onboardingError

      toast({
        title: "Step completed",
        description: "Your profile details have been saved.",
      })

      router.push("/onboarding/step3")
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
      {components.includes("about_me") && (
        <div className="space-y-2">
          <Label htmlFor="about-me">About Me</Label>
          <Textarea
            id="about-me"
            placeholder="Tell us about yourself..."
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
      )}

      {components.includes("address") && (
        <div className="space-y-4">
          <h3 className="font-medium">Address Information</h3>
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input id="street" placeholder="123 Main St" value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="New York" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="NY" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input id="zip" placeholder="10001" value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
        </div>
      )}

      {components.includes("birthdate") && (
        <div className="space-y-2">
          <Label htmlFor="birthdate">Birthdate</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button id="birthdate" variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {birthdate ? format(birthdate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={birthdate}
                onSelect={(date) => {
                  setBirthdate(date)
                  setIsCalendarOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/onboarding/step1")}>
          Back
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  )
}

