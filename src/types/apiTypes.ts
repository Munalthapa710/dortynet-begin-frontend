export interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
}

export type EmployeePayload = Omit<Employee, "id">;

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
