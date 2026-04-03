"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ProjectForm } from "@/components/project-form"
import { toggleProjectStatus } from "@/lib/actions";
import { Projects } from "@/lib/types";
import { Pencil, Plus } from "lucide-react";

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined)

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleToggleStatus = async (
    projectId: string,
    currentStatus: boolean
  ) => {
    try {
      await toggleProjectStatus(projectId, !currentStatus);
      // Update local state
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? { ...project, enabled: !currentStatus }
            : project
        )
      );
    } catch (error) {
      console.error("Error toggling project status:", error);
    }
  };

  const handleSuccess = () => {
    setIsCreateOpen(false)
    setIsEditOpen(false)
    setSelectedProjectId(undefined)
    fetchProjects()
    router.refresh()
  }

  const handleEdit = (projectId: string) => {
    setSelectedProjectId(projectId)
    setIsEditOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Projects List</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Project
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>
                    <Switch
                      checked={project.enabled}
                      onCheckedChange={() =>
                        handleToggleStatus(project.id, project.enabled)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(project.id)}>
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

      {/* Create Project Sheet */}
      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="sm:max-w-[540px]">
          <SheetHeader className="mb-6">
            <SheetTitle>Create New Project</SheetTitle>
            <SheetDescription>
              Add a new project to track and manage associated tickets.
            </SheetDescription>
          </SheetHeader>
          <ProjectForm 
            onSuccess={handleSuccess} 
            onCancel={() => setIsCreateOpen(false)} 
          />
        </SheetContent>
      </Sheet>

      {/* Edit Project Sheet */}
      <Sheet open={isEditOpen} onOpenChange={(open) => {
        setIsEditOpen(open)
        if (!open) setSelectedProjectId(undefined)
      }}>
        <SheetContent className="sm:max-w-[540px]">
          <SheetHeader className="mb-6">
            <SheetTitle>Edit Project</SheetTitle>
            <SheetDescription>
              Update project details and visibility status.
            </SheetDescription>
          </SheetHeader>
          {selectedProjectId && (
            <ProjectForm 
              projectId={selectedProjectId}
              onSuccess={handleSuccess} 
              onCancel={() => setIsEditOpen(false)} 
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
