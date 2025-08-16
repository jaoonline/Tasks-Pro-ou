"use client"

import { useAtom } from "jotai"
import { Search, Plus, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { currentViewAtom } from "@/lib/atoms"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  const [currentView, setCurrentView] = useAtom(currentViewAtom)

  const getViewTitle = () => {
    switch (currentView) {
      case "overview":
        return "Dashboard Overview"
      case "tasks":
        return "Tasks"
      case "projects":
        return "Projects"
      case "calendar":
        return "Calendar"
      case "team":
        return "Team"
      case "analytics":
        return "Analytics"
      case "messages":
        return "Messages"
      case "documents":
        return "Documents"
      case "notifications":
        return "Notifications"
      case "settings":
        return "Settings"
      case "project-timeline":
        return "Project Timeline"
      case "project-reports":
        return "Project Reports"
      case "project-collaboration":
        return "Project Collaboration"
      case "project-gantt":
        return "Gantt Chart"
      case "project-dependencies":
        return "Project Dependencies"
      case "time-tracking":
        return "Time Tracking"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-8 w-8" />
        <div>
          <h1 className="text-xl font-semibold">{getViewTitle()}</h1>
          <p className="text-sm text-muted-foreground">Welcome back, manage your projects efficiently</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search tasks, projects..." className="w-64 pl-10" />
        </div>

        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Task</span>
        </Button>

        <Button variant="ghost" size="sm" className="relative" onClick={() => setCurrentView("notifications")}>
          <Bell className="h-4 w-4" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setCurrentView("settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
