import type { ApiError } from "../types/apiTypes";

export const isApiForbidden = (error: unknown) => {
  const apiError = error as ApiError | undefined;
  return apiError?.status === 403 || apiError?.status === "403";
};

export const getApiErrorMessage = (error: unknown) => {
  if (isApiForbidden(error)) return "Access denied.";

  const apiError = error as ApiError | undefined;
  const data = typeof apiError?.data === "string" ? undefined : apiError?.data;
  const validationMessage = data?.errors
    ? Object.values(data.errors).flat()[0]
    : undefined;

  return (
    (typeof apiError?.data === "string" ? apiError.data : undefined) ||
    validationMessage ||
    data?.message ||
    data?.error ||
    data?.detail ||
    data?.title ||
    apiError?.error ||
    (apiError?.status ? `Request failed with status ${apiError.status}.` : undefined) ||
    "Something went wrong. Please try again."
  );
};
