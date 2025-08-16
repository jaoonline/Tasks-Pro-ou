"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Users,
  Target,
  LayoutGrid,
  FileText,
  GitBranch,
  BarChart3,
} from "lucide-react"
import { ProjectTimelineView } from "./project-timeline-view"
import { ProjectGanttView } from "./project-gantt-view"
import { ProjectCollaborationView } from "./project-collaboration-view"
import { ProjectReportsView } from "./project-reports-view"
import { ProjectDependenciesView } from "./project-dependencies-view"
import { RealTimeNotifications } from "./real-time-notifications"
import toast from "react-hot-toast"

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "completed" | "on-hold"
  priority: "low" | "medium" | "high"
  startDate: string
  endDate: string
  teamMembers: string[]
  progress: number
  tasksTotal: number
  tasksCompleted: number
  createdAt: string
  client?: string
  budget?: number
  spent?: number
}

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete overhaul of the company website with modern design and improved UX",
      status: "active",
      priority: "high",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      teamMembers: ["John Doe", "Jane Smith", "Mike Johnson"],
      progress: 65,
      tasksTotal: 12,
      tasksCompleted: 8,
      createdAt: "2024-01-01",
      client: "Acme Corporation",
      budget: 50000,
      spent: 32500,
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "Native iOS and Android app for customer engagement",
      status: "active",
      priority: "medium",
      startDate: "2024-02-01",
      endDate: "2024-06-30",
      teamMembers: ["Sarah Wilson", "Alex Chen", "John Doe"],
      progress: 30,
      tasksTotal: 20,
      tasksCompleted: 6,
      createdAt: "2024-02-01",
      client: "Tech Startup Inc",
      budget: 75000,
      spent: 22500,
    },
    {
      id: "3",
      name: "Marketing Campaign",
      description: "Q1 digital marketing campaign across multiple channels",
      status: "completed",
      priority: "medium",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      teamMembers: ["Mike Johnson", "Sarah Wilson"],
      progress: 100,
      tasksTotal: 8,
      tasksCompleted: 8,
      createdAt: "2024-01-01",
      budget: 25000,
      spent: 24000,
    },
    {
      id: "4",
      name: "API Integration",
      description: "Integration with third-party services and APIs",
      status: "planning",
      priority: "low",
      startDate: "2024-04-01",
      endDate: "2024-05-31",
      teamMembers: ["Alex Chen", "John Doe"],
      progress: 5,
      tasksTotal: 15,
      tasksCompleted: 1,
      createdAt: "2024-03-15",
      budget: 30000,
      spent: 1500,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<string | null>(null)
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "planning" as const,
    priority: "medium" as const,
    startDate: "",
    endDate: "",
    teamMembers: [] as string[],
    client: "",
    budget: 0,
  })

  // Demo team members
  const teamMembers = [
    { id: "1", name: "John Doe", email: "john.doe@company.com" },
    { id: "2", name: "Jane Smith", email: "jane.smith@company.com" },
    { id: "3", name: "Mike Johnson", email: "mike.johnson@company.com" },
    { id: "4", name: "Sarah Wilson", email: "sarah.wilson@company.com" },
    { id: "5", name: "Alex Chen", email: "alex.chen@company.com" },
  ]

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateProject = async () => {
    if (!newProject.name.trim() || !newProject.description.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const project: Project = {
        id: Date.now().toString(),
        ...newProject,
        progress: 0,
        tasksTotal: 0,
        tasksCompleted: 0,
        createdAt: new Date().toISOString(),
        spent: 0,
      }

      setProjects([...projects, project])
      setNewProject({
        name: "",
        description: "",
        status: "planning",
        priority: "medium",
        startDate: "",
        endDate: "",
        teamMembers: [],
        client: "",
        budget: 0,
      })
      setIsCreateDialogOpen(false)
      toast.success("Project created successfully!")
    } catch (error) {
      toast.error("Failed to create project. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProject = async () => {
    if (!selectedProjectForEdit) return

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProjects(projects.map((p) => (p.id === selectedProjectForEdit.id ? selectedProjectForEdit : p)))
      setSelectedProjectForEdit(null)
      setIsEditDialogOpen(false)
      toast.success("Project updated successfully!")
    } catch (error) {
      toast.error("Failed to update project. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setProjects(projects.filter((p) => p.id !== projectId))
      toast.success("Project deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete project. Please try again.")
    }
  }

  const handleProjectDetails = (projectId: string) => {
    setSelectedProjectForDetails(projectId)
    setIsDetailsDialogOpen(true)
  }

  const handleEditProjectClick = (project: Project) => {
    setSelectedProjectForEdit(project)
    setIsEditDialogOpen(true)
  }

  const handleUpdateDependencies = (dependencies: any) => {
    console.log("Updating dependencies:", dependencies)
    toast.success("Dependencies updated successfully!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "active":
        return "bg-blue-500"
      case "planning":
        return "bg-yellow-500"
      case "on-hold":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const selectedProjectData = selectedProjectForDetails
    ? projects.find((p) => p.id === selectedProjectForDetails)
    : null

  return (
    <div className="space-y-6">
      {/* Real-time Notifications */}
      <RealTimeNotifications />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track your project progress</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to your workspace.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    placeholder="Client name (optional)"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value: any) => setNewProject({ ...newProject, status: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newProject.priority}
                    onValueChange={(value: any) => setNewProject({ ...newProject, priority: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: Number.parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button onClick={handleCreateProject} className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Project Tabs */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="grid">
            <LayoutGrid className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Grid</span>
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="gantt">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Gantt</span>
          </TabsTrigger>
          <TabsTrigger value="collaboration">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Collaborate</span>
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="dependencies">
            <GitBranch className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Dependencies</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <ProjectGridView
            projects={filteredProjects}
            onProjectDetails={handleProjectDetails}
            onEditProject={handleEditProjectClick}
            onDeleteProject={handleDeleteProject}
          />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <ProjectTimelineView projects={filteredProjects} onProjectDetails={handleProjectDetails} />
        </TabsContent>

        <TabsContent value="gantt" className="space-y-6">
          <ProjectGanttView projects={filteredProjects} onProjectDetails={handleProjectDetails} />
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          {selectedProjectForDetails && (
            <ProjectCollaborationView
              projectId={selectedProjectForDetails}
              projectName={projects.find((p) => p.id === selectedProjectForDetails)?.name || ""}
            />
          )}
          {!selectedProjectForDetails && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Project</h3>
                <p className="text-muted-foreground">
                  Choose a project from the grid view to access collaboration features.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {selectedProjectForDetails && (
            <ProjectReportsView
              projectId={selectedProjectForDetails}
              projectName={projects.find((p) => p.id === selectedProjectForDetails)?.name || ""}
            />
          )}
          {!selectedProjectForDetails && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Project</h3>
                <p className="text-muted-foreground">Choose a project from the grid view to view detailed reports.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-6">
          <ProjectDependenciesView projects={filteredProjects} onUpdateDependencies={handleUpdateDependencies} />
        </TabsContent>
      </Tabs>

      {/* Project Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {selectedProjectData && (
            <div className="space-y-6">
              {/* Project Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedProjectData.status)}`}></div>
                      <span className="font-medium">Status</span>
                    </div>
                    <p className="text-2xl font-bold capitalize">{selectedProjectData.status.replace("-", " ")}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Progress</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedProjectData.progress}%</p>
                    <Progress value={selectedProjectData.progress} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getPriorityColor(selectedProjectData.priority) as any}>
                        {selectedProjectData.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedProjectData.tasksCompleted} of {selectedProjectData.tasksTotal} tasks completed
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Project Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm">{selectedProjectData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Client</Label>
                    <p className="text-sm">{selectedProjectData.client || "Internal Project"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Start Date</Label>
                    <p className="text-sm">{new Date(selectedProjectData.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">End Date</Label>
                    <p className="text-sm">{new Date(selectedProjectData.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Budget</Label>
                    <p className="text-sm">
                      {selectedProjectData.budget ? formatCurrency(selectedProjectData.budget) : "Not set"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Spent</Label>
                    <p className="text-sm">
                      {selectedProjectData.spent ? formatCurrency(selectedProjectData.spent) : "$0"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedProjectData.description}</p>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Team Members</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProjectData.teamMembers.map((memberName, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{getInitials(memberName)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{memberName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => handleEditProjectClick(selectedProjectData)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDeleteProject(selectedProjectData.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </Button>
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project information and settings.</DialogDescription>
          </DialogHeader>
          {selectedProjectForEdit && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Project Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedProjectForEdit.name}
                    onChange={(e) => setSelectedProjectForEdit({ ...selectedProjectForEdit, name: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-client">Client</Label>
                  <Input
                    id="edit-client"
                    value={selectedProjectForEdit.client || ""}
                    onChange={(e) => setSelectedProjectForEdit({ ...selectedProjectForEdit, client: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedProjectForEdit.description}
                  onChange={(e) =>
                    setSelectedProjectForEdit({ ...selectedProjectForEdit, description: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={selectedProjectForEdit.status}
                    onValueChange={(value: any) =>
                      setSelectedProjectForEdit({ ...selectedProjectForEdit, status: value })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={selectedProjectForEdit.priority}
                    onValueChange={(value: any) =>
                      setSelectedProjectForEdit({ ...selectedProjectForEdit, priority: value })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-budget">Budget</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    value={selectedProjectForEdit.budget || 0}
                    onChange={(e) =>
                      setSelectedProjectForEdit({
                        ...selectedProjectForEdit,
                        budget: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={selectedProjectForEdit.startDate}
                    onChange={(e) =>
                      setSelectedProjectForEdit({ ...selectedProjectForEdit, startDate: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={selectedProjectForEdit.endDate}
                    onChange={(e) => setSelectedProjectForEdit({ ...selectedProjectForEdit, endDate: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleEditProject} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Project Grid Component
function ProjectGridView({
  projects,
  onProjectDetails,
  onEditProject,
  onDeleteProject,
}: {
  projects: Project[]
  onProjectDetails: (projectId: string) => void
  onEditProject: (project: Project) => void
  onDeleteProject: (projectId: string) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "active":
        return "bg-blue-500"
      case "planning":
        return "bg-yellow-500"
      case "on-hold":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground">Create your first project to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`}></div>
                  <Badge variant="outline" className="text-xs">
                    {project.status.replace("-", " ")}
                  </Badge>
                  <Badge variant={getPriorityColor(project.priority) as any} className="text-xs">
                    {project.priority}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onProjectDetails(project.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditProject(project)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteProject(project.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">{project.description}</p>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            {/* Project Details */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(project.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <div className="flex items-center gap-1">
                  {project.teamMembers.slice(0, 3).map((memberName, index) => (
                    <Avatar key={index} className="w-5 h-5">
                      <AvatarFallback className="text-xs">{getInitials(memberName)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {project.teamMembers.length > 3 && (
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">
                      +{project.teamMembers.length - 3}
                    </div>
                  )}
                </div>
              </div>
              {project.budget && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>
                    {formatCurrency(project.spent || 0)} / {formatCurrency(project.budget)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
