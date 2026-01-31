"use client"

import { useMemo, useState } from "react"
import { Table, Badge, Avatar, Button, Flex, Text } from "@radix-ui/themes"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { TeamMember } from "@/types/team"

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 30, 50, 100]

type TeamMembersTableProps = {
  members: TeamMember[]
  isAdmin: boolean
  isActive?: boolean
  onRemoveMember: (id: string) => void
  onUpdateRole: (id: string, role: TeamMember["role"]) => void
}

export default function TeamMembersTable({
  members,
  isAdmin,
  isActive,
  onRemoveMember,
  onUpdateRole,
}: TeamMembersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  /* 🔍 Filter active / inactive */
  const filteredMembers = useMemo(() => {
    return isActive === undefined
      ? members
      : members.filter((m) =>
          isActive ? m.status === "active" : m.status === "inactive"
        )
  }, [members, isActive])

  /* 📄 Pagination math */
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredMembers.slice(start, start + itemsPerPage)
  }, [filteredMembers, currentPage, itemsPerPage])

  return (
    <>
      {/* HEADER ACTIONS */}
      <Flex justify="between" align="center" mb="3">
        {isAdmin && <Button>Add Account</Button>}

        {/* ITEMS PER PAGE DROPDOWN */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="soft">
              Items per page: {itemsPerPage}
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content align="end">
            {ITEMS_PER_PAGE_OPTIONS.map((size) => (
              <DropdownMenu.Item
                key={size}
                onClick={() => {
                  setItemsPerPage(size)
                  setCurrentPage(1)
                }}
              >
                {size}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>

      {/* TABLE */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Member</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Department</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tasks</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
            {isAdmin && (
              <Table.ColumnHeaderCell align="right">
                Actions
              </Table.ColumnHeaderCell>
            )}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {paginatedMembers.map((member) => (
            <Table.Row key={member.id}>
              <Table.Cell>
                <Flex gap="3" align="center">
                  <Avatar fallback={member.name[0]} radius="full" />
                  <div>
                    <div>{member.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>
                      {member.email}
                    </div>
                  </div>
                </Flex>
              </Table.Cell>

              <Table.Cell>
                <Badge variant="soft">{member.role}</Badge>
              </Table.Cell>

              <Table.Cell>{member.department}</Table.Cell>

              <Table.Cell>
                <div>{member.tasksCompleted} completed</div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>
                  {member.tasksInProgress} in progress
                </div>
              </Table.Cell>

              <Table.Cell>
                <Badge
                  color={member.status === "active" ? "gray" : "orange"}
                >
                  {member.status}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                {new Date(member.createdAt).toLocaleDateString()}
              </Table.Cell>

              {isAdmin && (
                <Table.Cell align="right">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button variant="ghost" style={{ padding: 6 }}>
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content align="end">
                      <DropdownMenu.Item>
                        <Edit size={14} /> Edit Profile
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator />

                      <DropdownMenu.Item onClick={() => onUpdateRole(member.id, "admin")}>
                        Make Admin
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => onUpdateRole(member.id, "manager")}>
                        Make Manager
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => onUpdateRole(member.id, "member")}>
                        Make Member
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator />

                      <DropdownMenu.Item
                        onClick={() => onRemoveMember(member.id)}
                        style={{ color: "red" }}
                      >
                        <Trash2 size={14} /> Remove Member
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* PAGINATION CONTROLS */}
      <Flex justify="between" align="center" mt="4">
        <Text size="2">
          Page {currentPage} of {totalPages}
        </Text>

        <Flex gap="2">
          <Button
            variant="soft"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft size={16} />
            Prev
          </Button>

          <Button
            variant="soft"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </Flex>
      </Flex>
    </>
  )
}
