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
  Github,
  Smartphone,
  QrCode,
  Copy,
  Check,
  Sun,
  Moon,
  Monitor,
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

interface Department {
  id: string
  name: string
  description: string
  manager: string
  memberCount: number
  budget?: number
  color: string
}

interface InvitationStatus {
  type: "success" | "error" | "info"
  message: string
}

export function SettingsView() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("en")
  const [fontSize, setFontSize] = useState("medium")
  const [compactMode, setCompactMode] = useState(false)
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false)
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(false)
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false)
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isInviting, setIsInviting] = useState(false)
  const [invitationStatus, setInvitationStatus] = useState<InvitationStatus | null>(null)
  const [twoFAStep, setTwoFAStep] = useState(1)
  const [qrCodeCopied, setQrCodeCopied] = useState(false)
  const [backupCodesCopied, setBackupCodesCopied] = useState(false)
  const [githubConnected, setGithubConnected] = useState(false)
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    email: "",
    role: "member" as const,
    department: "",
    sendInvitation: true,
    customMessage: "",
  })

  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    manager: "",
    budget: "",
    color: "#3b82f6",
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

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Engineering",
      description: "Software development and technical operations",
      manager: "John Doe",
      memberCount: 12,
      budget: 150000,
      color: "#3b82f6",
    },
    {
      id: "2",
      name: "Design",
      description: "User experience and visual design",
      manager: "Jane Smith",
      memberCount: 8,
      budget: 80000,
      color: "#8b5cf6",
    },
    {
      id: "3",
      name: "Marketing",
      description: "Brand promotion and customer acquisition",
      manager: "Mike Johnson",
      memberCount: 6,
      budget: 120000,
      color: "#10b981",
    },
    {
      id: "4",
      name: "Sales",
      description: "Revenue generation and client relations",
      manager: "Sarah Wilson",
      memberCount: 10,
      budget: 200000,
      color: "#f59e0b",
    },
  ])

  const mockQRCode = "JBSWY3DPEHPK3PXP"
  const mockBackupCodes = [
    "1a2b-3c4d-5e6f",
    "7g8h-9i0j-1k2l",
    "3m4n-5o6p-7q8r",
    "9s0t-1u2v-3w4x",
    "5y6z-7a8b-9c0d",
    "1e2f-3g4h-5i6j",
    "7k8l-9m0n-1o2p",
    "3q4r-5s6t-7u8v",
  ]

  const sendInvitationEmail = async (member: TeamMember, customMessage?: string) => {
    setIsInviting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

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

  const handleAddDepartment = () => {
    if (!newDepartment.name.trim() || !newDepartment.description.trim() || !newDepartment.manager) {
      return
    }

    const department: Department = {
      id: Date.now().toString(),
      name: newDepartment.name,
      description: newDepartment.description,
      manager: newDepartment.manager,
      memberCount: 0,
      budget: newDepartment.budget ? Number.parseInt(newDepartment.budget) : undefined,
      color: newDepartment.color,
    }

    setDepartments([...departments, department])
    setNewDepartment({
      name: "",
      description: "",
      manager: "",
      budget: "",
      color: "#3b82f6",
    })
    setIsDepartmentDialogOpen(false)
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

  const copyToClipboard = async (text: string, setCopied: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleConnectGithub = () => {
    // Simulate GitHub OAuth flow
    setGithubConnected(true)
  }

  const handleDisconnectGithub = () => {
    setGithubConnected(false)
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

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
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
                    <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">Enable 2FA</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                          <DialogDescription>
                            Secure your account with two-factor authentication using an authenticator app.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {twoFAStep === 1 && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">Step 1: Install Authenticator App</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Install an authenticator app like Google Authenticator, Authy, or 1Password on your
                                  mobile device.
                                </p>
                                <div className="flex justify-center space-x-4">
                                  <div className="text-center">
                                    <Smartphone className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-xs">Google Authenticator</p>
                                  </div>
                                  <div className="text-center">
                                    <Smartphone className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-xs">Authy</p>
                                  </div>
                                  <div className="text-center">
                                    <Smartphone className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-xs">1Password</p>
                                  </div>
                                </div>
                              </div>
                              <Button onClick={() => setTwoFAStep(2)} className="w-full">
                                Continue
                              </Button>
                            </div>
                          )}

                          {twoFAStep === 2 && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">Step 2: Scan QR Code</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Scan this QR code with your authenticator app, or enter the code manually.
                                </p>
                                <div className="bg-white p-4 rounded-lg border inline-block">
                                  <QrCode className="h-32 w-32" />
                                </div>
                                <div className="mt-4 p-3 bg-muted rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <code className="text-sm font-mono">{mockQRCode}</code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(mockQRCode, setQrCodeCopied)}
                                    >
                                      {qrCodeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" onClick={() => setTwoFAStep(1)} className="flex-1">
                                  Back
                                </Button>
                                <Button onClick={() => setTwoFAStep(3)} className="flex-1">
                                  Continue
                                </Button>
                              </div>
                            </div>
                          )}

                          {twoFAStep === 3 && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">Step 3: Verify Setup</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Enter the 6-digit code from your authenticator app to verify the setup.
                                </p>
                                <Input
                                  placeholder="Enter 6-digit code"
                                  className="text-center text-lg tracking-widest"
                                  maxLength={6}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" onClick={() => setTwoFAStep(2)} className="flex-1">
                                  Back
                                </Button>
                                <Button onClick={() => setTwoFAStep(4)} className="flex-1">
                                  Verify
                                </Button>
                              </div>
                            </div>
                          )}

                          {twoFAStep === 4 && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">2FA Enabled Successfully!</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Save these backup codes in a safe place. You can use them to access your account if
                                  you lose your authenticator device.
                                </p>
                                <div className="bg-muted p-4 rounded-lg">
                                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                                    {mockBackupCodes.map((code, index) => (
                                      <div key={index} className="text-center">
                                        {code}
                                      </div>
                                    ))}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3 w-full bg-transparent"
                                    onClick={() => copyToClipboard(mockBackupCodes.join("\n"), setBackupCodesCopied)}
                                  >
                                    {backupCodesCopied ? (
                                      <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Copied!
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy Backup Codes
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <Button
                                onClick={() => {
                                  setIs2FADialogOpen(false)
                                  setTwoFAStep(1)
                                }}
                                className="w-full"
                              >
                                Done
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
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
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="theme">Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["light", "dark", "system"].map((themeOption) => (
                        <div
                          key={themeOption}
                          className={`relative cursor-pointer rounded-lg border-2 p-4 ${
                            theme === themeOption ? "border-primary" : "border-muted"
                          }`}
                          onClick={() => setTheme(themeOption)}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            {getThemeIcon(themeOption)}
                            <span className="text-sm font-medium capitalize">{themeOption}</span>
                          </div>
                          {theme === themeOption && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                        <SelectItem value="fr">🇫🇷 French</SelectItem>
                        <SelectItem value="de">🇩🇪 German</SelectItem>
                        <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                        <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="extra-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Reduce spacing and padding for a denser layout</p>
                    </div>
                    <Switch id="compact-mode" checked={compactMode} onCheckedChange={setCompactMode} />
                  </div>

                  <div className="space-y-3">
                    <Label>Color Accent</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        "#3b82f6",
                        "#8b5cf6",
                        "#10b981",
                        "#f59e0b",
                        "#ef4444",
                        "#ec4899",
                        "#06b6d4",
                        "#84cc16",
                        "#f97316",
                        "#6366f1",
                        "#14b8a6",
                        "#f43f5e",
                      ].map((color) => (
                        <div
                          key={color}
                          className="w-8 h-8 rounded-full cursor-pointer border-2 border-muted hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => console.log("Color selected:", color)}
                        />
                      ))}
                    </div>
                  </div>

                  <Button>Save Appearance Settings</Button>
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

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                        <Github className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">GitHub</p>
                        <p className="text-sm text-muted-foreground">Code repository and project management</p>
                        {githubConnected && <p className="text-xs text-green-600">Connected as @johndoe</p>}
                      </div>
                    </div>
                    {githubConnected ? (
                      <Button variant="outline" onClick={handleDisconnectGithub}>
                        Disconnect
                      </Button>
                    ) : (
                      <Button onClick={handleConnectGithub}>Connect</Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Figma</p>
                        <p className="text-sm text-muted-foreground">Design collaboration</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="department" className="space-y-6 mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Department Management</CardTitle>
                    <CardDescription>Manage departments and organizational structure.</CardDescription>
                  </div>
                  <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Department
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add New Department</DialogTitle>
                        <DialogDescription>Create a new department in your organization.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="dept-name">Department Name</Label>
                          <Input
                            id="dept-name"
                            value={newDepartment.name}
                            onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                            placeholder="Enter department name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dept-description">Description</Label>
                          <Textarea
                            id="dept-description"
                            value={newDepartment.description}
                            onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                            placeholder="Enter department description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="dept-manager">Department Manager</Label>
                            <Select
                              value={newDepartment.manager}
                              onValueChange={(value) => setNewDepartment({ ...newDepartment, manager: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select manager" />
                              </SelectTrigger>
                              <SelectContent>
                                {teamMembers
                                  .filter((member) => member.role === "manager" || member.role === "admin")
                                  .map((member) => (
                                    <SelectItem key={member.id} value={member.name}>
                                      {member.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="dept-budget">Annual Budget (Optional)</Label>
                            <Input
                              id="dept-budget"
                              type="number"
                              value={newDepartment.budget}
                              onChange={(e) => setNewDepartment({ ...newDepartment, budget: e.target.value })}
                              placeholder="Enter budget"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="dept-color">Department Color</Label>
                          <div className="flex items-center space-x-2 mt-2">
                            <input
                              type="color"
                              value={newDepartment.color}
                              onChange={(e) => setNewDepartment({ ...newDepartment, color: e.target.value })}
                              className="w-8 h-8 rounded border"
                            />
                            <Input
                              value={newDepartment.color}
                              onChange={(e) => setNewDepartment({ ...newDepartment, color: e.target.value })}
                              placeholder="#3b82f6"
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setIsDepartmentDialogOpen(false)} className="flex-1">
                            Cancel
                          </Button>
                          <Button onClick={handleAddDepartment} className="flex-1">
                            Add Department
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departments.map((department) => (
                      <Card key={department.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: department.color }}></div>
                            <h3 className="font-semibold">{department.name}</h3>
                          </div>
                          <Badge variant="secondary">{department.memberCount} members</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{department.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {department.manager
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{department.manager} - Manager</span>
                          </div>
                          {department.budget && (
                            <div className="text-sm text-muted-foreground">
                              Budget: ${department.budget.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline">Manage Structure</Button>
                    <Button variant="outline">Export Data</Button>
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
                                {departments.map((dept) => (
                                  <SelectItem key={dept.id} value={dept.name}>
                                    {dept.name}
                                  </SelectItem>
                                ))}
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
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.name}>
                                  {dept.name}
                                </SelectItem>
                              ))}
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
