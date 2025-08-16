"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  Search,
  Filter,
  CheckCircle,
  Info,
  Users,
  Briefcase,
  Mail,
  Wrench,
  Calendar,
  Clock,
  User,
  Trash2,
  BookMarkedIcon as MarkAsUnread,
  Eye,
} from "lucide-react"

interface Notification {
  id: string
  type: "task" | "project" | "team" | "message" | "system"
  title: string
  description: string
  timestamp: string
  isRead: boolean
  priority: "high" | "medium" | "low"
  sender?: string
  avatar?: string
  details?: {
    taskName?: string
    projectName?: string
    assignedBy?: string
    dueDate?: string
    teamName?: string
    department?: string
    messageContent?: string
    systemVersion?: string
    maintenanceWindow?: string
    affectedServices?: string[]
  }
}

export function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "task",
      title: "New task assigned",
      description: "You have been assigned to 'Update user authentication system'",
      timestamp: "2024-01-15T10:30:00Z",
      isRead: false,
      priority: "high",
      sender: "Sarah Wilson",
      avatar: "/placeholder-user.jpg",
      details: {
        taskName: "Update user authentication system",
        projectName: "Security Enhancement",
        assignedBy: "Sarah Wilson",
        dueDate: "2024-01-20T23:59:59Z",
      },
    },
    {
      id: "2",
      type: "project",
      title: "Project deadline approaching",
      description: "Website Redesign project is due in 2 days",
      timestamp: "2024-01-15T09:15:00Z",
      isRead: false,
      priority: "medium",
      sender: "Project Manager",
      details: {
        projectName: "Website Redesign",
        dueDate: "2024-01-17T23:59:59Z",
      },
    },
    {
      id: "3",
      type: "team",
      title: "New team member joined",
      description: "Alex Chen has joined the Development team",
      timestamp: "2024-01-14T16:45:00Z",
      isRead: true,
      priority: "low",
      sender: "HR Team",
      details: {
        teamName: "Development Team",
        department: "Engineering",
      },
    },
    {
      id: "4",
      type: "message",
      title: "New message received",
      description: "Mike Johnson sent you a message about the API integration",
      timestamp: "2024-01-14T14:20:00Z",
      isRead: false,
      priority: "medium",
      sender: "Mike Johnson",
      avatar: "/placeholder-user.jpg",
      details: {
        messageContent:
          "Hey! I wanted to discuss the API integration timeline. Can we schedule a meeting this week to go over the technical requirements and implementation strategy?",
      },
    },
    {
      id: "5",
      type: "system",
      title: "System maintenance scheduled",
      description: "Scheduled maintenance on January 20th from 2:00 AM to 4:00 AM",
      timestamp: "2024-01-13T12:00:00Z",
      isRead: true,
      priority: "low",
      sender: "System Admin",
      details: {
        systemVersion: "v2.1.0",
        maintenanceWindow: "January 20th, 2:00 AM - 4:00 AM EST",
        affectedServices: ["Authentication", "File Storage", "Email Service"],
      },
    },
    {
      id: "6",
      type: "task",
      title: "Task completed",
      description: "Database optimization task has been completed",
      timestamp: "2024-01-13T11:30:00Z",
      isRead: true,
      priority: "low",
      sender: "Alex Chen",
      details: {
        taskName: "Database optimization",
        projectName: "Performance Improvements",
        assignedBy: "Tech Lead",
      },
    },
    {
      id: "7",
      type: "project",
      title: "Project milestone reached",
      description: "Mobile App Development reached 75% completion",
      timestamp: "2024-01-12T15:20:00Z",
      isRead: false,
      priority: "medium",
      sender: "Project Manager",
      details: {
        projectName: "Mobile App Development",
        dueDate: "2024-02-15T23:59:59Z",
      },
    },
  ])

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "project":
        return <Briefcase className="h-5 w-5 text-green-500" />
      case "team":
        return <Users className="h-5 w-5 text-purple-500" />
      case "message":
        return <Mail className="h-5 w-5 text-orange-500" />
      case "system":
        return <Wrench className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const formatFullTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsDetailModalOpen(true)

    // Mark as read when viewing details
    if (!notification.isRead) {
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))
    }
  }

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
  }

  const handleMarkAsUnread = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: false } : n)))
  }

  const handleDelete = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && !notification.isRead
    if (activeTab === "read") return matchesSearch && notification.isRead
    return matchesSearch && notification.type === activeTab
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6 scrollbar-hide">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your tasks, projects, and team activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {unreadCount} unread
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 scrollbar-hide"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Notification Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="task">Tasks</TabsTrigger>
          <TabsTrigger value="project">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 scrollbar-hide">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-auto scrollbar-hide">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 ${
                    !notification.isRead
                      ? "border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/20"
                      : "border-l-gray-200 dark:border-l-gray-700"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-medium ${
                                !notification.isRead ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <Badge variant="secondary" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(notification.timestamp)}
                            </div>
                            {notification.sender && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {notification.sender}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(notification)}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            notification.isRead
                              ? handleMarkAsUnread(notification.id)
                              : handleMarkAsRead(notification.id)
                          }
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          {notification.isRead ? (
                            <MarkAsUnread className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                          className="hover:scale-105 transition-transform duration-200 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try adjusting your search terms" : "You're all caught up!"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Notification Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNotification && getNotificationIcon(selectedNotification.type)}
              Notification Details
            </DialogTitle>
            <DialogDescription>View complete information about this notification</DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="flex-1 overflow-auto space-y-6 scrollbar-hide">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedNotification.title}</h3>
                  <Badge variant="secondary" className={getPriorityColor(selectedNotification.priority)}>
                    {selectedNotification.priority} priority
                  </Badge>
                </div>
                <p className="text-muted-foreground">{selectedNotification.description}</p>
              </div>

              <Separator />

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Received:</span>
                    <span>{formatFullTimestamp(selectedNotification.timestamp)}</span>
                  </div>
                  {selectedNotification.sender && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">From:</span>
                      <span>{selectedNotification.sender}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Type:</span>
                    <span className="capitalize">{selectedNotification.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Status:</span>
                    <span>{selectedNotification.isRead ? "Read" : "Unread"}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Type-specific Details */}
              {selectedNotification.details && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Additional Information</h4>

                  {selectedNotification.type === "task" && selectedNotification.details && (
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      {selectedNotification.details.taskName && (
                        <div>
                          <span className="font-medium">Task Name: </span>
                          <span>{selectedNotification.details.taskName}</span>
                        </div>
                      )}
                      {selectedNotification.details.projectName && (
                        <div>
                          <span className="font-medium">Project: </span>
                          <span>{selectedNotification.details.projectName}</span>
                        </div>
                      )}
                      {selectedNotification.details.assignedBy && (
                        <div>
                          <span className="font-medium">Assigned By: </span>
                          <span>{selectedNotification.details.assignedBy}</span>
                        </div>
                      )}
                      {selectedNotification.details.dueDate && (
                        <div>
                          <span className="font-medium">Due Date: </span>
                          <span>{new Date(selectedNotification.details.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedNotification.type === "project" && selectedNotification.details && (
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      {selectedNotification.details.projectName && (
                        <div>
                          <span className="font-medium">Project Name: </span>
                          <span>{selectedNotification.details.projectName}</span>
                        </div>
                      )}
                      {selectedNotification.details.dueDate && (
                        <div>
                          <span className="font-medium">Deadline: </span>
                          <span>{new Date(selectedNotification.details.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedNotification.type === "team" && selectedNotification.details && (
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      {selectedNotification.details.teamName && (
                        <div>
                          <span className="font-medium">Team: </span>
                          <span>{selectedNotification.details.teamName}</span>
                        </div>
                      )}
                      {selectedNotification.details.department && (
                        <div>
                          <span className="font-medium">Department: </span>
                          <span>{selectedNotification.details.department}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedNotification.type === "message" && selectedNotification.details && (
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      {selectedNotification.details.messageContent && (
                        <div>
                          <span className="font-medium">Message: </span>
                          <p className="mt-2 text-sm">{selectedNotification.details.messageContent}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedNotification.type === "system" && selectedNotification.details && (
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      {selectedNotification.details.systemVersion && (
                        <div>
                          <span className="font-medium">System Version: </span>
                          <span>{selectedNotification.details.systemVersion}</span>
                        </div>
                      )}
                      {selectedNotification.details.maintenanceWindow && (
                        <div>
                          <span className="font-medium">Maintenance Window: </span>
                          <span>{selectedNotification.details.maintenanceWindow}</span>
                        </div>
                      )}
                      {selectedNotification.details.affectedServices && (
                        <div>
                          <span className="font-medium">Affected Services: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedNotification.details.affectedServices.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            {selectedNotification && (
              <>
                <Button
                  variant="outline"
                  onClick={() =>
                    selectedNotification.isRead
                      ? handleMarkAsUnread(selectedNotification.id)
                      : handleMarkAsRead(selectedNotification.id)
                  }
                  className="hover:scale-105 transition-transform duration-200"
                >
                  {selectedNotification.isRead ? "Mark as Unread" : "Mark as Read"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleDelete(selectedNotification.id)
                    setIsDetailModalOpen(false)
                  }}
                  className="hover:scale-105 transition-transform duration-200 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
            <Button
              onClick={() => setIsDetailModalOpen(false)}
              className="hover:scale-105 transition-transform duration-200"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
