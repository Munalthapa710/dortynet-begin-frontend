import type { Employee, EmployeePayload } from "../../types/apiTypes";
import { baseApi } from "./baseApi";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], void>({
      query: () => "/api/Employee",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee", id: "LIST" },
            ]
          : [{ type: "Employee", id: "LIST" }],
    }),

    getEmployee: builder.query<Employee, number>({
      query: (id) => `/api/Employee/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),


    createEmployee: builder.mutation<Employee, EmployeePayload>({
      query: (body) => ({ url: "/api/Employee", method: "POST", body }),
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
