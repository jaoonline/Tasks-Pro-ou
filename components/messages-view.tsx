"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Star,
  Archive,
  Trash2,
  Users,
  MessageSquare,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isCurrentUser: boolean
  avatar?: string
  status?: "sent" | "delivered" | "read"
}

interface Conversation {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unread: number
  avatar?: string
  online?: boolean
  type: "direct" | "group"
  participants?: string[]
}

interface CallState {
  isActive: boolean
  type: "audio" | "video"
  duration: number
  isMuted: boolean
  isVideoEnabled: boolean
  participantName: string
  participantAvatar?: string
}

export function MessagesView() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1")
  const [callState, setCallState] = useState<CallState | null>(null)

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Jane Smith",
      lastMessage: "Great! Let's schedule a meeting.",
      timestamp: "2 min ago",
      unread: 2,
      online: true,
      type: "direct",
    },
    {
      id: "2",
      name: "Project Team",
      lastMessage: "John: The new feature is ready for review",
      timestamp: "15 min ago",
      unread: 5,
      type: "group",
      participants: ["John Doe", "Sarah Wilson", "Mike Johnson"],
    },
    {
      id: "3",
      name: "Mike Johnson",
      lastMessage: "Thanks for the update!",
      timestamp: "1 hour ago",
      unread: 0,
      online: false,
      type: "direct",
    },
    {
      id: "4",
      name: "Design Team",
      lastMessage: "New mockups are in Figma",
      timestamp: "2 hours ago",
      unread: 3,
      type: "group",
      participants: ["Jane Smith", "Tom Brown", "Emily Davis"],
    },
    {
      id: "5",
      name: "Sarah Wilson",
      lastMessage: "See you tomorrow!",
      timestamp: "Yesterday",
      unread: 0,
      online: true,
      type: "direct",
    },
  ]

  const messages: { [key: string]: Message[] } = {
    "1": [
      {
        id: "1",
        sender: "Jane Smith",
        content: "Hi! How's the project coming along?",
        timestamp: "10:30 AM",
        isCurrentUser: false,
        status: "read",
      },
      {
        id: "2",
        sender: "You",
        content: "It's going well! We're almost done with the first phase.",
        timestamp: "10:32 AM",
        isCurrentUser: true,
        status: "read",
      },
      {
        id: "3",
        sender: "Jane Smith",
        content: "That's great to hear! Can we schedule a quick meeting to discuss the next steps?",
        timestamp: "10:33 AM",
        isCurrentUser: false,
        status: "read",
      },
      {
        id: "4",
        sender: "You",
        content: "How about tomorrow at 2 PM?",
        timestamp: "10:35 AM",
        isCurrentUser: true,
        status: "delivered",
      },
      {
        id: "5",
        sender: "Jane Smith",
        content: "Great! Let's schedule a meeting.",
        timestamp: "10:36 AM",
        isCurrentUser: false,
        status: "sent",
      },
    ],
    "2": [
      {
        id: "1",
        sender: "John Doe",
        content: "Hey team! I've completed the new feature.",
        timestamp: "9:15 AM",
        isCurrentUser: false,
        status: "read",
      },
      {
        id: "2",
        sender: "Sarah Wilson",
        content: "Awesome! I'll review it this afternoon.",
        timestamp: "9:20 AM",
        isCurrentUser: false,
        status: "read",
      },
      {
        id: "3",
        sender: "You",
        content: "Great work, John! Let me know if you need any help with testing.",
        timestamp: "9:25 AM",
        isCurrentUser: true,
        status: "read",
      },
      {
        id: "4",
        sender: "John Doe",
        content: "The new feature is ready for review",
        timestamp: "9:30 AM",
        isCurrentUser: false,
        status: "sent",
      },
    ],
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const currentConversation = conversations.find((c) => c.id === selectedConversation)
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : []

  // Call timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callState?.isActive) {
      interval = setInterval(() => {
        setCallState((prev) => (prev ? { ...prev, duration: prev.duration + 1 } : null))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [callState?.isActive])

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartCall = (type: "audio" | "video") => {
    if (!currentConversation || currentConversation.type === "group") return

    setCallState({
      isActive: true,
      type,
      duration: 0,
      isMuted: false,
      isVideoEnabled: type === "video",
      participantName: currentConversation.name,
      participantAvatar: currentConversation.avatar,
    })

    toast({
      title: `${type === "audio" ? "Audio" : "Video"} Call Started`,
      description: `Calling ${currentConversation.name}...`,
    })
  }

  const handleEndCall = () => {
    if (callState) {
      toast({
        title: "Call Ended",
        description: `Call duration: ${formatCallDuration(callState.duration)}`,
      })
      setCallState(null)
    }
  }

  const handleToggleMute = () => {
    setCallState((prev) => {
      if (!prev) return null
      const newMuted = !prev.isMuted
      toast({
        title: newMuted ? "Microphone Muted" : "Microphone Unmuted",
        description: newMuted ? "You are now muted" : "You are now unmuted",
      })
      return { ...prev, isMuted: newMuted }
    })
  }

  const handleToggleVideo = () => {
    setCallState((prev) => {
      if (!prev || prev.type === "audio") return prev
      const newVideoEnabled = !prev.isVideoEnabled
      toast({
        title: newVideoEnabled ? "Camera Enabled" : "Camera Disabled",
        description: newVideoEnabled ? "Your camera is now on" : "Your camera is now off",
      })
      return { ...prev, isVideoEnabled: newVideoEnabled }
    })
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    // Here you would typically send the message to your backend
    console.log("Sending message:", messageInput)
    toast({
      title: "Message Sent",
      description: "Your message has been delivered",
    })
    setMessageInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] border rounded-lg overflow-hidden bg-background">
      {/* Call Overlay */}
      {callState?.isActive && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-4xl mx-auto p-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage src={callState.participantAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-4xl">
                    {callState.participantName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-3xl font-bold">{callState.participantName}</h2>
                <p className="text-xl text-muted-foreground">{formatCallDuration(callState.duration)}</p>
              </div>

              {callState.type === "video" && (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {callState.isVideoEnabled ? (
                        <div className="text-muted-foreground">Remote Video</div>
                      ) : (
                        <div className="space-y-2 text-center">
                          <VideoOff className="h-16 w-16 mx-auto text-muted-foreground" />
                          <p className="text-muted-foreground">Camera is off</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {callState.isVideoEnabled && (
                    <div className="absolute bottom-24 right-8 w-48 aspect-video bg-muted rounded-lg border-2 border-primary overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-xs text-muted-foreground">Your Video</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {callState.type === "audio" && (
                <div className="py-12">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                    <Phone className="h-12 w-12 text-primary" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-4 pt-8">
                <Button
                  variant={callState.isMuted ? "destructive" : "outline"}
                  size="lg"
                  className="h-16 w-16 rounded-full"
                  onClick={handleToggleMute}
                >
                  {callState.isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>

                {callState.type === "video" && (
                  <Button
                    variant={callState.isVideoEnabled ? "outline" : "destructive"}
                    size="lg"
                    className="h-16 w-16 rounded-full"
                    onClick={handleToggleVideo}
                  >
                    {callState.isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                  </Button>
                )}

                <Button variant="destructive" size="lg" className="h-20 w-20 rounded-full" onClick={handleEndCall}>
                  <PhoneOff className="h-8 w-8" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full p-3 rounded-lg text-left hover:bg-muted transition-colors ${
                  selectedConversation === conversation.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {conversation.type === "group" ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          conversation.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && conversation.type === "direct" && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate">{conversation.name}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="ml-2 h-5 min-w-5 flex items-center justify-center">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {selectedConversation && currentConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={currentConversation.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {currentConversation.type === "group" ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    currentConversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{currentConversation.name}</p>
                <p className="text-sm text-muted-foreground">
                  {currentConversation.type === "group" ? (
                    <>
                      {currentConversation.participants?.length} members •{" "}
                      {currentConversation.participants?.slice(0, 2).join(", ")}
                      {(currentConversation.participants?.length || 0) > 2 && "..."}
                    </>
                  ) : currentConversation.online ? (
                    "Active now"
                  ) : (
                    "Offline"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentConversation.type === "direct" && (
                <>
                  <Button variant="ghost" size="icon" onClick={() => handleStartCall("audio")}>
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleStartCall("video")}>
                    <Video className="h-5 w-5" />
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
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
                  <Separator className="my-1" />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!message.isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {message.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`flex flex-col ${message.isCurrentUser ? "items-end" : "items-start"} max-w-[70%]`}>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      {message.isCurrentUser && message.status && (
                        <span className="text-xs text-muted-foreground capitalize">{message.status}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>

              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-10"
                />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                  <Smile className="h-5 w-5" />
                </Button>
              </div>

              <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground" />
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}
