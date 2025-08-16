"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Users,
  Plus,
  Mail,
  Calendar,
  Crown,
  UserCheck,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
} from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "member"
  department: string
  joinDate: string
  status: "active" | "inactive" | "pending"
  avatar?: string
  invitationSent?: boolean
  invitationDate?: string
}

interface InvitationStatus {
  type: "success" | "error" | "info"
  message: string
}

export function SettingsView() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false)
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isInviting, setIsInviting] = useState(false)
  const [invitationStatus, setInvitationStatus] = useState<InvitationStatus | null>(null)
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    email: "",
    role: "member" as const,
    department: "",
    sendInvitation: true,
    customMessage: "",
  })

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@company.com",
      role: "admin",
      department: "Engineering",
      joinDate: "2023-01-15",
      status: "active",
      invitationSent: true,
      invitationDate: "2023-01-10",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      role: "manager",
      department: "Design",
      joinDate: "2023-03-20",
      status: "active",
      invitationSent: true,
      invitationDate: "2023-03-15",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      role: "member",
      department: "Marketing",
      joinDate: "2023-06-10",
      status: "active",
      invitationSent: true,
      invitationDate: "2023-06-05",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      role: "member",
      department: "Sales",
      joinDate: "2023-08-05",
      status: "pending",
      invitationSent: true,
      invitationDate: "2023-08-01",
    },
  ])

  const sendInvitationEmail = async (member: TeamMember, customMessage?: string) => {
    setIsInviting(true)

    // Simulate API call to send invitation email
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real application, this would be an API call
      console.log("Sending invitation email to:", member.email)
      console.log("Role:", member.role)
      console.log("Department:", member.department)
      console.log("Custom message:", customMessage)

      setInvitationStatus({
        type: "success",
        message: `Invitation sent successfully to ${member.email}`,
      })

      return true
    } catch (error) {
      setInvitationStatus({
        type: "error",
        message: "Failed to send invitation. Please try again.",
      })
      return false
    } finally {
      setIsInviting(false)
    }
  }

  const handleAddTeamMember = async () => {
    if (!newTeamMember.name.trim() || !newTeamMember.email.trim() || !newTeamMember.department) {
      setInvitationStatus({
        type: "error",
        message: "Please fill in all required fields.",
      })
      return
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      name: newTeamMember.name,
      email: newTeamMember.email,
      role: newTeamMember.role,
      department: newTeamMember.department,
      joinDate: new Date().toISOString().split("T")[0],
      status: newTeamMember.sendInvitation ? "pending" : "active",
      invitationSent: false,
    }

    // Send invitation if requested
    if (newTeamMember.sendInvitation) {
      const invitationSent = await sendInvitationEmail(member, newTeamMember.customMessage)
      if (invitationSent) {
        member.invitationSent = true
        member.invitationDate = new Date().toISOString().split("T")[0]
      }
    }

    setTeamMembers([...teamMembers, member])
    setNewTeamMember({
      name: "",
      email: "",
      role: "member",
      department: "",
      sendInvitation: true,
      customMessage: "",
    })

    if (!newTeamMember.sendInvitation || invitationStatus?.type === "success") {
      setIsNewTeamDialogOpen(false)
    }
  }

  const handleEditTeamMember = () => {
    if (!editingMember) return

    setTeamMembers(teamMembers.map((member) => (member.id === editingMember.id ? editingMember : member)))
    setIsEditTeamDialogOpen(false)
    setEditingMember(null)
  }

  const handleDeleteTeamMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== memberId))
  }

  const handleResendInvitation = async (member: TeamMember) => {
    const success = await sendInvitationEmail(member)
    if (success) {
      setTeamMembers(
        teamMembers.map((m) =>
          m.id === member.id
            ? { ...m, invitationSent: true, invitationDate: new Date().toISOString().split("T")[0] }
            : m,
        ),
      )
    }
  }

  const openEditDialog = (member: TeamMember) => {
    setEditingMember({ ...member })
    setIsEditTeamDialogOpen(true)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "manager":
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <UserCheck className="h-4 w-4 text-gray-600" />
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64 flex-shrink-0">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 w-full h-auto gap-1 bg-transparent p-0">
              <TabsTrigger
                value="profile"
                className="flex items-center justify-center lg:justify-start gap-2 w-full h-12 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center justify-center lg:justify-start gap-2 w-full h-12 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center justify-center lg:justify-start gap-2 w-full h-12 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="flex items-center justify-center lg:justify-start gap-2 w-full h-12 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger
                value="integrations"
                className="flex items-center justify-center lg:justify-start gap-2 w-full h-12 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Integrations</span>
              </TabsTrigger>
              <TabsTrigger
                value="department"
                className="flex items-center justify-center lg:justify-start gap-2 w-full h-12 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Department</span>
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="flex items-center justify-center lg:justify-start gap-2 w-full h-12 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Team</span>
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1">
            <TabsContent value="profile" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and profile settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline">Change Avatar</Button>
                      <p className="text-sm text-muted-foreground mt-2">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself..." />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified about updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Get weekly summary reports</p>
                    </div>
                    <Switch id="weekly-reports" checked={weeklyReports} onCheckedChange={setWeeklyReports} />
                  </div>
                  <Button>Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and privacy.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Secure your account with 2FA</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Apps</CardTitle>
                  <CardDescription>Manage your third-party integrations and connected services.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Slack</p>
                        <p className="text-sm text-muted-foreground">Team communication</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Google Drive</p>
                        <p className="text-sm text-muted-foreground">File storage and sharing</p>
                      </div>
                    </div>
                    <Button variant="outline">Connected</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="department" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Department Management</CardTitle>
                  <CardDescription>Manage departments and organizational structure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Engineering</h3>
                        <Badge variant="secondary">12 members</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Software development and technical operations
                      </p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">JD</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">John Doe - Manager</span>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Design</h3>
                        <Badge variant="secondary">8 members</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">User experience and visual design</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">JS</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Jane Smith - Manager</span>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Marketing</h3>
                        <Badge variant="secondary">6 members</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Brand promotion and customer acquisition</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">MJ</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Mike Johnson - Lead</span>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Sales</h3>
                        <Badge variant="secondary">10 members</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Revenue generation and client relations</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">SW</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Sarah Wilson - Director</span>
                      </div>
                    </Card>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Department
                    </Button>
                    <Button variant="outline">Manage Structure</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6 mt-0">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>Manage your team members and their roles.</CardDescription>
                  </div>
                  <Dialog open={isNewTeamDialogOpen} onOpenChange={setIsNewTeamDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Team Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] w-[95vw] sm:w-full overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Team Member</DialogTitle>
                        <DialogDescription>Invite a new member to join your team.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {invitationStatus && (
                          <Alert
                            className={
                              invitationStatus.type === "error"
                                ? "border-red-200 bg-red-50"
                                : invitationStatus.type === "success"
                                  ? "border-green-200 bg-green-50"
                                  : "border-blue-200 bg-blue-50"
                            }
                          >
                            {invitationStatus.type === "error" ? (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            ) : invitationStatus.type === "success" ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Mail className="h-4 w-4 text-blue-600" />
                            )}
                            <AlertDescription
                              className={
                                invitationStatus.type === "error"
                                  ? "text-red-800"
                                  : invitationStatus.type === "success"
                                    ? "text-green-800"
                                    : "text-blue-800"
                              }
                            >
                              {invitationStatus.message}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div>
                          <Label htmlFor="member-name">Full Name</Label>
                          <Input
                            id="member-name"
                            value={newTeamMember.name}
                            onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="member-email">Email Address</Label>
                          <Input
                            id="member-email"
                            type="email"
                            value={newTeamMember.email}
                            onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="member-role">Role</Label>
                            <Select
                              value={newTeamMember.role}
                              onValueChange={(value: any) => setNewTeamMember({ ...newTeamMember, role: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="member">
                                  <div className="flex items-center gap-2">
                                    <UserCheck className="h-4 w-4" />
                                    <span>Member</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="manager">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Manager</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="admin">
                                  <div className="flex items-center gap-2">
                                    <Crown className="h-4 w-4" />
                                    <span>Admin</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="member-department">Department</Label>
                            <Select
                              value={newTeamMember.department}
                              onValueChange={(value) => setNewTeamMember({ ...newTeamMember, department: value })}
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
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="send-invitation" className="font-medium">
                                Send Email Invitation
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Send an invitation email to the new team member
                              </p>
                            </div>
                            <Switch
                              id="send-invitation"
                              checked={newTeamMember.sendInvitation}
                              onCheckedChange={(checked) =>
                                setNewTeamMember({ ...newTeamMember, sendInvitation: checked })
                              }
                            />
                          </div>

                          {newTeamMember.sendInvitation && (
                            <div>
                              <Label htmlFor="custom-message">Custom Message (Optional)</Label>
                              <Textarea
                                id="custom-message"
                                value={newTeamMember.customMessage}
                                onChange={(e) => setNewTeamMember({ ...newTeamMember, customMessage: e.target.value })}
                                placeholder="Add a personal message to the invitation email..."
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                          )}
                        </div>

                        <Button onClick={handleAddTeamMember} className="w-full" disabled={isInviting}>
                          {isInviting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              {newTeamMember.sendInvitation ? "Sending Invitation..." : "Adding Member..."}
                            </>
                          ) : (
                            <>
                              {newTeamMember.sendInvitation ? (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  Add Member & Send Invitation
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Team Member
                                </>
                              )}
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className="font-medium">{member.name}</p>
                              <div className="flex items-center gap-1">
                                {getRoleIcon(member.role)}
                                <Badge variant={getRoleBadgeVariant(member.role) as any} className="text-xs">
                                  {member.role}
                                </Badge>
                              </div>
                              <Badge variant={getStatusBadgeVariant(member.status) as any} className="text-xs">
                                {member.status}
                              </Badge>
                              {member.invitationSent && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-50 text-green-700 border-green-200"
                                >
                                  <Mail className="h-3 w-3 mr-1" />
                                  Invited
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {member.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Joined {new Date(member.joinDate).toLocaleDateString()}
                              </div>
                              <div className="text-muted-foreground">{member.department}</div>
                              {member.invitationDate && (
                                <div className="text-xs text-muted-foreground">
                                  Invited {new Date(member.invitationDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {member.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendInvitation(member)}
                              disabled={isInviting}
                              className="hover:bg-blue-50 hover:text-blue-600 flex-1 sm:flex-none"
                            >
                              {isInviting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-1" />
                                  Resend
                                </>
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(member)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTeamMember(member.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Edit Team Member Dialog */}
              <Dialog open={isEditTeamDialogOpen} onOpenChange={setIsEditTeamDialogOpen}>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] w-[95vw] sm:w-full overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Team Member</DialogTitle>
                    <DialogDescription>Update team member information and permissions.</DialogDescription>
                  </DialogHeader>
                  {editingMember && (
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="edit-member-name">Full Name</Label>
                        <Input
                          id="edit-member-name"
                          value={editingMember.name}
                          onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-member-email">Email Address</Label>
                        <Input
                          id="edit-member-email"
                          type="email"
                          value={editingMember.email}
                          onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-member-role">Role</Label>
                          <Select
                            value={editingMember.role}
                            onValueChange={(value: any) => setEditingMember({ ...editingMember, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="h-4 w-4" />
                                  <span>Member</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="manager">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  <span>Manager</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Crown className="h-4 w-4" />
                                  <span>Admin</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="edit-member-department">Department</Label>
                          <Select
                            value={editingMember.department}
                            onValueChange={(value) => setEditingMember({ ...editingMember, department: value })}
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
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="edit-member-status">Status</Label>
                        <Select
                          value={editingMember.status}
                          onValueChange={(value: any) => setEditingMember({ ...editingMember, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsEditTeamDialogOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={handleEditTeamMember} className="flex-1">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
