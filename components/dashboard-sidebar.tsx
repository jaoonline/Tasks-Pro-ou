"use client"
import { useAtom } from "jotai"
import { currentViewAtom } from "@/lib/atoms"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
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
  BarChart3,
  MessageSquare,
  FileText,
  Bell,
  Settings,
  Clock,
  GitBranch,
  GanttChartIcon as Gantt,
  Network,
  ChevronUp,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react"

const navigationItems = [
  {
    title: "Overview",
    url: "#",
    icon: Home,
    view: "overview",
  },
  {
    title: "Tasks",
    url: "#",
    icon: CheckSquare,
    view: "tasks",
    badge: "12",
  },
  {
    title: "Projects",
    url: "#",
    icon: FolderOpen,
    view: "projects",
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
    view: "calendar",
  },
  {
    title: "Team",
    url: "#",
    icon: Users,
    view: "team",
  },
]

const toolsItems = [
  {
    title: "Analytics",
    url: "#",
    icon: BarChart3,
    view: "analytics",
  },
  {
    title: "Messages",
    url: "#",
    icon: MessageSquare,
    view: "messages",
    badge: "3",
  },
  {
    title: "Documents",
    url: "#",
    icon: FileText,
    view: "documents",
  },
  {
    title: "Time Tracking",
    url: "#",
    icon: Clock,
    view: "time-tracking",
  },
]

const projectManagementItems = [
  {
    title: "Timeline",
    url: "#",
    icon: GitBranch,
    view: "timeline",
  },
  {
    title: "Gantt Chart",
    url: "#",
    icon: Gantt,
    view: "gantt",
  },
  {
    title: "Dependencies",
    url: "#",
    icon: Network,
    view: "dependencies",
  },
]

const settingsItems = [
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
    view: "notifications",
    badge: "5",
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    view: "settings",
  },
]

export function DashboardSidebar() {
  const [currentView, setCurrentView] = useAtom(currentViewAtom)

  const handleViewChange = (view: string) => {
    setCurrentView(view)
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <CheckSquare className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">TasksPro</span>
            <span className="truncate text-xs">Project Management</span>
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
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => handleViewChange(item.view)}
                    isActive={currentView === item.view}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs"
                      >
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
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => handleViewChange(item.view)}
                    isActive={currentView === item.view}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs"
                      >
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
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => handleViewChange(item.view)}
                    isActive={currentView === item.view}
                  >
                    <item.icon />
                    <span>{item.title}</span>
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
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => handleViewChange(item.view)}
                    isActive={currentView === item.view}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
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
                    <AvatarImage src="/placeholder.svg" alt="John Doe" />
                    <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">John Doe</span>
                    <span className="truncate text-xs">john.doe@company.com</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
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
                      <AvatarImage src="/placeholder.svg" alt="John Doe" />
                      <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">John Doe</span>
                      <span className="truncate text-xs">john.doe@company.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewChange("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
