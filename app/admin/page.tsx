import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, CheckCircle2Icon, ClipboardListIcon } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = createClient()

  // Get total users count
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  // Get completed onboarding count
  const { count: completedOnboarding } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("onboarding_completed", true)

  // Get admin users count
  const { count: adminUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin")

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">{adminUsers || 0} admin users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Onboarding</CardTitle>
            <CheckCircle2Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOnboarding || 0}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsers ? Math.round(((completedOnboarding || 0) / totalUsers) * 100) : 0}% of users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalUsers || 0) - (completedOnboarding || 0)}</div>
            <p className="text-xs text-muted-foreground">Users still in onboarding</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

