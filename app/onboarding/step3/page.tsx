import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Step3Form } from "./step3-form"

export default async function Step3() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user has completed step 2
  const { data: userOnboarding } = await supabase
    .from("user_onboarding")
    .select("step1_completed, step2_completed, step3_completed")
    .eq("user_id", session.user.id)
    .single()

  if (!userOnboarding || !userOnboarding.step1_completed || !userOnboarding.step2_completed) {
    redirect("/onboarding/step2")
  }

  if (userOnboarding.step3_completed) {
    redirect("/dashboard")
  }

  // Get the onboarding configuration for step 3
  const { data: config } = await supabase.from("onboarding_config").select("step3_components").single()

  const step3Components = config?.step3_components || []

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Final Steps</h2>
      <p className="text-gray-600 mb-6">
        You're almost done! Please complete the following information to finish the onboarding process.
      </p>
      <Step3Form components={step3Components} />
    </div>
  )
}

