"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { createUser, updateUser } from "@/lib/actions"
import { validateInput } from "@/lib/utils"
import type { User } from "@/lib/types"

interface UserFormProps {
  userId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function UserForm({ userId, onSuccess, onCancel }: UserFormProps) {
  const isEditMode = !!userId
  const [loading, setLoading] = useState(isEditMode)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    roles: {
      admin: false,
      technician: false,
    },
    enabled: true,
  })
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    roles: "",
  })

  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/users/${userId}`)
          if (!response.ok) throw new Error("Failed to fetch user")
          const data = await response.json()
          
          setFormData({
            fullName: data.fullName,
            email: data.email,
            roles: {
              admin: data.roles.includes("admin"),
              technician: data.roles.includes("technician"),
            },
            enabled: data.enabled,
          })
        } catch (error) {
          console.error("Error fetching user:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchUser()
    }
  }, [userId, isEditMode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name as keyof typeof errors]: "" }))
    }
  }

  const handleRoleChange = (role: "admin" | "technician", checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: checked,
      },
    }))

    if (errors.roles && (checked || Object.values(formData.roles).some(Boolean))) {
      setErrors((prev) => ({ ...prev, roles: "" }))
    }
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      enabled: checked,
    }))
  }

  const validateForm = () => {
    const newErrors = {
      fullName: validateInput(formData.fullName),
      email: validateInput(formData.email),
      roles: !Object.values(formData.roles).some(Boolean) ? "At least one role must be selected" : "",
    }

    if (!newErrors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const rolesArray = Object.entries(formData.roles)
        .filter(([, isSelected]) => isSelected)
        .map(([role]) => role)

      if (isEditMode) {
        await updateUser(userId, {
          fullName: formData.fullName,
          email: formData.email,
          roles: rolesArray,
          enabled: formData.enabled,
        })
      } else {
        await createUser({
          fullName: formData.fullName,
          email: formData.email,
          roles: rolesArray,
        })
      }

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Failed to save user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-6 w-[150px]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label>
          Roles <span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="admin"
              checked={formData.roles.admin}
              onCheckedChange={(checked) => handleRoleChange("admin", checked as boolean)}
            />
            <Label htmlFor="admin" className="font-normal">
              Admin
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="technician"
              checked={formData.roles.technician}
              onCheckedChange={(checked) => handleRoleChange("technician", checked as boolean)}
            />
            <Label htmlFor="technician" className="font-normal">
              Technician
            </Label>
          </div>
        </div>
        {errors.roles && <p className="text-red-500 text-sm">{errors.roles}</p>}
      </div>

      {isEditMode && (
        <div className="space-y-2">
          <Label htmlFor="enabled">Status</Label>
          <div className="flex items-center space-x-2">
            <Switch id="enabled" checked={formData.enabled} onCheckedChange={handleStatusChange} />
            <Label htmlFor="enabled" className="font-normal">
              {formData.enabled ? "Enabled" : "Disabled"}
            </Label>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isEditMode ? "Saving..." : "Creating...") : (isEditMode ? "Save Changes" : "Create User")}
        </Button>
      </div>
    </form>
  )
}
