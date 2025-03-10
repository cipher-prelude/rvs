import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Step2Form } from "./step2-form"

export default async function Step2() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user has completed step 1
  const { data: userOnboarding } = await supabase
    .from("user_onboarding")
    .select("step1_completed, step2_completed")
    .eq("user_id", session.user.id)
    .single()

  if (!userOnboarding || !userOnboarding.step1_completed) {
    redirect("/onboarding/step1")
  }

  if (userOnboarding.step2_completed) {
    redirect("/onboarding/step3")
  }

  // Get the onboarding configuration for step 2
  const { data: config } = await supabase.from("onboarding_config").select("step2_components").single()

  const step2Components = config?.step2_components || []

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
      <p className="text-gray-600 mb-6">Please provide the following information to complete your profile.</p>
      <Step2Form components={step2Components} />
    </div>
  )
}

