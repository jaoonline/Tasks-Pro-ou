"use client"
import { useAtom } from "jotai"
import { currentViewAtom } from "@/lib/atoms"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  CheckSquare,
  FolderOpen,
  Calendar,
  Users,
  MessageSquare,
  FileText,
  BarChart3,
  Bell,
  Settings,
  Clock,
  GitBranch,
  GanttChartIcon as Gantt,
  TimerIcon as Timeline,
  ChevronUp,
  LogOut,
  User,
} from "lucide-react"

const navigationItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "tasks", label: "Tasks", icon: CheckSquare, badge: "12" },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "team", label: "Team", icon: Users },
]

const toolsItems = [
  { id: "messages", label: "Messages", icon: MessageSquare, badge: "3" },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "notifications", label: "Notifications", icon: Bell, badge: "5" },
]

const projectManagementItems = [
  { id: "timeline", label: "Timeline", icon: Timeline },
  { id: "gantt", label: "Gantt Chart", icon: Gantt },
  { id: "dependencies", label: "Dependencies", icon: GitBranch },
  { id: "time-tracking", label: "Time Tracking", icon: Clock },
]

const settingsItems = [{ id: "settings", label: "Settings", icon: Settings }]

export function DashboardSidebar() {
  const [currentView, setCurrentView] = useAtom(currentViewAtom)

  const handleViewChange = (viewId: string) => {
    setCurrentView(viewId)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">TasksPro</span>
            <span className="truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
              Project Management
            </span>
          </div>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleViewChange(item.id)}
                    isActive={currentView === item.id}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto group-data-[collapsible=icon]:hidden">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleViewChange(item.id)}
                    isActive={currentView === item.id}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto group-data-[collapsible=icon]:hidden">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Project Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectManagementItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleViewChange(item.id)}
                    isActive={currentView === item.id}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleViewChange(item.id)}
                    isActive={currentView === item.id}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">John Doe</span>
                    <span className="truncate text-xs">john@company.com</span>
                  </div>
                  <ChevronUp className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">John Doe</span>
                      <span className="truncate text-xs">john@company.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
