"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FileText,
  ImageIcon,
  Video,
  Archive,
  Download,
  Share,
  MoreHorizontal,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Trash2,
  Eye,
  Calendar,
  User,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Document {
  id: string
  name: string
  type: "document" | "image" | "video" | "archive"
  size: string
  uploadedBy: string
  uploadedAt: string
  lastModified: string
  isStarred: boolean
  tags: string[]
  project?: string
}

export function DocumentsView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const documents: Document[] = [
    {
      id: "1",
      name: "Project Requirements.pdf",
      type: "document",
      size: "2.4 MB",
      uploadedBy: "John Doe",
      uploadedAt: "2024-01-10T10:30:00Z",
      lastModified: "2024-01-11T14:20:00Z",
      isStarred: true,
      tags: ["requirements", "project"],
      project: "Website Redesign",
    },
    {
      id: "2",
      name: "Wireframes_v2.fig",
      type: "document",
      size: "15.7 MB",
      uploadedBy: "Jane Smith",
      uploadedAt: "2024-01-09T16:45:00Z",
      lastModified: "2024-01-12T09:15:00Z",
      isStarred: false,
      tags: ["design", "wireframes"],
      project: "Website Redesign",
    },
    {
      id: "3",
      name: "Team_Photo_2024.jpg",
      type: "image",
      size: "3.2 MB",
      uploadedBy: "Mike Johnson",
      uploadedAt: "2024-01-08T11:20:00Z",
      lastModified: "2024-01-08T11:20:00Z",
      isStarred: false,
      tags: ["team", "photo"],
    },
    {
      id: "4",
      name: "Demo_Video.mp4",
      type: "video",
      size: "45.8 MB",
      uploadedBy: "Sarah Wilson",
      uploadedAt: "2024-01-07T13:30:00Z",
      lastModified: "2024-01-07T13:30:00Z",
      isStarred: true,
      tags: ["demo", "video"],
      project: "Mobile App",
    },
    {
      id: "5",
      name: "Assets_Package.zip",
      type: "archive",
      size: "128.5 MB",
      uploadedBy: "Alex Chen",
      uploadedAt: "2024-01-06T09:45:00Z",
      lastModified: "2024-01-06T09:45:00Z",
      isStarred: false,
      tags: ["assets", "package"],
      project: "Website Redesign",
    },
    {
      id: "6",
      name: "API_Documentation.pdf",
      type: "document",
      size: "1.8 MB",
      uploadedBy: "John Doe",
      uploadedAt: "2024-01-05T15:20:00Z",
      lastModified: "2024-01-09T10:30:00Z",
      isStarred: false,
      tags: ["api", "documentation"],
      project: "API Integration",
    },
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-8 w-8 text-blue-500" />
      case "image":
        return <ImageIcon className="h-8 w-8 text-green-500" />
      case "video":
        return <Video className="h-8 w-8 text-purple-500" />
      case "archive":
        return <Archive className="h-8 w-8 text-orange-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "starred" && doc.isStarred) ||
      (selectedFilter === "recent" && new Date(doc.uploadedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesFilter
  })

  const stats = {
    total: documents.length,
    documents: documents.filter((d) => d.type === "document").length,
    images: documents.filter((d) => d.type === "image").length,
    videos: documents.filter((d) => d.type === "video").length,
    archives: documents.filter((d) => d.type === "archive").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.documents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.images}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.videos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archives</CardTitle>
            <Archive className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.archives}</div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Documents</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
              <DialogDescription>Drag and drop files here or click to browse.</DialogDescription>
            </DialogHeader>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Drop files here or click to upload</p>
              <Button variant="outline" className="mt-4 bg-transparent">
                Browse Files
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedFilter("all")}>All Files</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("starred")}>Starred</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("recent")}>Recent</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Documents */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <DocumentRow key={doc.id} document={doc} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments
                .filter((d) => d.type === "document")
                .map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments
                .filter((d) => d.type === "document")
                .map((doc) => (
                  <DocumentRow key={doc.id} document={doc} />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments
                .filter((d) => d.type === "image")
                .map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments
                .filter((d) => d.type === "image")
                .map((doc) => (
                  <DocumentRow key={doc.id} document={doc} />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments
                .filter((d) => d.type === "video")
                .map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments
                .filter((d) => d.type === "video")
                .map((doc) => (
                  <DocumentRow key={doc.id} document={doc} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DocumentCard({ document }: { document: Document }) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-8 w-8 text-blue-500" />
      case "image":
        return <ImageIcon className="h-8 w-8 text-green-500" />
      case "video":
        return <Video className="h-8 w-8 text-purple-500" />
      case "archive":
        return <Archive className="h-8 w-8 text-orange-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getFileIcon(document.type)}
            {document.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium truncate mb-2">{document.name}</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{document.size}</span>
            <span>{formatDate(document.uploadedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">
                {document.uploadedBy
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">{document.uploadedBy}</span>
          </div>
          {document.project && (
            <Badge variant="secondary" className="text-xs">
              {document.project}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function DocumentRow({ document }: { document: Document }) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-green-500" />
      case "video":
        return <Video className="h-5 w-5 text-purple-500" />
      case "archive":
        return <Archive className="h-5 w-5 text-orange-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-sm transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getFileIcon(document.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{document.name}</h3>
                {document.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span>{document.size}</span>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{document.uploadedBy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(document.uploadedAt)}</span>
                </div>
                {document.project && (
                  <Badge variant="secondary" className="text-xs">
                    {document.project}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
