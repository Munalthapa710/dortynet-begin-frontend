import type { Employee, EmployeePayload, PagedResponse } from "../../types/apiTypes";
import { baseApi } from "./baseApi";

export interface EmployeeListParams {
  page?: number;
  limit?: number;
  query?: string;
}

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<PagedResponse<Employee>, EmployeeListParams | void>({
      query: (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const query = params?.query ?? "";

        return `/api/employee?page=${page}&limit=${limit}&query=${encodeURIComponent(query)}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee", id: "LIST" },
            ]
          : [{ type: "Employee", id: "LIST" }],
    }),

    getEmployee: builder.query<Employee, number>({
      query: (id) => `/api/Employee/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),


    createEmployee: builder.mutation<Employee, EmployeePayload>({
      query: (body) => ({ url: "/api/employee/new", method: "POST", body }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),


    updateEmployee: builder.mutation<Employee, Employee>({
      query: ({ id, ...body }) => ({
        url: `/api/Employee/${id}`,
        method: "PUT",
        body,
      }),


      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),


    deleteEmployee: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/Employee/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),
    
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
