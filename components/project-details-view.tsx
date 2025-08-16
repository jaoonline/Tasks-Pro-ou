"use client"
import { useAtom } from "jotai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Calendar,
  Users,
  Target,
  FileText,
  MessageSquare,
  ArrowLeft,
  Link,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Circle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { currentViewAtom, selectedProjectAtom, projectsAtom, tasksAtom, teamMembersAtom } from "@/lib/atoms"
import { ProjectCollaborationView } from "./project-collaboration-view"
import { ProjectReportsView } from "./project-reports-view"

export function ProjectDetailsView() {
  const [currentView, setCurrentView] = useAtom(currentViewAtom)
  const [selectedProjectId] = useAtom(selectedProjectAtom)
  const [projects] = useAtom(projectsAtom)
  const [tasks] = useAtom(tasksAtom)
  const [teamMembers] = useAtom(teamMembersAtom)

  const project = projects.find((p) => p.id === selectedProjectId)

  const handleBackToProjects = () => {
    setCurrentView("projects")
  }

  const handleViewProjectTasks = () => {
    // Dispatch custom event to navigate to tasks view with project filter
    const event = new CustomEvent("navigateToProjectTasks", {
      detail: { projectId: selectedProjectId },
    })
    window.dispatchEvent(event)
    setCurrentView("tasks")
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Project Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The selected project could not be found.</p>
          <Button onClick={handleBackToProjects} className="mt-4">
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  const projectTasks = tasks.filter((task) => task.projectId === project.id)
  const completedTasks = projectTasks.filter((task) => task.status === "completed")
  const inProgressTasks = projectTasks.filter((task) => task.status === "in-progress")
  const todoTasks = projectTasks.filter((task) => task.status === "todo")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBackToProjects}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{project.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleViewProjectTasks} className="bg-blue-600 hover:bg-blue-700">
            <Link className="h-4 w-4 mr-2" />
            View Project Tasks
          </Button>
          <Badge variant="outline" className={cn("px-3 py-1", getStatusColor(project.status))}>
            {project.status.replace("-", " ")}
          </Badge>
        </div>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <Progress value={project.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectTasks.length}</div>
            <p className="text-xs text-muted-foreground">{completedTasks.length} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.teamMembers.length}</div>
            <div className="flex -space-x-2 mt-2">
              {project.teamMembers.slice(0, 3).map((memberName, index) => {
                const member = teamMembers.find((m) => m.name === memberName)
                return (
                  <Avatar key={index} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={member?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{getInitials(memberName)}</AvatarFallback>
                  </Avatar>
                )
              })}
              {project.teamMembers.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium">+{project.teamMembers.length - 3}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(project.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
            <p className="text-xs text-muted-foreground">{new Date(project.dueDate).getFullYear()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Status Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Task Overview</CardTitle>
                <CardDescription>Current status of all project tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">To Do</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{todoTasks.length}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-400 h-2 rounded-full"
                          style={{ width: `${(todoTasks.length / projectTasks.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{inProgressTasks.length}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(inProgressTasks.length / projectTasks.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{completedTasks.length}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(completedTasks.length / projectTasks.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={handleViewProjectTasks}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Link to Tasks
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Team Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes to this project</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-60">
                <div className="space-y-4">
                  {projectTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : task.status === "in-progress" ? (
                          <AlertCircle className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{task.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Assigned to {task.assignee} • {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {task.status.replace("-", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration">
          <ProjectCollaborationView />
        </TabsContent>

        <TabsContent value="reports">
          <ProjectReportsView />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>Manage project configuration and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">General Settings</h3>
                  <p className="text-sm text-muted-foreground">Basic project information and configuration</p>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Project Visibility</h4>
                      <p className="text-sm text-muted-foreground">Control who can see this project</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Notifications</h4>
                      <p className="text-sm text-muted-foreground">Manage project notification settings</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Integrations</h4>
                      <p className="text-sm text-muted-foreground">Connect external tools and services</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
