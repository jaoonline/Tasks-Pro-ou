"use client"

import { useAtom } from "jotai"
import { currentViewAtom, projectsAtom } from "@/lib/atoms"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { OverviewView } from "@/components/overview-view"
import { TasksView } from "@/components/tasks-view"
import { ProjectsView } from "@/components/projects-view"
import { CalendarView } from "@/components/calendar-view"
import { TeamView } from "@/components/team-view"
import { AnalyticsView } from "@/components/analytics-view"
import { MessagesView } from "@/components/messages-view"
import { DocumentsView } from "@/components/documents-view"
import { NotificationsView } from "@/components/notifications-view"
import { SettingsView } from "@/components/settings-view"
import { ProjectTimelineView } from "@/components/project-timeline-view"
import { ProjectGanttView } from "@/components/project-gantt-view"
import { ProjectDependenciesView } from "@/components/project-dependencies-view"
import { TimeTrackingView } from "@/components/time-tracking-view"
import { RealTimeNotifications } from "@/components/real-time-notifications"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

// Mock projects data for timeline view
const mockTimelineProjects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete redesign of the company website",
    status: "active" as const,
    priority: "high" as const,
    startDate: "2024-01-01",
    endDate: "2024-02-15",
    teamMembers: ["Jane Smith", "John Doe"],
    progress: 65,
    tasksTotal: 12,
    tasksCompleted: 8,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Develop a mobile app for iOS and Android",
    status: "planning" as const,
    priority: "medium" as const,
    startDate: "2024-01-15",
    endDate: "2024-03-01",
    teamMembers: ["John Doe", "Mike Johnson"],
    progress: 30,
    tasksTotal: 20,
    tasksCompleted: 6,
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q1 marketing campaign launch",
    status: "completed" as const,
    priority: "low" as const,
    startDate: "2023-12-01",
    endDate: "2024-01-31",
    teamMembers: ["Sarah Wilson", "Tom Brown"],
    progress: 100,
    tasksTotal: 8,
    tasksCompleted: 8,
    createdAt: "2023-12-01",
  },
]

export default function DashboardPage() {
  const [currentView] = useAtom(currentViewAtom)
  const [projects] = useAtom(projectsAtom)

  const handleProjectDetails = (projectId: string) => {
    console.log("View project details:", projectId)
  }

  const renderView = () => {
    switch (currentView) {
      case "overview":
        return <OverviewView />
      case "tasks":
        return <TasksView />
      case "projects":
        return <ProjectsView />
      case "calendar":
        return <CalendarView />
      case "team":
        return <TeamView isAdmin= { false }/>
      case "analytics":
        return <AnalyticsView />
      case "messages":
        return <MessagesView />
      case "documents":
        return <DocumentsView />
      case "notifications":
        return <NotificationsView />
      case "settings":
        return <SettingsView />
      case "timeline":
        return <ProjectTimelineView projects={mockTimelineProjects} onProjectDetails={handleProjectDetails} />
      case "gantt":
        return <ProjectGanttView />
      case "dependencies":
        return <ProjectDependenciesView />
      case "time-tracking":
        return <TimeTrackingView />
      default:
        return <OverviewView />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <DashboardSidebar />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-6">{renderView()}</main>
        </SidebarInset>
      </div>
      <RealTimeNotifications />
    </SidebarProvider>
  )
}
