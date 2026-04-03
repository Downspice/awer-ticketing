"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTicket } from "@/lib/actions";
import { validateInput } from "@/lib/utils";
import type { User, Projects } from "@/lib/types"; // Fixed import for Project
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TicketCreateForm({ onSuccess, onCancel }: TicketCreateFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    priority: "",
    project: "",
    assignedToId: "",
    assignedToName: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    priority: "",
    project: "",
    assignedToId: "",
    assignedToName: "",
    description: "",
  });
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [projects, setProjects] = useState<any[]>([]); // Use any[] if Prisma type is not directly available here or fix import
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetch("/api/users?role=technician");
        if (!response.ok) throw new Error("Failed to fetch technicians");
        const data = await response.json();
        setTechnicians(data);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    fetchTechnicians();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name as keyof typeof errors]: "" }));
    }
  };

  const handleSelectChange = (
    name: string,
    value: string,
    name2?: string,
    value2?: string
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name2 && value2) {
        (updated as any)[name2] = value2;
      }
      return updated;
    });

    // Clear error when user selects
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name as keyof typeof errors]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateInput(formData.name),
      priority: formData.priority ? "" : "Priority is required",
      project: formData.project ? "" : "Project is required",
      assignedToId: formData.assignedToId ? "" : "Assignee is required",
      assignedToName: "", // Not validated
      description: validateInput(formData.description),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createTicket(formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Ticket Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">
          Priority <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => handleSelectChange("priority", value)}
        >
          <SelectTrigger
            id="priority"
            className={errors.priority ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        {errors.priority && (
          <p className="text-red-500 text-sm">{errors.priority}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="project">
          Project <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.project}
          onValueChange={(value) => handleSelectChange("project", value)}
        >
          <SelectTrigger
            id="project"
            className={errors.project ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.project && (
          <p className="text-red-500 text-sm">{errors.project}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignedToId">
          Assigned To <span className="text-red-500">*</span>
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={`w-full justify-between font-normal ${
                errors.assignedToId ? "border-red-500" : ""
              }`}
            >
              {formData.assignedToId
                ? technicians.find(
                    (user) => user.id === formData.assignedToId
                  )?.fullName || "Select technician"
                : "Select technician"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search technician..." />
              <CommandList>
                <CommandEmpty>No technician found.</CommandEmpty>
                <CommandGroup>
                  {technicians.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.fullName}
                      onSelect={() => {
                        handleSelectChange(
                          "assignedToId",
                          user.id,
                          "assignedToName",
                          user.fullName
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.assignedToId === user.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {user.fullName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.assignedToId && (
          <p className="text-red-500 text-sm">{errors.assignedToId}</p>
        )}
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
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Ticket"}
        </Button>
      </div>
    </form>
  );
}
