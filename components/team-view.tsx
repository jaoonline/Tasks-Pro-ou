"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Users, Mail, Calendar, Edit, Trash2, Crown, Shield, User, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "member"
  department: string
  joinDate: string
  status: "active" | "inactive"
  avatar?: string
  phone?: string
  location?: string
  tasksCompleted: number
  tasksInProgress: number
}

interface TeamViewProps {
  isAdmin: boolean
}

export function TeamView({ isAdmin }: TeamViewProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "member" as const,
    department: "",
  })

  useEffect(() => {
    // Load demo team members
    const demoMembers: TeamMember[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@company.com",
        role: "admin",
        department: "Engineering",
        joinDate: "2023-01-15",
        status: "active",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        tasksCompleted: 45,
        tasksInProgress: 3,
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@company.com",
        role: "manager",
        department: "Design",
        joinDate: "2023-03-20",
        status: "active",
        phone: "+1 (555) 234-5678",
        location: "New York, NY",
        tasksCompleted: 32,
        tasksInProgress: 5,
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        role: "member",
        department: "Marketing",
        joinDate: "2023-06-10",
        status: "active",
        phone: "+1 (555) 345-6789",
        location: "Austin, TX",
        tasksCompleted: 28,
        tasksInProgress: 2,
      },
      {
        id: "4",
        name: "Sarah Wilson",
        email: "sarah.wilson@company.com",
        role: "member",
        department: "Engineering",
        joinDate: "2023-08-05",
        status: "active",
        phone: "+1 (555) 456-7890",
        location: "Seattle, WA",
        tasksCompleted: 19,
        tasksInProgress: 4,
      },
      {
        id: "5",
        name: "Alex Chen",
        email: "alex.chen@company.com",
        role: "member",
        department: "Sales",
        joinDate: "2023-09-12",
        status: "inactive",
        phone: "+1 (555) 567-8901",
        location: "Los Angeles, CA",
        tasksCompleted: 15,
        tasksInProgress: 1,
      },
    ]
    setTeamMembers(demoMembers)
  }, [])

  const handleInviteMember = async () => {
    if (!newMember.name.trim() || !newMember.email.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newMember.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    // Check if email already exists
    if (teamMembers.some((member) => member.email === newMember.email)) {
      toast.error("A team member with this email already exists")
      return
    }

    if (!newMember.department) {
      toast.error("Please select a department")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const member: TeamMember = {
        id: Date.now().toString(),
        ...newMember,
        joinDate: new Date().toISOString().split("T")[0],
        status: "active",
        tasksCompleted: 0,
        tasksInProgress: 0,
      }

      setTeamMembers([...teamMembers, member])
      setNewMember({
        name: "",
        email: "",
        role: "member",
        department: "",
      })
      setIsInviteDialogOpen(false)
      toast.success(`Invitation sent to ${member.name}!`)
    } catch (error) {
      toast.error("Failed to send invitation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId)
    if (!member) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setTeamMembers(teamMembers.filter((member) => member.id !== memberId))
      toast.success(`${member.name} has been removed from the team`)
    } catch (error) {
      toast.error("Failed to remove team member. Please try again.")
    }
  }

  const handleUpdateMemberRole = async (memberId: string, newRole: TeamMember["role"]) => {
    const member = teamMembers.find((m) => m.id === memberId)
    if (!member) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setTeamMembers(teamMembers.map((member) => (member.id === memberId ? { ...member, role: newRole } : member)))
      toast.success(`${member.name}'s role updated to ${newRole}`)
    } catch (error) {
      toast.error("Failed to update member role. Please try again.")
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "manager":
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "manager":
        return "secondary"
      default:
        return "outline"
    }
  }

  const activeMembers = teamMembers.filter((m) => m.status === "active")
  const inactiveMembers = teamMembers.filter((m) => m.status === "inactive")

  const departmentStats = teamMembers.reduce(
    (acc, member) => {
      acc[member.department] = (acc[member.department] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeMembers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <div className="h-4 w-4 bg-blue-500 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(departmentStats).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(teamMembers.reduce((acc, m) => acc + m.tasksCompleted, 0) / teamMembers.length || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Management */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Management</h2>
        {isAdmin && (
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>Add a new member to your team.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Enter full name"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="Enter email address"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newMember.role}
                      onValueChange={(value: any) => setNewMember({ ...newMember, role: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Member</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="manager">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Manager</span>
                          </div>
                        </SelectItem>
                        {isAdmin && (
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Crown className="h-4 w-4" />
                              <span>Admin</span>
                            </div>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={newMember.department}
                      onValueChange={(value) => setNewMember({ ...newMember, department: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Customer Support">Customer Support</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleInviteMember} className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending Invitation..." : "Send Invitation"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Members</TabsTrigger>
          <TabsTrigger value="active">Active ({activeMembers.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveMembers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <TeamMemberTable
            members={teamMembers}
            isAdmin={isAdmin}
            onRemoveMember={handleRemoveMember}
            onUpdateRole={handleUpdateMemberRole}
          />
        </TabsContent>

        <TabsContent value="active" className="space-y-4 mt-6">
          <TeamMemberTable
            members={activeMembers}
            isAdmin={isAdmin}
            onRemoveMember={handleRemoveMember}
            onUpdateRole={handleUpdateMemberRole}
          />
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4 mt-6">
          <TeamMemberTable
            members={inactiveMembers}
            isAdmin={isAdmin}
            onRemoveMember={handleRemoveMember}
            onUpdateRole={handleUpdateMemberRole}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TeamMemberTable({
  members,
  isAdmin,
  onRemoveMember,
  onUpdateRole,
}: {
  members: TeamMember[]
  isAdmin: boolean
  onRemoveMember: (id: string) => void
  onUpdateRole: (id: string, role: TeamMember["role"]) => void
}) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "manager":
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "manager":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            {isAdmin && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {member.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getRoleIcon(member.role)}
                  <Badge variant={getRoleBadgeVariant(member.role) as any}>{member.role}</Badge>
                </div>
              </TableCell>
              <TableCell>{member.department}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{member.tasksCompleted} completed</div>
                  <div className="text-muted-foreground">{member.tasksInProgress} in progress</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
              </TableCell>
              <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onUpdateRole(member.id, "admin")}>Make Admin</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateRole(member.id, "manager")}>
                        Make Manager
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateRole(member.id, "member")}>Make Member</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onRemoveMember(member.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
