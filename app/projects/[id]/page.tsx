"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectForm } from "@/components/project-form"

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string

  const handleSuccess = () => {
    router.push("/projects");
    router.refresh();
  };

  const handleCancel = () => {
    router.push("/projects");
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm 
            projectId={projectId}
            onSuccess={handleSuccess} 
            onCancel={handleCancel} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
