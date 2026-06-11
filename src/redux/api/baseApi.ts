import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../constants/config";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    headers: { "Content-Type": "application/json" },
  }),
  tagTypes: ["Employee"],
  endpoints: () => ({}),
});
