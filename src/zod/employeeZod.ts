import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email address").max(150),
  phoneNumber: z.string().trim().min(7, "Phone number is required").max(20),
  password: z.string().min(6, "Password must contain at least 6 characters"),
  role: z.enum(["Manager", "Employee"]),
  departmentId: z.number().min(1, "Department is required"),
  clientId: z.number().nullable(),
  salary: z.number().positive("Salary must be greater than zero"),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
