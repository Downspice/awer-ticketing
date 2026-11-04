"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { FolderKanban, Pencil, Plus } from "lucide-react";

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
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-border/40">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
        <Skeleton className="h-[380px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Projects Management
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure project workspaces, ownership, and ticket assignment targets.
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90 w-fit">
          <Plus className="h-4 w-4" /> Create New Project
        </Button>
      </div>

      <Card className="border border-border/70 bg-card/60 backdrop-blur-xs shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/60 bg-muted/30">
                <TableHead className="font-semibold text-xs text-muted-foreground">Name</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">Description</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-sm text-muted-foreground">
                    No projects found. Click &quot;Create New Project&quot; to add your first one.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-sm text-foreground">{project.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {project.description || "No description provided"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Switch
                          checked={project.enabled}
                          onCheckedChange={() =>
                            handleToggleStatus(project.id, project.enabled)
                          }
                          aria-label={`Toggle ${project.name} status`}
                        />
                        <Badge
                          variant={project.enabled ? "default" : "secondary"}
                          className={`text-[10px] h-5 px-1.5 font-medium ${
                            project.enabled
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {project.enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(project.id)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit {project.name}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Project Sheet */}
      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
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
      <Sheet
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open)
          if (!open) setSelectedProjectId(undefined)
        }}
      >
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
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
