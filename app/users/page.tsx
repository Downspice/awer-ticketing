"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Card, CardContent } from "../../components/ui/card"
import { Switch } from "../../components/ui/switch"
import { Badge } from "../../components/ui/badge"
import { Skeleton } from "../../components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet"
import { UserForm } from "@/components/user-form"
import type { User } from "../../lib/types"
import { toggleUserStatus } from "../../lib/actions"
import { Pencil, Plus } from "lucide-react"

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined)

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserStatus(userId, !currentStatus)
      setUsers(users.map((user) => (user.id === userId ? { ...user, enabled: !currentStatus } : user)))
    } catch (error) {
      console.error("Error toggling user status:", error)
    }
  }

  const handleSuccess = () => {
    setIsCreateOpen(false)
    setIsEditOpen(false)
    setSelectedUserId(undefined)
    fetchUsers()
    router.refresh()
  }

  const handleEdit = (userId: string) => {
    setSelectedUserId(userId)
    setIsEditOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">User List</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New User
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge key={role} variant="outline" className="capitalize">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch checked={user.enabled} onCheckedChange={() => handleToggleStatus(user.id, user.enabled)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user.id)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create User Sheet */}
      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="sm:max-w-[540px]">
          <SheetHeader className="mb-6">
            <SheetTitle>Create New User</SheetTitle>
            <SheetDescription>
              Enter the user's details to add them to the system.
            </SheetDescription>
          </SheetHeader>
          <UserForm 
            onSuccess={handleSuccess} 
            onCancel={() => setIsCreateOpen(false)} 
          />
        </SheetContent>
      </Sheet>

      {/* Edit User Sheet */}
      <Sheet open={isEditOpen} onOpenChange={(open) => {
        setIsEditOpen(open)
        if (!open) setSelectedUserId(undefined)
      }}>
        <SheetContent className="sm:max-w-[540px]">
          <SheetHeader className="mb-6">
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Update the user's information and permissions.
            </SheetDescription>
          </SheetHeader>
          {selectedUserId && (
            <UserForm 
              userId={selectedUserId}
              onSuccess={handleSuccess} 
              onCancel={() => setIsEditOpen(false)} 
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

