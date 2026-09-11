export interface Employee {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role: "Manager" | "Employee";
  salary: number;
  departmentId: number;
  departmentName?: string;
  clientId: number | null;
  clientName?: string | null;
  rowTotal?: number;

  department?: Department;
  client?: Client;
}

export type EmployeePayload = Omit<Employee, "id" | "department" | "departmentName" | "client" | "clientName" | "rowTotal">;

export interface PagedResponse<T> {
  items: T[];
  rowTotal: number;
  page: number;
  limit: number;
}

export interface Client {
  id: number;
  clientName: string;
  phoneNumber: string;
  projectName: string;
}

export type ClientPayload = Omit<Client, "id">;

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

export interface Department {
  id: number;
  name: string;
  description: string;
}

export type DepartmentPayload = Omit<Department, "id">;

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
        message?: string;
        error?: string;
        errors?: Record<string, string[]>;
      };
  error?: string;
}
