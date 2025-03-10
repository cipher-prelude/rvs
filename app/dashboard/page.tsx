import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"

export default async function Dashboard() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  if (!profile || !profile.onboarding_completed) {
    redirect("/onboarding/step1")
  }

  // Check if user is admin
  if (profile.role === "admin") {
    redirect("/admin")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <div className="grid gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome, {profile.email}</h2>
          <p className="text-gray-600 mb-4">You have successfully completed the onboarding process.</p>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Your Profile Information:</h3>
              <div className="mt-2 space-y-2">
                {profile.about_me && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">About Me</p>
                    <p className="mt-1">{profile.about_me}</p>
                  </div>
                )}

                {profile.address && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="mt-1">
                      {profile.address.street}, {profile.address.city}, {profile.address.state} {profile.address.zip}
                    </p>
                  </div>
                )}

                {profile.birthdate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Birthdate</p>
                    <p className="mt-1">{new Date(profile.birthdate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            <form action="/auth/signout" method="post">
              <Button type="submit" variant="outline">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

