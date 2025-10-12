import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

// User and Authentication
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

export const userAtom = atomWithStorage<User | null>("user", null)
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null)
export const authLoadingAtom = atom(false)

// Theme
export const themeAtom = atomWithStorage<"light" | "dark" | "system">("theme", "system")

// Dashboard State
export const currentViewAtom = atomWithStorage<string>("currentView", "overview")
export const selectedProjectAtom = atomWithStorage<string | null>("selectedProject", null)
export const sidebarCollapsedAtom = atomWithStorage<boolean>("sidebarCollapsed", false)

// SubTask Interface
export interface SubTask {
  id: string
  title: string
  completed: boolean
}

// Task Interface
export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "test-under-review" | "done"
  priority: "low" | "medium" | "high"
  assignee: string
  dueDate: string
  projectId: string
  projectName: string
  createdAt: string
  updatedAt?: string
  tags?: string[]
  comments?: Comment[]
  attachments?: Attachment[]
  progress?: number
  timeSpent?: string
  estimatedTime?: string
  subTasks?: SubTask[]
}

// Comment Interface
export interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
  avatar?: string
}

// Attachment Interface
export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedAt: string
}

// Project Interface
export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "on-hold" | "planning"
  progress: number
  dueDate: string
  teamMembers: string[]
  createdAt: string
  priority?: "low" | "medium" | "high"
  tasksTotal?: number
  tasksCompleted?: number
  startDate?: string
  endDate?: string
  budget?: string
  spent?: string
  tasks?: number
}

// Team Member Interface
export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  status: "active" | "inactive" | "away" | "busy" | "offline"
  department?: string
  joinDate?: string
}

// Notification Interface
export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  actionUrl?: string
}

// Data Atoms
export const tasksAtom = atomWithStorage<Task[]>("tasks", [
  {
    id: "1",
    title: "Design Homepage Layout",
    description: "Create wireframes and mockups for the new homepage design",
    status: "in-progress",
    priority: "high",
    assignee: "Jane Smith",
    dueDate: "2024-01-15",
    projectId: "1",
    projectName: "Website Redesign",
    createdAt: "2024-01-01",
    tags: ["design", "ui"],
    progress: 75,
    timeSpent: "8h",
    estimatedTime: "12h",
    comments: [
      {
        id: "1",
        author: "John Doe",
        content: "Great progress on this task! The implementation looks solid.",
        createdAt: "2024-01-24T10:00:00Z",
        avatar: "JD",
      },
    ],
    attachments: [],
    subTasks: [
      { id: "1-1", title: "Create wireframes", completed: true },
      { id: "1-2", title: "Design mockups", completed: true },
      { id: "1-3", title: "Get stakeholder approval", completed: false },
    ],
  },
  {
    id: "2",
    title: "Implement User Authentication",
    description: "Set up login and registration functionality",
    status: "todo",
    priority: "high",
    assignee: "John Doe",
    dueDate: "2024-01-20",
    projectId: "2",
    projectName: "Mobile App Development",
    createdAt: "2024-01-02",
    tags: ["backend", "auth"],
    progress: 0,
    timeSpent: "0h",
    estimatedTime: "16h",
    comments: [],
    attachments: [],
    subTasks: [
      { id: "2-1", title: "Set up authentication backend", completed: false },
      { id: "2-2", title: "Create login UI", completed: false },
      { id: "2-3", title: "Create registration UI", completed: false },
      { id: "2-4", title: "Add password reset", completed: false },
    ],
  },
  {
    id: "3",
    title: "Write project documentation",
    description: "Create comprehensive documentation for the project",
    status: "done",
    priority: "medium",
    dueDate: "2024-01-30",
    assignee: "Mike Johnson",
    projectId: "2",
    projectName: "Mobile App Development",
    createdAt: "2024-01-03",
    tags: ["documentation"],
    progress: 100,
    timeSpent: "12h",
    estimatedTime: "10h",
    comments: [],
    attachments: [],
    subTasks: [
      { id: "3-1", title: "Write API docs", completed: true },
      { id: "3-2", title: "Create user guide", completed: true },
      { id: "3-3", title: "Add code examples", completed: true },
    ],
  },
  {
    id: "4",
    title: "Database Schema Design",
    description: "Design and implement the database structure",
    status: "in-progress",
    priority: "high",
    assignee: "Sarah Wilson",
    dueDate: "2024-01-25",
    projectId: "4",
    projectName: "API Integration",
    createdAt: "2024-01-04",
    tags: ["backend", "database"],
    progress: 45,
    timeSpent: "10h",
    estimatedTime: "20h",
    comments: [],
    attachments: [],
    subTasks: [],
  },
  {
    id: "5",
    title: "Security Vulnerability Assessment",
    description: "Conduct comprehensive security audit",
    status: "test-under-review",
    priority: "high",
    assignee: "Alex Chen",
    dueDate: "2024-02-01",
    projectId: "5",
    projectName: "Security Audit",
    createdAt: "2024-01-05",
    tags: ["security", "testing"],
    progress: 80,
    timeSpent: "15h",
    estimatedTime: "18h",
    comments: [],
    attachments: [],
    subTasks: [
      { id: "5-1", title: "Run security scans", completed: true },
      { id: "5-2", title: "Review findings", completed: false },
    ],
  },
])

