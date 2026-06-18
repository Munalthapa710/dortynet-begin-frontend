import type {
  Department,
  DepartmentPayload,
} from "../../types/apiTypes";

import { baseApi } from "./baseApi";

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      query: () => "/api/department",

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Department" as const,
                id,
              })),
              { type: "Department" as const, id: "LIST" },
            ]
          : [{ type: "Department" as const, id: "LIST" }],
    }),

    getDepartment: builder.query<Department, number>({
      query: (id) => `/api/department/${id}`,

      providesTags: (_result, _error, id) => [
        { type: "Department" as const, id },
      ],
    }),

    createDepartment: builder.mutation<
      Department,
      DepartmentPayload
    >({
      query: (body) => ({
        url: "/api/department",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        { type: "Department" as const, id: "LIST" },
      ],
    }),

    updateDepartment: builder.mutation<
      Department,
      Department
    >({
      query: ({ id, ...body }) => ({
        url: `/api/department/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Department" as const, id },
        { type: "Department" as const, id: "LIST" },
      ],
    }),

    deleteDepartment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/department/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        { type: "Department" as const, id },
        { type: "Department" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;