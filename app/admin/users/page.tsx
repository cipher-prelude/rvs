import { createClient } from "@/utils/supabase/server"
import { UsersTable } from "./users-table"

export default async function UsersPage() {
  const supabase = createClient()

  // Get all users
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      <UsersTable users={users || []} />
    </div>
  )
}

