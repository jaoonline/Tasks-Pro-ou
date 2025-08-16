"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Clock, Users, TrendingUp, Calendar, Plus, ArrowRight, BarChart3, Target } from "lucide-react"

export function OverviewView() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  const stats = [
    {
      title: "Total Tasks",
      value: "142",
      change: "+12%",
      changeType: "positive" as const,
      icon: CheckSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "In Progress",
      value: "28",
      change: "+5%",
      changeType: "positive" as const,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Team Members",
      value: "12",
      change: "+2",
      changeType: "positive" as const,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Completion Rate",
      value: "87%",
      change: "+3%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const upcomingTasks = [
    {
      id: "1",
      title: "Design System Updates",
      project: "Website Redesign",
      dueDate: "Today",
      priority: "high",
      assignee: "John Doe",
      status: "in-progress",
    },
    {
      id: "2",
      title: "API Integration Testing",
      project: "Mobile App",
      dueDate: "Tomorrow",
      priority: "medium",
      assignee: "Jane Smith",
      status: "todo",
    },
    {
      id: "3",
      title: "User Feedback Analysis",
      project: "Product Research",
      dueDate: "Jan 28",
      priority: "low",
      assignee: "Mike Johnson",
      status: "todo",
    },
  ]

  const projects = [
    {
      id: "1",
      name: "Website Redesign",
      progress: 75,
      tasks: { completed: 18, total: 24 },
      team: ["JD", "JS", "MJ"],
      status: "on-track",
      dueDate: "Feb 15",
    },
    {
      id: "2",
      name: "Mobile App Development",
      progress: 45,
      tasks: { completed: 12, total: 28 },
      team: ["SW", "AC", "RB"],
      status: "at-risk",
      dueDate: "Mar 10",
    },
    {
      id: "3",
      name: "Marketing Campaign",
      progress: 90,
      tasks: { completed: 15, total: 16 },
      team: ["EM", "DL"],
      status: "on-track",
      dueDate: "Jan 30",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-green-100 text-green-800"
      case "at-risk":
        return "bg-red-100 text-red-800"
      case "delayed":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6 scrollbar-hide">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {["week", "month", "quarter"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="h-8 capitalize"
              >
                {period}
              </Button>
            ))}
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last {selectedPeriod}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 scrollbar-hide">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{task.project}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{task.dueDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {task.assignee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Project Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Project Progress
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 scrollbar-hide">
            {projects.map((project) => (
              <div key={project.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{project.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">
                        {project.tasks.completed}/{project.tasks.total} tasks
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">Due {project.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getStatusColor(project.status)}>
                      {project.status.replace("-", " ")}
                    </Badge>
                    <div className="flex -space-x-1">
                      {project.team.map((member, index) => (
                        <Avatar key={index} className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs">{member}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200 bg-transparent"
            >
              <Plus className="h-5 w-5" />
              <span>Create Task</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-200 bg-transparent"
            >
              <Users className="h-5 w-5" />
              <span>Invite Team</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-200 bg-transparent"
            >
              <BarChart3 className="h-5 w-5" />
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
