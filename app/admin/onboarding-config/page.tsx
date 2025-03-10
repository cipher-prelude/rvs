import { createClient } from "@/utils/supabase/server"
import { OnboardingConfigForm } from "./onboarding-config-form"

export default async function OnboardingConfig() {
  const supabase = createClient()

  // Get current onboarding configuration
  const { data: config } = await supabase.from("onboarding_config").select("*").single()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Onboarding Configuration</h1>
      <div className="max-w-3xl">
        <OnboardingConfigForm initialConfig={config || {}} />
      </div>
    </div>
  )
}

