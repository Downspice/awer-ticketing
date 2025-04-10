"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProject } from "@/lib/actions"
import { validateInput } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"

 

export default function CreateTicket() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    enabled: true
  })
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  }) 
  const [isSubmitting, setIsSubmitting] = useState(false)
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
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
      await createProject(formData)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Failed to create Project:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/projects")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Ticket"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

