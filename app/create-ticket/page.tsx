"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TicketCreateForm } from "@/components/ticket-create-form";

export default function CreateTicket() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
    router.refresh();
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketCreateForm 
            onSuccess={handleSuccess} 
            onCancel={handleCancel} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
