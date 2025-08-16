"use client"

import { useState } from "react"
import { useAtom } from "jotai"
import { Bell, Search, Settings, User, LogOut, Moon, Sun, Monitor } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { userAtom, notificationsAtom, unreadNotificationsAtom } from "@/lib/atoms"
import { useTheme } from "next-themes"

export function DashboardHeader() {
  const [user] = useAtom(userAtom)
  const [notifications] = useAtom(notificationsAtom)
  const [unreadCount] = useAtom(unreadNotificationsAtom)
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()

  const recentNotifications = notifications.slice(0, 5)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅"
      case "warning":
        return "⚠️"
      case "error":
        return "❌"
      default:
        return "ℹ️"
    }
  }

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...")
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar border-b border-sidebar-border backdrop-blur supports-[backdrop-filter]:bg-sidebar/95">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/60" />
            <Input
              placeholder="Search tasks, projects, or team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus:bg-sidebar-accent focus:border-sidebar-accent-foreground/20 focus-visible:ring-sidebar-ring"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white border-sidebar"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-sidebar border-sidebar-border">
              <DropdownMenuLabel className="text-sidebar-foreground">
                Notifications ({unreadCount} unread)
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-sidebar-border" />
              <ScrollArea className="h-64">
                <div className="space-y-1">
                  {recentNotifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex items-start gap-3 p-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
                    >
                      <span className="text-lg flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sidebar-foreground truncate">{notification.title}</p>
                        <p className="text-xs text-sidebar-foreground/70 mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-sidebar-foreground/50 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
                    </DropdownMenuItem>
                  ))}
                </div>
              </ScrollArea>
              <DropdownMenuSeparator className="bg-sidebar-border" />
              <DropdownMenuItem className="text-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <span className="w-full text-sidebar-foreground">View all notifications</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 bg-sidebar-border" />

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-sidebar border-sidebar-border">
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
              >
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
              >
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="hover:bg-sidebar-accent hover:text-sidebar-foreground text-sidebar-foreground"
              >
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-sidebar border-sidebar-border" align="end" forceMount>
              <DropdownMenuLabel className="font-normal text-sidebar-foreground">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-sidebar-foreground/70">{user?.email || "user@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-sidebar-border" />
              <DropdownMenuItem className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-sidebar-border" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
