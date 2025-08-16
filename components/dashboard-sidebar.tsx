"use client"
import { useAtom } from "jotai"
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Users,
  BarChart3,
  MessageSquare,
  FileText,
  Bell,
  Settings,
  FolderOpen,
  Clock,
  GitBranch,
  GanttChart,
} from "lucide-react"
import { currentViewAtom } from "@/lib/atoms"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const navigationItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    view: "overview",
    badge: null,
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    view: "tasks",
    badge: "12",
  },
  {
    title: "Projects",
    icon: FolderOpen,
    view: "projects",
    badge: null,
  },
  {
    title: "Calendar",
    icon: Calendar,
    view: "calendar",
    badge: null,
  },
  {
    title: "Team",
    icon: Users,
    view: "team",
    badge: null,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    view: "analytics",
    badge: null,
  },
  {
    title: "Messages",
    icon: MessageSquare,
    view: "messages",
    badge: "3",
  },
  {
    title: "Documents",
    icon: FileText,
    view: "documents",
    badge: null,
  },
  {
    title: "Notifications",
    icon: Bell,
    view: "notifications",
    badge: "5",
  },
]

const projectTools = [
  {
    title: "Timeline",
    icon: GanttChart,
    view: "project-timeline",
    badge: null,
  },
  {
    title: "Dependencies",
    icon: GitBranch,
    view: "project-dependencies",
    badge: null,
  },
  {
    title: "Gantt Chart",
    icon: GanttChart,
    view: "project-gantt",
    badge: null,
  },
  {
    title: "Time Tracking",
    icon: Clock,
    view: "time-tracking",
    badge: null,
  },
]

export function DashboardSidebar() {
  const [currentView, setCurrentView] = useAtom(currentViewAtom)

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-semibold">TaskPro</h2>
            <p className="text-xs text-muted-foreground">Project Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton
                    onClick={() => setCurrentView(item.view as any)}
                    isActive={currentView === item.view}
                    tooltip={item.title}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 text-xs group-data-[collapsible=icon]:hidden"
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
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Project Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectTools.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton
                    onClick={() => setCurrentView(item.view as any)}
                    isActive={currentView === item.view}
                    tooltip={item.title}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 text-xs group-data-[collapsible=icon]:hidden"
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
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setCurrentView("settings")}
                  isActive={currentView === "settings"}
                  tooltip="Settings"
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start" tooltip="John Doe">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="group-data-[collapsible=icon]:hidden flex flex-col items-start">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-muted-foreground">john@example.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
