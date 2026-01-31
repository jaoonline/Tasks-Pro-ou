
interface TeamMember {
    id: string
    name: string
    email: string
    role: "admin" | "manager" | "member"
    department: string
    createdAt: string
    status: "active" | "inactive"
    avatar?: string
    phone?: string
    location?: string
    tasksCompleted: number
    tasksInProgress: number
  }
  export type { TeamMember }

  type TeamMembersTableProps = {
    members: TeamMember[]
    isAdmin: boolean
    isActive?: boolean
    onRemoveMember: (id: string) => void
    onUpdateRole: (id: string, role: TeamMember["role"]) => void
  }
  export type { TeamMembersTableProps }