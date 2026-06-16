import { z } from "zod";

export const taskStatuses = ["Pending", "In Progress", "Completed"] as const;

export const assignTaskSchema = z.object({
  employeeId: z.number().int().min(1, "Select an employee"),
  title: z.string().trim().min(2, "Title must contain at least 2 characters").max(200),
  description: z.string().trim().max(2000),
  dueDate: z.string().optional(),
  status: z.enum(taskStatuses),
});

export type AssignTaskFormValues = z.infer<typeof assignTaskSchema>;
