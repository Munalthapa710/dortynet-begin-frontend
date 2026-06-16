export interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
}

export type EmployeePayload = Omit<Employee, "id">;

export interface AssignedTask {
  id: number;
  employeeId: number;
  title: string;
  description: string;
  dueDate: string | null;
  status: string;
  assignedOn: string;
}

export type AssignedTaskPayload = Omit<AssignedTask, "id" | "assignedOn">;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface ApiError {
  status?: number | string;
  data?:
    | string
    | {
        title?: string;
        detail?: string;
        errors?: Record<string, string[]>;
      };
  error?: string;
}
