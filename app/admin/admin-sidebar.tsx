"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings, Users, LogOut, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Onboarding Config", href: "/admin/onboarding-config", icon: Settings },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Data", href: "/data", icon: Database },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white p-6 flex flex-col h-screen">
      <div className="text-xl font-bold mb-8">Admin Panel</div>
      <nav className="space-y-2 flex-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          )
        })}
      </nav>
      <form action="/auth/signout" method="post">
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </form>
    </div>
  )
}

