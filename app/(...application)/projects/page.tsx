"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toggleProjectStatus } from "@/lib/actions";
import { Projects } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

 

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      console.error("Error toggling user status:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Projects List</h1>
        <div className="flex space-x-4">
          {/* <Button asChild variant="outline">
            <Link href="/">Back to Dashboard</Link>
          </Button> */}
          <Button asChild>
            <Link href="/projects/create">Create New Project</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
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
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/projects/${project.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
