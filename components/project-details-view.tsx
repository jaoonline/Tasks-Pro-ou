"use client"

import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Calendar, Users, Target, Clock, LinkIcon, MessageSquare, FileText, BarChart3, Settings } from "lucide-react"
import { projectsAtom, tasksAtom, currentViewAtom, selectedProjectAtom, type Project } from "@/lib/atoms"
import { format } from "date-fns"
import { ProjectTimelineView } from "./project-timeline-view"
import { ProjectCollaborationView } from "./project-collaboration-view"
import { ProjectReportsView } from "./project-reports-view"

interface ProjectDetailsViewProps {
  projectId: string
  onClose: () => void
}

export function ProjectDetailsView({ projectId, onClose }: ProjectDetailsViewProps) {
  const [projects] = useAtom(projectsAtom)
  const [tasks] = useAtom(tasksAtom)
  const [, setCurrentView] = useAtom(currentViewAtom)
  const [, setSelectedProject] = useAtom(selectedProjectAtom)
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === projectId)
    setProject(foundProject || null)
  }, [projectId, projects])

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    )
  }

  const projectTasks = tasks.filter((task) => task.projectId === project.id)
  const completedTasks = projectTasks.filter((task) => task.status === "completed")
  const inProgressTasks = projectTasks.filter((task) => task.status === "in-progress")

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "planning":
        return "bg-blue-500"
      case "on-hold":
        return "bg-yellow-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const handleLinkToTasks = () => {
    setSelectedProject(project.id)
    setCurrentView("tasks")

    // Dispatch custom event to notify dashboard
    window.dispatchEvent(
      new CustomEvent("navigateToTasks", {
        detail: { projectId: project.id },
      }),
    )

    onClose()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{project.name}</h2>
            <Badge className={getStatusColor(project.status)}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
            {project.priority && (
              <Badge variant="outline" className={getPriorityColor(project.priority)}>
                {project.priority.toUpperCase()}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleLinkToTasks} className="bg-blue-600 hover:bg-blue-700">
            <LinkIcon className="mr-2 h-4 w-4" />
            View Project Tasks
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="h-full">
            <div className="border-b px-6">
              <TabsList className="h-12">
                <TabsTrigger value="overview" className="gap-2">
                  <Target className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="timeline" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="collaboration" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Collaboration
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Reports
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-6">
                <TabsContent value="overview" className="mt-0 space-y-6">
                  {/* Progress Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Overall Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{projectTasks.length}</p>
                          <p className="text-sm text-muted-foreground">Total Tasks</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
                          <p className="text-sm text-muted-foreground">Completed</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</p>
                          <p className="text-sm text-muted-foreground">In Progress</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team Members Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Team Members
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {project.teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`/placeholder-user.jpg`} />
                              <AvatarFallback>{member.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member}</p>
                              <p className="text-sm text-muted-foreground">Team Member</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {projectTasks.slice(0, 5).map((task) => (
                          <div key={task.id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">{task.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Assigned to {task.assignee} • {format(new Date(task.dueDate), "MMM d, yyyy")}
                              </p>
                            </div>
                            <Badge variant="outline">{task.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="mt-0">
                  <ProjectTimelineView projectId={project.id} />
                </TabsContent>

                <TabsContent value="collaboration" className="mt-0">
                  <ProjectCollaborationView projectId={project.id} />
                </TabsContent>

                <TabsContent value="reports" className="mt-0">
                  <ProjectReportsView projectId={project.id} />
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Settings</CardTitle>
                      <CardDescription>Manage project configuration and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Project Details</h4>
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Created</span>
                            <span>{format(new Date(project.createdAt), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Due Date</span>
                            <span>{format(new Date(project.dueDate), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Actions</h4>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" className="justify-start bg-transparent">
                            Archive Project
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start text-red-600 hover:text-red-600 bg-transparent"
                          >
                            Delete Project
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-muted/30">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLinkToTasks}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Link to Tasks
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Calendar
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </CardContent>
              </Card>

              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{format(new Date(project.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Due Date</span>
                    <span>{format(new Date(project.dueDate), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Team Size</span>
                    <span>{project.teamMembers.length} members</span>
                  </div>
                  {project.priority && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Priority</span>
                      <Badge variant="outline" className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Task Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Task Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">{projectTasks.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-medium text-green-600">{completedTasks.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">In Progress</span>
                    <span className="font-medium text-blue-600">{inProgressTasks.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">To Do</span>
                    <span className="font-medium text-gray-600">
                      {projectTasks.length - completedTasks.length - inProgressTasks.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
