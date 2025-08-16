"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { OverviewView } from "@/components/overview-view"
import { TasksView } from "@/components/tasks-view"
import { ProjectsView } from "@/components/projects-view"
import { CalendarView } from "@/components/calendar-view"
import { TeamView } from "@/components/team-view"
import { MessagesView } from "@/components/messages-view"
import { DocumentsView } from "@/components/documents-view"
import { AnalyticsView } from "@/components/analytics-view"
import { NotificationsView } from "@/components/notifications-view"
import { SettingsView } from "@/components/settings-view"
import { ProjectTimelineView } from "@/components/project-timeline-view"
import { ProjectDependenciesView } from "@/components/project-dependencies-view"
import { ProjectGanttView } from "@/components/project-gantt-view"
import { TimeTrackingView } from "@/components/time-tracking-view"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DashboardPage() {
  const [activeView, setActiveView] = useState("overview")

  const renderView = () => {
    switch (activeView) {
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
      case "messages":
        return <MessagesView />
      case "documents":
        return <DocumentsView />
      case "analytics":
        return <AnalyticsView />
      case "notifications":
        return <NotificationsView />
      case "settings":
        return <SettingsView />
      case "timeline":
        return <ProjectTimelineView />
      case "dependencies":
        return <ProjectDependenciesView />
      case "gantt":
        return <ProjectGanttView />
      case "time-tracking":
        return <TimeTrackingView />
      default:
        return <OverviewView />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <DashboardSidebar activeView={activeView} onViewChange={setActiveView} />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-6">{renderView()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
