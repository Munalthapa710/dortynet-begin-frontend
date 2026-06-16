import type { LoginRequest, LoginResponse } from "../../types/apiTypes";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/api/auth/login", method: "POST", body }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
