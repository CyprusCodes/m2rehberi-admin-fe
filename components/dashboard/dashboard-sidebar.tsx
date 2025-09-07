"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Server,
  MessageSquare,
  Megaphone,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Tags,
  Package,
  ShieldCheck,
  Image,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },

  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Servers",
    href: "/admin/servers",
    icon: Server,
  },
  {
    name: "Forums",
    href: "/admin/forums",
    icon: MessageSquare,
  },
  {
    name: "Tags",
    href: "/admin/tags",
    icon: Tags,
  },
  {
    name: "Advertisement",
    href: "/admin/advertisement",
    icon: Megaphone,
  },
  {
    name: "Ad Packages",
    href: "/admin/advertisement/packages",
    icon: Package,
  },
  {
    name: "Carousel",
    href: "/admin/carousel",
    icon: Image,
  },
  {
    name: "User Role Requests",
    href: "/admin/server-owner-requests",
    icon: ShieldCheck,
  },
  {
    name: "System Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [supportOpen, setSupportOpen] = useState(true)
  const pathname = usePathname()

  return (
    <div className={cn("flex flex-col border-r bg-card transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">MP</span>
            </div>
            <span className="font-bold text-lg">MetinPort</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start gap-3 h-10", collapsed && "justify-center px-2")}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            )
          })}

          {/* Support accordion */}
          <div className="mt-2">
            <Button
              variant={pathname.startsWith('/admin/support') ? "secondary" : "ghost"}
              className={cn("w-full justify-between h-10", collapsed && "justify-center px-2")}
              onClick={() => setSupportOpen(prev => !prev)}
            >
              <span className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4" />
                {!collapsed && <span>Support</span>}
              </span>
              {!collapsed && (supportOpen ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>) }
            </Button>
            {!collapsed && supportOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <Link href="/admin/support/categories">
                  <Button variant={pathname === '/admin/support/categories' ? "secondary" : "ghost"} className="w-full justify-start h-9">Kategoriler</Button>
                </Link>
                <Link href="/admin/support/tickets">
                  <Button variant={pathname === '/admin/support/tickets' ? "secondary" : "ghost"} className="w-full justify-start h-9">Ticketlar</Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </ScrollArea>
    </div>
  )
}
