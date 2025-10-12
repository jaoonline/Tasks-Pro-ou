"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Send,
  Paperclip,
  MoreHorizontal,
  Phone,
  Video,
  Star,
  Archive,
  Trash2,
  Plus,
  Hash,
  Users,
  Edit,
  Settings,
  UserPlus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isRead: boolean
  avatar?: string
}

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  isOnline: boolean
}

interface GroupChannel {
  id: string
  name: string
  description: string
  members: TeamMember[]
  createdBy: string
  createdAt: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isPrivate: boolean
}

interface DirectConversation {
  id: string
  participant: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
  avatar?: string
}

export function MessagesView() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1")
  const [conversationType, setConversationType] = useState<"direct" | "group">("direct")
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false)
  const [isEditChannelOpen, setIsEditChannelOpen] = useState(false)
  const [editingChannel, setEditingChannel] = useState<GroupChannel | null>(null)

  // Call management state
  const [isCallActive, setIsCallActive] = useState(false)
  const [callType, setCallType] = useState<"audio" | "video" | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [callDuration, setCallDuration] = useState(0)

  // Team members data
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@company.com",
      isOnline: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      isOnline: true,
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      isOnline: false,
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      isOnline: true,
    },
    {
      id: "5",
      name: "Alex Chen",
      email: "alex.chen@company.com",
      isOnline: false,
    },
  ]

  const [directConversations, setDirectConversations] = useState<DirectConversation[]>([
    {
      id: "1",
      participant: "John Doe",
      lastMessage: "The wireframes look great! When can we schedule a review?",
      timestamp: "2024-01-12T10:30:00Z",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: "2",
      participant: "Jane Smith",
      lastMessage: "I've updated the project timeline. Please check when you have a moment.",
      timestamp: "2024-01-12T09:15:00Z",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: "3",
      participant: "Mike Johnson",
      lastMessage: "Thanks for the feedback on the design. I'll make those changes.",
      timestamp: "2024-01-11T16:45:00Z",
      unreadCount: 1,
      isOnline: false,
    },
  ])

  const [groupChannels, setGroupChannels] = useState<GroupChannel[]>([
    {
      id: "g1",
      name: "Engineering Team",
      description: "Discussion for engineering projects and updates",
      members: [teamMembers[0], teamMembers[1], teamMembers[3]],
      createdBy: "Current User",
      createdAt: "2024-01-10T09:00:00Z",
      lastMessage: "Let's discuss the new API architecture",
      timestamp: "2024-01-12T11:00:00Z",
      unreadCount: 3,
      isPrivate: false,
    },
    {
      id: "g2",
      name: "Design Review",
      description: "Weekly design reviews and feedback",
      members: [teamMembers[1], teamMembers[2], teamMembers[4]],
      createdBy: "Jane Smith",
      createdAt: "2024-01-08T14:00:00Z",
      lastMessage: "New mockups are ready for review",
      timestamp: "2024-01-12T09:30:00Z",
      unreadCount: 1,
      isPrivate: true,
    },
    {
      id: "g3",
      name: "Project Alpha",
      description: "Coordination for Project Alpha development",
      members: [teamMembers[0], teamMembers[2], teamMembers[3], teamMembers[4]],
      createdBy: "Current User",
      createdAt: "2024-01-05T10:00:00Z",
      lastMessage: "Sprint planning meeting tomorrow at 10 AM",
      timestamp: "2024-01-11T17:00:00Z",
      unreadCount: 0,
      isPrivate: false,
    },
  ])

  const [newChannel, setNewChannel] = useState({
    name: "",
    description: "",
    isPrivate: false,
    selectedMembers: [] as string[],
  })

  const messages: Record<string, Message[]> = {
    "1": [
      {
        id: "1",
        sender: "John Doe",
        content: "Hey! I've been reviewing the latest wireframes you sent over.",
        timestamp: "2024-01-12T09:00:00Z",
        isRead: true,
      },
      {
        id: "2",
        sender: "Current User",
        content: "Great! What do you think? Any feedback?",
        timestamp: "2024-01-12T09:05:00Z",
        isRead: true,
      },
      {
        id: "3",
        sender: "John Doe",
        content:
          "Overall they look fantastic. I love the new navigation structure. Just a few minor suggestions on the color scheme.",
        timestamp: "2024-01-12T09:10:00Z",
        isRead: true,
      },
      {
        id: "4",
        sender: "John Doe",
        content: "The wireframes look great! When can we schedule a review?",
        timestamp: "2024-01-12T10:30:00Z",
        isRead: false,
      },
    ],
    g1: [
      {
        id: "1",
        sender: "John Doe",
        content: "Let's discuss the new API architecture for the upcoming sprint.",
        timestamp: "2024-01-12T10:00:00Z",
        isRead: true,
      },
      {
        id: "2",
        sender: "Jane Smith",
        content: "I've prepared some initial designs. Should we schedule a meeting?",
        timestamp: "2024-01-12T10:15:00Z",
        isRead: true,
      },
      {
        id: "3",
        sender: "Sarah Wilson",
        content: "Great idea! I'm available tomorrow afternoon.",
        timestamp: "2024-01-12T11:00:00Z",
        isRead: false,
      },
    ],
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log("Sending message:", newMessage)
      setNewMessage("")
      toast.success("Message sent successfully!")
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    }
  }

  const handleCreateChannel = async () => {
    if (!newChannel.name.trim()) {
      toast.error("Channel name is required")
      return
    }

    if (newChannel.selectedMembers.length === 0) {
      toast.error("Please select at least one member")
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const channel: GroupChannel = {
        id: `g${Date.now()}`,
        name: newChannel.name,
        description: newChannel.description,
        members: teamMembers.filter((member) => newChannel.selectedMembers.includes(member.id)),
        createdBy: "Current User",
        createdAt: new Date().toISOString(),
        lastMessage: "Channel created",
        timestamp: new Date().toISOString(),
        unreadCount: 0,
        isPrivate: newChannel.isPrivate,
      }

      setGroupChannels([channel, ...groupChannels])
      setNewChannel({
        name: "",
        description: "",
        isPrivate: false,
        selectedMembers: [],
      })
      setIsCreateChannelOpen(false)
      toast.success("Channel created successfully!")
    } catch (error) {
      toast.error("Failed to create channel. Please try again.")
    }
  }

  const handleEditChannel = async () => {
    if (!editingChannel || !newChannel.name.trim()) {
      toast.error("Channel name is required")
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setGroupChannels(
        groupChannels.map((channel) =>
          channel.id === editingChannel.id
            ? {
                ...channel,
                name: newChannel.name,
                description: newChannel.description,
                isPrivate: newChannel.isPrivate,
                members: teamMembers.filter((member) => newChannel.selectedMembers.includes(member.id)),
              }
            : channel,
        ),
      )

      setIsEditChannelOpen(false)
      setEditingChannel(null)
      setNewChannel({
        name: "",
        description: "",
        isPrivate: false,
        selectedMembers: [],
      })
      toast.success("Channel updated successfully!")
    } catch (error) {
      toast.error("Failed to update channel. Please try again.")
    }
  }

  const handleDeleteChannel = async (channelId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const channel = groupChannels.find((c) => c.id === channelId)
      setGroupChannels(groupChannels.filter((channel) => channel.id !== channelId))
      if (selectedConversation === channelId) {
        setSelectedConversation(null)
      }
      toast.success(`Channel "${channel?.name}" deleted successfully`)
    } catch (error) {
      toast.error("Failed to delete channel. Please try again.")
    }
  }

  const openEditChannel = (channel: GroupChannel) => {
    setEditingChannel(channel)
    setNewChannel({
      name: channel.name,
      description: channel.description,
      isPrivate: channel.isPrivate,
      selectedMembers: channel.members.map((m) => m.id),
    })
    setIsEditChannelOpen(true)
  }

  const handleStartCall = (type: "audio" | "video") => {
    setCallType(type)
    setIsCallActive(true)
    setCallDuration(0)

    // Start call duration timer
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    // Store interval ID for cleanup
    ;(window as any).callInterval = interval

    toast.success(`${type === "audio" ? "Audio" : "Video"} call started`)
  }

  const handleEndCall = () => {
    if ((window as any).callInterval) {
      clearInterval((window as any).callInterval)
    }
    setIsCallActive(false)
    setCallType(null)
    setIsMuted(false)
    setIsVideoEnabled(true)
    setCallDuration(0)
    toast.success("Call ended")
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    toast.success(isMuted ? "Microphone enabled" : "Microphone muted")
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    toast.success(isVideoEnabled ? "Camera disabled" : "Camera enabled")
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const filteredDirectConversations = directConversations.filter((conv) =>
    conv.participant.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredGroupChannels = groupChannels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConv =
    conversationType === "direct" ? directConversations.find((c) => c.id === selectedConversation) : null

  const selectedChannel = conversationType === "group" ? groupChannels.find((c) => c.id === selectedConversation) : null

  const conversationMessages = selectedConversation ? messages[selectedConversation] || [] : []

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background rounded-lg border overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Dialog open={isCreateChannelOpen} onOpenChange={setIsCreateChannelOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Channel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] scrollbar-hide overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Group Channel</DialogTitle>
                  <DialogDescription>Create a new group channel for team collaboration.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 scrollbar-hide">
                  <div>
                    <Label htmlFor="channel-name">Channel Name</Label>
                    <Input
                      id="channel-name"
                      placeholder="e.g., Engineering Team"
                      value={newChannel.name}
                      onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="channel-description">Description</Label>
                    <Textarea
                      id="channel-description"
                      placeholder="What's this channel about?"
                      value={newChannel.description}
                      onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                      rows={3}
                      className="scrollbar-hide"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="private-channel"
                      checked={newChannel.isPrivate}
                      onCheckedChange={(checked) => setNewChannel({ ...newChannel, isPrivate: checked as boolean })}
                    />
                    <Label htmlFor="private-channel">Make this channel private</Label>
                  </div>
                  <div>
                    <Label>Add Members</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`member-${member.id}`}
                            checked={newChannel.selectedMembers.includes(member.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewChannel({
                                  ...newChannel,
                                  selectedMembers: [...newChannel.selectedMembers, member.id],
                                })
                              } else {
                                setNewChannel({
                                  ...newChannel,
                                  selectedMembers: newChannel.selectedMembers.filter((id) => id !== member.id),
                                })
                              }
                            }}
                          />
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <Label htmlFor={`member-${member.id}`} className="text-sm">
                            {member.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleCreateChannel} className="w-full">
                    Create Channel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs for Direct Messages and Channels */}
        <Tabs
          value={conversationType}
          onValueChange={(value) => setConversationType(value as "direct" | "group")}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 mt-2">
            <TabsTrigger value="direct" className="text-xs">
              Direct
            </TabsTrigger>
            <TabsTrigger value="group" className="text-xs">
              Channels
            </TabsTrigger>
          </TabsList>

          <TabsContent value="direct" className="flex-1 overflow-y-auto mt-2 scrollbar-hide">
            {filteredDirectConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation.id)
                  setConversationType("direct")
                }}
                className={`p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors ${
                  selectedConversation === conversation.id && conversationType === "direct" ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {conversation.participant
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{conversation.participant}</h3>
                      <span className="text-xs text-muted-foreground">{formatTime(conversation.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="group" className="flex-1 overflow-y-auto mt-2 scrollbar-hide">
            {filteredGroupChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => {
                  setSelectedConversation(channel.id)
                  setConversationType("group")
                }}
                className={`p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors ${
                  selectedConversation === channel.id && conversationType === "group" ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">{channel.name}</h3>
                        {channel.isPrivate && (
                          <Badge variant="secondary" className="text-xs">
                            Private
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{formatTime(channel.timestamp)}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Channel Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditChannel(channel)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Channel
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Add Members
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteChannel(channel.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Channel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-1">{channel.lastMessage}</p>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{channel.members.length} members</span>
                    </div>
                  </div>
                  {channel.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {channel.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv || selectedChannel ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                {conversationType === "direct" && selectedConv ? (
                  <>
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {selectedConv.participant
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConv.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedConv.participant}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedConv.isOnline ? "Online" : "Last seen 2 hours ago"}
                      </p>
                    </div>
                  </>
                ) : selectedChannel ? (
                  <>
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{selectedChannel.name}</h3>
                        {selectedChannel.isPrivate && (
                          <Badge variant="secondary" className="text-xs">
                            Private
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {selectedChannel.members.length} members • {selectedChannel.description}
                      </p>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                {conversationType === "direct" && !isCallActive && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartCall("audio")}
                      title="Start audio call"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartCall("video")}
                      title="Start video call"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {isCallActive && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                    <div className="flex items-center gap-2">
                      {callType === "video" && <Video className="h-4 w-4 text-primary" />}
                      {callType === "audio" && <Phone className="h-4 w-4 text-primary" />}
                      <span className="text-sm font-medium">{formatCallDuration(callDuration)}</span>
                    </div>
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Star className="mr-2 h-4 w-4" />
                      Star Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                    {conversationType === "group" && selectedChannel && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEditChannel(selectedChannel)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Channel Settings
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {conversationMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "Current User" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-start gap-2 max-w-xs lg:max-w-md">
                    {message.sender !== "Current User" && (
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {message.sender
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.sender === "Current User" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.sender !== "Current User" && conversationType === "group" && (
                        <p className="text-xs font-medium mb-1">{message.sender}</p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "Current User" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder={`Message ${conversationType === "direct" ? selectedConv?.participant : `#${selectedChannel?.name}`}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Active Call Interface */}
      {isCallActive && (
        <div className="absolute inset-0 z-50 bg-background flex items-center justify-center">
          <div className="w-full h-full flex flex-col">
            {/* Call Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                {conversationType === "direct" && selectedConv && (
                  <>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {selectedConv.participant
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedConv.participant}</h3>
                      <p className="text-xs text-muted-foreground">
                        {callType === "audio" ? "Audio Call" : "Video Call"} • {formatCallDuration(callDuration)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Video/Audio Display Area */}
            <div className="flex-1 relative bg-muted/20">
              {callType === "video" ? (
                <div className="w-full h-full flex items-center justify-center">
                  {/* Remote Video (Simulated) */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    {isVideoEnabled ? (
                      <div className="text-center text-white">
                        <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-white">
                          <AvatarFallback className="text-4xl">
                            {selectedConv?.participant
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-lg font-medium">Video Call Active</p>
                        <p className="text-sm opacity-90">Camera is {isVideoEnabled ? "on" : "off"}</p>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <div className="h-32 w-32 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                          <Video className="h-16 w-16" />
                        </div>
                        <p className="text-lg font-medium">Camera Off</p>
                      </div>
                    )}
                  </div>
                  {/* Local Video Preview (Simulated) */}
                  {isVideoEnabled && (
                    <div className="absolute bottom-4 right-4 w-48 h-36 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg border-2 border-white flex items-center justify-center">
                      <div className="text-white text-center">
                        <Avatar className="h-16 w-16 mx-auto mb-2 border-2 border-white">
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                        <p className="text-xs">Your Camera</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600">
                  <div className="text-center text-white">
                    <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-white">
                      <AvatarFallback className="text-4xl">
                        {selectedConv?.participant
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-lg font-medium">{selectedConv?.participant}</p>
                    <p className="text-sm opacity-90">Audio Call • {formatCallDuration(callDuration)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Call Controls */}
            <div className="p-6 border-t bg-background">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="lg"
                  onClick={toggleMute}
                  className="rounded-full h-14 w-14"
                >
                  {isMuted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="2" y1="2" x2="22" y2="22" />
                      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
                      <path d="M5 10v2a7 7 0 0 0 12 5" />
                      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                      <line x1="8" y1="22" x2="16" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                      <line x1="8" y1="22" x2="16" y2="22" />
                    </svg>
                  )}
                </Button>

                {callType === "video" && (
                  <Button
                    variant={isVideoEnabled ? "secondary" : "destructive"}
                    size="lg"
                    onClick={toggleVideo}
                    className="rounded-full h-14 w-14"
                  >
                    {isVideoEnabled ? (
                      <Video className="h-6 w-6" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m22 8-6 4 6 4V8Z" />
                        <path d="M16 8h-6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h6" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                    )}
                  </Button>
                )}

                <Button variant="destructive" size="lg" onClick={handleEndCall} className="rounded-full h-16 w-16">
                  <Phone className="h-6 w-6 rotate-[135deg]" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Channel Dialog */}
      <Dialog open={isEditChannelOpen} onOpenChange={setIsEditChannelOpen}>
        <DialogContent className="max-w-md max-h-[80vh] scrollbar-hide overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Channel</DialogTitle>
            <DialogDescription>Update channel settings and members.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 scrollbar-hide">
            <div>
              <Label htmlFor="edit-channel-name">Channel Name</Label>
              <Input
                id="edit-channel-name"
                placeholder="e.g., Engineering Team"
                value={newChannel.name}
                onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-channel-description">Description</Label>
              <Textarea
                id="edit-channel-description"
                placeholder="What's this channel about?"
                value={newChannel.description}
                onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                rows={3}
                className="scrollbar-hide"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-private-channel"
                checked={newChannel.isPrivate}
                onCheckedChange={(checked) => setNewChannel({ ...newChannel, isPrivate: checked as boolean })}
              />
              <Label htmlFor="edit-private-channel">Make this channel private</Label>
            </div>
            <div>
              <Label>Channel Members</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-member-${member.id}`}
                      checked={newChannel.selectedMembers.includes(member.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewChannel({
                            ...newChannel,
                            selectedMembers: [...newChannel.selectedMembers, member.id],
                          })
                        } else {
                          setNewChannel({
                            ...newChannel,
                            selectedMembers: newChannel.selectedMembers.filter((id) => id !== member.id),
                          })
                        }
                      }}
                    />
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Label htmlFor={`edit-member-${member.id}`} className="text-sm">
                      {member.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEditChannel} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditChannelOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
