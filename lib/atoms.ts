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

// Task Interface
export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed"
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
  status: "active" | "completed" | "on-hold"
  progress: number
  dueDate: string
  teamMembers: string[]
  createdAt: string
}

// Team Member Interface
export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  status: "active" | "inactive"
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
  },
])

export const teamMembersAtom = atomWithStorage<TeamMember[]>("teamMembers", [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Developer",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Designer",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Project Manager",
    status: "active",
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
    completed: tasks.filter((task) => task.status === "completed"),
  }
})
