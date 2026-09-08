import type { Client, ClientPayload } from "../../types/apiTypes";
import { baseApi } from "./baseApi";

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<Client[], void>({
      query: () => "/api/client",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Client" as const, id })),
              { type: "Client" as const, id: "LIST" },
            ]
          : [{ type: "Client" as const, id: "LIST" }],
    }),

    getClient: builder.query<Client, number>({
      query: (id) => `/api/client/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Client" as const, id }],
    }),

    createClient: builder.mutation<Client, ClientPayload>({
      query: (body) => ({ url: "/api/client", method: "POST", body }),
      invalidatesTags: [{ type: "Client" as const, id: "LIST" }],
    }),

    updateClient: builder.mutation<Client, Client>({
      query: ({ id, ...body }) => ({ url: `/api/client/${id}`, method: "PUT", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Client" as const, id },
        { type: "Client" as const, id: "LIST" },
      ],
    }),

    deleteClient: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/client/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Client" as const, id },
        { type: "Client" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi;
