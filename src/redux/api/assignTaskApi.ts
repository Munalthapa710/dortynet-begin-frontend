import type { AssignedTask, AssignedTaskPayload } from "../../types/apiTypes";
import { baseApi } from "./baseApi";

export const assignTaskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssignedTasks: builder.query<AssignedTask[], void>({
      query: () => "/api/assign-task",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "AssignedTask" as const, id })),
              { type: "AssignedTask", id: "LIST" },
            ]
          : [{ type: "AssignedTask", id: "LIST" }],
    }),

    createAssignedTask: builder.mutation<AssignedTask, AssignedTaskPayload>({
      query: (body) => ({ url: "/api/assign-task", method: "POST", body }),
      invalidatesTags: [{ type: "AssignedTask", id: "LIST" }],
    }),

    updateAssignedTask: builder.mutation<AssignedTask, AssignedTask>({
      query: ({ id, employeeId, title, description, dueDate, status }) => ({
        url: `/api/assign-task/${id}`,
        method: "PUT",
        body: { employeeId, title, description, dueDate, status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AssignedTask", id },
        { type: "AssignedTask", id: "LIST" },
      ],
    }),

    deleteAssignedTask: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/assign-task/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "AssignedTask", id },
        { type: "AssignedTask", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAssignedTasksQuery,
  useCreateAssignedTaskMutation,
  useUpdateAssignedTaskMutation,
  useDeleteAssignedTaskMutation,
} = assignTaskApi;
