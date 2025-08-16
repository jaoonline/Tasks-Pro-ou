"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Calendar,
  Users,
  Clock,
  DollarSign,
  Target,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Edit,
  Settings,
  List,
  FileText,
  Download,
  SlidersHorizontal,
} from "lucide-react"
import { useRouter } from "next/navigation"

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

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  phone?: string
  location?: string
  tasksAssigned: number
  tasksCompleted: number
  joinDate: string
}

interface ProjectDetailsViewProps {
  projectId: string
  onBack: () => void
}

export function ProjectDetailsView({ projectId, onBack }: ProjectDetailsViewProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load project details (in real app, this would be an API call)
    const demoProject: Project = {
      id: projectId,
      name: "Website Redesign",
      description:
        "Complete overhaul of the company website with modern design and improved UX. This project includes redesigning all major pages, implementing responsive design, improving site performance, and enhancing user experience across all devices.",
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
    }

    const demoTeamMembers: TeamMember[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@company.com",
        role: "Lead Developer",
        department: "Engineering",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        tasksAssigned: 5,
        tasksCompleted: 3,
        joinDate: "2024-01-01",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@company.com",
        role: "UI/UX Designer",
        department: "Design",
        phone: "+1 (555) 234-5678",
        location: "New York, NY",
        tasksAssigned: 4,
        tasksCompleted: 3,
        joinDate: "2024-01-01",
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        role: "Marketing Manager",
        department: "Marketing",
        phone: "+1 (555) 345-6789",
        location: "Austin, TX",
        tasksAssigned: 3,
        tasksCompleted: 2,
        joinDate: "2024-01-15",
      },
    ]

    setProject(demoProject)
    setTeamMembers(demoTeamMembers)
  }, [projectId])

  if (!project) {
    return <div>Loading...</div>
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

  const daysRemaining = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const budgetUsed = project.budget && project.spent ? (project.spent / project.budget) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`}></div>
              <Badge variant="outline" className="text-xs">
                {project.status}
              </Badge>
              <Badge variant={getPriorityColor(project.priority) as any} className="text-xs">
                {project.priority} priority
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
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
            <p className="text-xs text-muted-foreground mt-2">
              {project.tasksCompleted} of {project.tasksTotal} tasks completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysRemaining}</div>
            <p className="text-xs text-muted-foreground">{daysRemaining > 0 ? "days remaining" : "days overdue"}</p>
            <p className="text-xs text-muted-foreground mt-1">Due: {new Date(project.endDate).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetUsed.toFixed(0)}%</div>
            <Progress value={budgetUsed} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {project.spent ? formatCurrency(project.spent) : "$0"} of{" "}
              {project.budget ? formatCurrency(project.budget) : "$0"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">active members</p>
            <div className="flex items-center gap-1 mt-2">
              {teamMembers.slice(0, 3).map((member, index) => (
                <Avatar key={index} className="w-6 h-6">
                  <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                </Avatar>
              ))}
              {teamMembers.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  +{teamMembers.length - 3}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Client</h4>
                  <p className="text-sm">{project.client || "Internal Project"}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Project Manager</h4>
                  <p className="text-sm">John Doe</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Start Date</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(project.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">End Date</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(project.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Created</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <div className="flex items-center gap-2">
                    {project.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {project.status === "active" && <Clock className="h-4 w-4 text-blue-600" />}
                    {project.status === "planning" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    {project.status === "on-hold" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    <span className="text-sm capitalize">{project.status.replace("-", " ")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members Table */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.department}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{member.role}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {member.tasksCompleted}/{member.tasksAssigned} completed
                          </div>
                          <Progress value={(member.tasksCompleted / member.tasksAssigned) * 100} className="mt-1 h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </div>
                          {member.phone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {member.phone}
                            </div>
                          )}
                          {member.location && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {member.location}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tasks Completed</span>
                <span className="font-medium">
                  {project.tasksCompleted}/{project.tasksTotal}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Days Remaining</span>
                <span className="font-medium">{daysRemaining}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Budget Used</span>
                <span className="font-medium">{budgetUsed.toFixed(0)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Team Members</span>
                <span className="font-medium">{teamMembers.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Project Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={() => router.push(`/dashboard?view=tasks&project=${projectId}`)}
              >
                <List className="h-4 w-4 mr-2" />
                View All Tasks
              </Button>
              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={() => console.log("Generate Report")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button className="w-full bg-transparent" variant="outline" onClick={() => console.log("Export Data")}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={() => console.log("Project Settings")}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Project Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
