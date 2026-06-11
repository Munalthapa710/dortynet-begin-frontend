import type { ApiError } from "../types/apiTypes";

export const getApiErrorMessage = (error: unknown) => {
  const apiError = error as ApiError | undefined;
  const data = typeof apiError?.data === "string" ? undefined : apiError?.data;
  const validationMessage = data?.errors
    ? Object.values(data.errors).flat()[0]
    : undefined;

  return (
    (typeof apiError?.data === "string" ? apiError.data : undefined) ||
    validationMessage ||
    data?.detail ||
    data?.title ||
    apiError?.error ||
    "Something went wrong. Please try again."
  );
};
