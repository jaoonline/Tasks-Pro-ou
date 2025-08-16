"use client"

import { useAtom } from "jotai"
import { currentViewAtom, unreadNotificationsAtom } from "@/lib/atoms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Search, Plus, Bell, Settings } from "lucide-react"

const viewLabels: Record<string, string> = {
  overview: "Overview",
  tasks: "Tasks",
  projects: "Projects",
  calendar: "Calendar",
  team: "Team",
  messages: "Messages",
  documents: "Documents",
  analytics: "Analytics",
  notifications: "Notifications",
  settings: "Settings",
  timeline: "Timeline",
  gantt: "Gantt Chart",
  dependencies: "Dependencies",
  "time-tracking": "Time Tracking",
}

export function DashboardHeader() {
  const [currentView] = useAtom(currentViewAtom)
  const [unreadCount] = useAtom(unreadNotificationsAtom)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{viewLabels[currentView] || "Dashboard"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-2 px-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search tasks, projects..." className="w-[200px] pl-8 md:w-[300px]" />
        </div>

        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Task</span>
        </Button>

        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>

        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
