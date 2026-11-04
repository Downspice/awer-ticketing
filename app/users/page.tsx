"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Card, CardContent } from "../../components/ui/card"
import { Switch } from "../../components/ui/switch"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
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
import { Pencil, Plus, Users } from "lucide-react"

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

  const getInitials = (name?: string) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-border/40">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-[380px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              User Management
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage team members, roles, permissions, and account status.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90 w-fit"
        >
          <Plus className="h-4 w-4" /> Create New User
        </Button>
      </div>

      <Card className="border border-border/70 bg-card/60 backdrop-blur-xs shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/60 bg-muted/30">
                <TableHead className="font-semibold text-xs text-muted-foreground">User</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">Email</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">Roles</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-sm text-muted-foreground">
                    No users found. Click &quot;Create New User&quot; to add team members.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-border/60">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                            {getInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm text-foreground">{user.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="outline"
                            className="text-[10px] h-5 px-1.5 font-medium capitalize bg-muted/60"
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Switch
                          checked={user.enabled}
                          onCheckedChange={() => handleToggleStatus(user.id, user.enabled)}
                          aria-label={`Toggle ${user.fullName} status`}
                        />
                        <Badge
                          variant={user.enabled ? "default" : "secondary"}
                          className={`text-[10px] h-5 px-1.5 font-medium ${
                            user.enabled
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {user.enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(user.id)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit {user.fullName}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create User Sheet */}
      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Create New User</SheetTitle>
            <SheetDescription>
              Enter the user&apos;s details to add them to the system.
            </SheetDescription>
          </SheetHeader>
          <UserForm 
            onSuccess={handleSuccess} 
            onCancel={() => setIsCreateOpen(false)} 
          />
        </SheetContent>
      </Sheet>

      {/* Edit User Sheet */}
      <Sheet
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open)
          if (!open) setSelectedUserId(undefined)
        }}
      >
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Update the user&apos;s information and permissions.
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
