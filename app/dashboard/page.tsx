"use client"

import { useAtom } from "jotai"
import { currentViewAtom } from "@/lib/atoms"
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
import { ProjectReportsView } from "@/components/project-reports-view"
import { ProjectCollaborationView } from "@/components/project-collaboration-view"
import { RealTimeNotifications } from "@/components/real-time-notifications"
import { ProjectGanttView } from "@/components/project-gantt-view"
import { ProjectDependenciesView } from "@/components/project-dependencies-view"
import { TimeTrackingView } from "@/components/time-tracking-view"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DashboardPage() {
  const [currentView] = useAtom(currentViewAtom)

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
        return <TeamView />
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
      case "project-timeline":
        return <ProjectTimelineView />
      case "project-reports":
        return <ProjectReportsView />
      case "project-collaboration":
        return <ProjectCollaborationView />
      case "project-gantt":
        return <ProjectGanttView />
      case "project-dependencies":
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
