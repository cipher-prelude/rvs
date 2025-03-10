"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { MoreHorizontal, UserCog } from "lucide-react"

interface User {
  id: string
  email: string
  role: string
  onboarding_completed: boolean
  created_at: string
}

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [tableUsers, setTableUsers] = useState<User[]>(users)
  const { toast } = useToast()
  const supabase = createClient()

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin"

    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

      if (error) throw error

      setTableUsers(tableUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

      toast({
        title: "Role updated",
        description: `User role changed to ${newRole}.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role.",
        variant: "destructive",
      })
    }
  }

  const resetOnboarding = async (userId: string) => {
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ onboarding_completed: false })
        .eq("id", userId)

      if (profileError) throw profileError

      // Reset onboarding progress
      const { error: onboardingError } = await supabase
        .from("user_onboarding")
        .update({
          step1_completed: false,
          step2_completed: false,
          step3_completed: false,
        })
        .eq("user_id", userId)

      if (onboardingError) throw onboardingError

      setTableUsers(tableUsers.map((user) => (user.id === userId ? { ...user, onboarding_completed: false } : user)))

      toast({
        title: "Onboarding reset",
        description: "User will need to complete the onboarding process again.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset onboarding.",
        variant: "destructive",
      })
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Onboarding Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.role}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  user.onboarding_completed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {user.onboarding_completed ? "Completed" : "In Progress"}
              </span>
            </TableCell>
            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toggleRole(user.id, user.role)}>
                    <UserCog className="mr-2 h-4 w-4" />
                    {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => resetOnboarding(user.id)}>Reset Onboarding</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

