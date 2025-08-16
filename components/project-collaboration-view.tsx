"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Send,
  Paperclip,
  Download,
  Eye,
  Trash2,
  Users,
  Calendar,
  Video,
  Plus,
  File,
  ImageIcon,
  FileText,
  Upload,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: string
  type: "text" | "file" | "system"
  fileUrl?: string
  fileName?: string
  fileSize?: number
}

interface SharedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedBy: string
  uploadedAt: string
  downloads: number
}

interface Meeting {
  id: string
  title: string
  description: string
  startTime: string
  duration: number
  attendees: string[]
  status: "scheduled" | "ongoing" | "completed"
  meetingUrl?: string
  recordingUrl?: string
}

interface ProjectCollaborationViewProps {
  projectId: string
  projectName: string
}

export function ProjectCollaborationView({ projectId, projectName }: ProjectCollaborationViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      userId: "1",
      userName: "John Doe",
      content:
        "Hey team! I've completed the initial wireframes for the homepage. Please review and let me know your thoughts.",
      timestamp: "2024-01-24T10:30:00Z",
      type: "text",
    },
    {
      id: "2",
      userId: "2",
      userName: "Jane Smith",
      content: "Great work John! The wireframes look solid. I'll start working on the visual design based on these.",
      timestamp: "2024-01-24T11:15:00Z",
      type: "text",
    },
    {
      id: "3",
      userId: "1",
      userName: "John Doe",
      content: "I've uploaded the updated design files with the latest revisions.",
      timestamp: "2024-01-24T14:20:00Z",
      type: "file",
      fileName: "homepage-wireframes-v2.fig",
      fileSize: 2048000,
      fileUrl: "#",
    },
    {
      id: "4",
      userId: "system",
      userName: "System",
      content: "Mike Johnson joined the project",
      timestamp: "2024-01-24T15:00:00Z",
      type: "system",
    },
    {
      id: "5",
      userId: "3",
      userName: "Mike Johnson",
      content:
        "Thanks for adding me to the project! I'm excited to work with you all. When can we schedule a kickoff meeting?",
      timestamp: "2024-01-24T15:05:00Z",
      type: "text",
    },
  ])

  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([
    {
      id: "1",
      name: "Project Requirements.pdf",
      size: 1024000,
      type: "application/pdf",
      url: "#",
      uploadedBy: "John Doe",
      uploadedAt: "2024-01-20T09:00:00Z",
      downloads: 5,
    },
    {
      id: "2",
      name: "Homepage Wireframes.fig",
      size: 2048000,
      type: "application/figma",
      url: "#",
      uploadedBy: "Jane Smith",
      uploadedAt: "2024-01-22T14:30:00Z",
      downloads: 3,
    },
    {
      id: "3",
      name: "Brand Guidelines.zip",
      size: 5120000,
      type: "application/zip",
      url: "#",
      uploadedBy: "Sarah Wilson",
      uploadedAt: "2024-01-23T11:15:00Z",
      downloads: 8,
    },
  ])

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Project Kickoff Meeting",
      description: "Initial project discussion and team introductions",
      startTime: "2024-01-25T10:00:00Z",
      duration: 60,
      attendees: ["John Doe", "Jane Smith", "Mike Johnson"],
      status: "scheduled",
      meetingUrl: "https://meet.example.com/project-kickoff",
    },
    {
      id: "2",
      title: "Design Review",
      description: "Review wireframes and initial designs",
      startTime: "2024-01-26T14:00:00Z",
      duration: 45,
      attendees: ["John Doe", "Jane Smith"],
      status: "scheduled",
    },
    {
      id: "3",
      title: "Weekly Standup",
      description: "Weekly progress update and planning",
      startTime: "2024-01-22T09:00:00Z",
      duration: 30,
      attendees: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"],
      status: "completed",
      recordingUrl: "https://recordings.example.com/weekly-standup-1",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    startTime: "",
    duration: 60,
    attendees: [] as string[],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      userId: "1", // Current user
      userName: "You",
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Simulate file upload
    const newFile: SharedFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedBy: "You",
      uploadedAt: new Date().toISOString(),
      downloads: 0,
    }

    setSharedFiles([...sharedFiles, newFile])

    // Add file message to chat
    const fileMessage: Message = {
      id: (Date.now() + 1).toString(),
      userId: "1",
      userName: "You",
      content: `Uploaded ${file.name}`,
      timestamp: new Date().toISOString(),
      type: "file",
      fileName: file.name,
      fileSize: file.size,
      fileUrl: newFile.url,
    }

    setMessages([...messages, fileMessage])
    setIsUploadDialogOpen(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.includes("pdf")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-800 border-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const scheduleMeeting = () => {
    if (!newMeeting.title || !newMeeting.startTime) return

    const meeting: Meeting = {
      id: Date.now().toString(),
      ...newMeeting,
      status: "scheduled",
      meetingUrl: `https://meet.example.com/${Date.now()}`,
    }

    setMeetings([...meetings, meeting])
    setNewMeeting({
      title: "",
      description: "",
      startTime: "",
      duration: 60,
      attendees: [],
    })
    setIsMeetingDialogOpen(false)

    // Add system message about the meeting
    const systemMessage: Message = {
      id: (Date.now() + 1).toString(),
      userId: "system",
      userName: "System",
      content: `Meeting "${meeting.title}" scheduled for ${new Date(meeting.startTime).toLocaleString()}`,
      timestamp: new Date().toISOString(),
      type: "system",
    }

    setMessages([...messages, systemMessage])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Project Collaboration
          </h2>
          <p className="text-muted-foreground">{projectName}</p>
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList>
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            Team Chat
          </TabsTrigger>
          <TabsTrigger value="files">
            <Paperclip className="h-4 w-4 mr-2" />
            Shared Files
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <Video className="h-4 w-4 mr-2" />
            Meetings
          </TabsTrigger>
        </TabsList>

        {/* Team Chat */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Team Discussion</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={cn("flex gap-3", message.type === "system" && "justify-center")}>
                      {message.type !== "system" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{getInitials(message.userName)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn("flex-1", message.type === "system" && "text-center")}>
                        {message.type === "system" ? (
                          <div className="text-sm text-muted-foreground bg-muted rounded-full px-3 py-1 inline-block">
                            {message.content}
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{message.userName}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(message.timestamp)}
                              </span>
                            </div>
                            <div className="bg-muted rounded-lg p-3">
                              <p className="text-sm">{message.content}</p>
                              {message.type === "file" && message.fileName && (
                                <div className="flex items-center gap-2 mt-2 p-2 bg-background rounded border">
                                  {getFileIcon(message.fileName)}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{message.fileName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {message.fileSize && formatFileSize(message.fileSize)}
                                    </p>
                                  </div>
                                  <Button size="sm" variant="ghost">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" multiple />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shared Files */}
        <TabsContent value="files" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Shared Files</h3>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Select File</Label>
                    <Input type="file" onChange={handleFileUpload} className="mt-1" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum file size: 10MB. Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR, JPG,
                    PNG, GIF
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sharedFiles.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">{getFileIcon(file.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{file.name}</h4>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded by {file.uploadedBy} • {formatTimestamp(file.uploadedAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">{file.downloads} downloads</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Eye className="h-3 w-3 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Download className="h-3 w-3 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Meetings */}
        <TabsContent value="meetings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Team Meetings</h3>
            <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Meeting</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Meeting Title</Label>
                    <Input
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                      placeholder="Enter meeting title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={newMeeting.description}
                      onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                      placeholder="Meeting description (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="datetime-local"
                        value={newMeeting.startTime}
                        onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={newMeeting.duration}
                        onChange={(e) =>
                          setNewMeeting({ ...newMeeting, duration: Number.parseInt(e.target.value) || 60 })
                        }
                        placeholder="60"
                      />
                    </div>
                  </div>
                  <Button onClick={scheduleMeeting} className="w-full">
                    Schedule Meeting
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {meetings
              .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
              .map((meeting) => (
                <Card key={meeting.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{meeting.title}</h4>
                          <Badge variant="outline" className={getMeetingStatusColor(meeting.status)}>
                            {meeting.status}
                          </Badge>
                        </div>
                        {meeting.description && (
                          <p className="text-sm text-muted-foreground mb-2">{meeting.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(meeting.startTime).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {meeting.duration} minutes
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {meeting.attendees.length} attendees
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          {meeting.attendees.slice(0, 3).map((attendee, index) => (
                            <Avatar key={index} className="h-6 w-6">
                              <AvatarFallback className="text-xs">{getInitials(attendee)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {meeting.attendees.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                              +{meeting.attendees.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {meeting.status === "scheduled" && meeting.meetingUrl && (
                          <Button size="sm" variant="outline">
                            <Video className="h-4 w-4 mr-2" />
                            Join
                          </Button>
                        )}
                        {meeting.status === "completed" && meeting.recordingUrl && (
                          <Button size="sm" variant="outline">
                            <Video className="h-4 w-4 mr-2" />
                            Recording
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
