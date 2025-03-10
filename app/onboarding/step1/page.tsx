import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Step1Form } from "./step1-form"

export default async function Step1() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user has already completed this step
  const { data: userOnboarding } = await supabase
    .from("user_onboarding")
    .select("step1_completed")
    .eq("user_id", session.user.id)
    .single()

  if (userOnboarding && userOnboarding.step1_completed) {
    redirect("/onboarding/step2")
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Account Setup</h2>
      <p className="text-gray-600 mb-6">Welcome to the onboarding process! Let's confirm your account details.</p>
      <Step1Form userEmail={session.user.email || ""} />
    </div>
  )
}