export const projectsAtom = atomWithStorage<Project[]>("projects", [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete redesign of the company website",
    status: "active",
    progress: 65,
    dueDate: "2024-02-15",
    teamMembers: ["Jane Smith", "John Doe"],
    createdAt: "2024-01-01",
    priority: "high",
    tasksTotal: 12,
    tasksCompleted: 8,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    budget: "$50,000",
    spent: "$32,500",
    tasks: 12,
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Develop a mobile app for iOS and Android",
    status: "active",
    progress: 30,
    dueDate: "2024-03-01",
    teamMembers: ["John Doe", "Mike Johnson"],
    createdAt: "2024-01-02",
    priority: "medium",
    tasksTotal: 25,
    tasksCompleted: 5,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    budget: "$120,000",
    spent: "$48,000",
    tasks: 25,
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q1 marketing campaign for product launch",
    status: "completed",
    progress: 100,
    dueDate: "2024-01-31",
    teamMembers: ["Sarah Wilson", "Tom Brown"],
    createdAt: "2023-12-01",
    priority: "high",
    tasksTotal: 15,
    tasksCompleted: 15,
    startDate: "2023-12-01",
    endDate: "2024-01-31",
    budget: "$30,000",
    spent: "$28,500",
    tasks: 15,
  },
  {
    id: "4",
    name: "API Integration",
    description: "Third-party service integrations",
    status: "active",
    progress: 55,
    dueDate: "2024-04-15",
    teamMembers: ["Sarah Wilson", "Alex Chen"],
    createdAt: "2024-01-10",
    priority: "medium",
    tasksTotal: 18,
    tasksCompleted: 10,
    startDate: "2024-01-10",
    endDate: "2024-04-15",
    budget: "$40,000",
    spent: "$22,000",
    tasks: 18,
  },
  {
    id: "5",
    name: "Security Audit",
    description: "Comprehensive security assessment",
    status: "active",
    progress: 75,
    dueDate: "2024-02-28",
    teamMembers: ["Alex Chen", "John Doe"],
    createdAt: "2024-01-20",
    priority: "high",
    tasksTotal: 8,
    tasksCompleted: 6,
    startDate: "2024-01-20",
    endDate: "2024-02-28",
    budget: "$25,000",
    spent: "$18,750",
    tasks: 8,
  },
])

export const teamMembersAtom = atomWithStorage<TeamMember[]>("teamMembers", [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Developer",
    status: "active",
    department: "Engineering",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Designer",
    status: "active",
    department: "Design",
    joinDate: "2023-02-01",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Project Manager",
    status: "active",
    department: "Product",
    joinDate: "2023-03-10",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "Marketing Manager",
    status: "away",
    department: "Marketing",
    joinDate: "2023-04-05",
  },
  {
    id: "5",
    name: "Tom Brown",
    email: "tom.brown@company.com",
    role: "Product Manager",
    status: "busy",
    department: "Product",
    joinDate: "2023-05-20",
  },
  {
    id: "6",
    name: "Alex Chen",
    email: "alex.chen@company.com",
    role: "Security Engineer",
    status: "active",
    department: "Security",
    joinDate: "2023-06-10",
  },
])

export const notificationsAtom = atomWithStorage<Notification[]>("notifications", [
  {
    id: "1",
    title: "Task Assigned",
    message: "You have been assigned a new task: Design Homepage Layout",
    type: "info",
    read: false,
    createdAt: "2024-01-24T10:00:00Z",
  },
  {
    id: "2",
    title: "Project Update",
    message: "Website Redesign project is 65% complete",
    type: "success",
    read: false,
    createdAt: "2024-01-24T09:00:00Z",
  },
])

// UI State
export const searchQueryAtom = atom("")
export const selectedDateAtom = atom<Date>(new Date())
export const calendarViewAtom = atom<"month" | "week">("month")

// Computed Atoms
export const unreadNotificationsAtom = atom((get) => {
  const notifications = get(notificationsAtom)
  return notifications.filter((n) => !n.read).length
})

export const tasksByProjectAtom = atom((get) => {
  const tasks = get(tasksAtom)
  const selectedProject = get(selectedProjectAtom)

  if (!selectedProject) return tasks
  return tasks.filter((task) => task.projectId === selectedProject)
})

export const tasksByStatusAtom = atom((get) => {
  const tasks = get(tasksAtom)
  return {
    todo: tasks.filter((task) => task.status === "todo"),
    "in-progress": tasks.filter((task) => task.status === "in-progress"),
    "test-under-review": tasks.filter((task) => task.status === "test-under-review"),
    done: tasks.filter((task) => task.status === "done"),
  }
})
