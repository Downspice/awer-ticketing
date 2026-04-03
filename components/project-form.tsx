"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { createProject, updateProject } from "@/lib/actions"
import { validateInput } from "@/lib/utils"
import type { Projects } from "@/lib/types"

interface ProjectFormProps {
  projectId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProjectForm({ projectId, onSuccess, onCancel }: ProjectFormProps) {
  const isEditMode = !!projectId
  const [loading, setLoading] = useState(isEditMode)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    enabled: true,
  })
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/projects/${projectId}`)
          if (!response.ok) throw new Error("Failed to fetch project")
          const data = await response.json()
          
          setFormData({
            name: data.name,
            description: data.description,
            enabled: data.enabled,
          })
        } catch (error) {
          console.error("Error fetching project:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchProject()
    }
  }, [projectId, isEditMode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name as keyof typeof errors]: "" }))
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
      name: validateInput(formData.name),
      description: validateInput(formData.description),
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
      if (isEditMode) {
        await updateProject(projectId, {
          name: formData.name,
          description: formData.description,
          enabled: formData.enabled,
        })
      } else {
        await createProject({
          name: formData.name,
          description: formData.description,
          enabled: formData.enabled,
        })
      }

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Failed to save project:", error)
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
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Project Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
          {isSubmitting ? (isEditMode ? "Saving..." : "Creating...") : (isEditMode ? "Save Changes" : "Create Project")}
        </Button>
      </div>
    </form>
  )
}
