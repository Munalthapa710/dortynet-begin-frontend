import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { DepartmentForm } from "../../components/department/DepartmentForm";
import { PageHeader } from "../../components/common/PageHeader";
import {
  AccessDeniedState,
  ErrorState,
  LoadingState,
} from "../../components/common/StateMessage";
import { getApiErrorMessage, isApiForbidden } from "../../lib/apiError";

import {
  useGetDepartmentQuery,
  useUpdateDepartmentMutation,
} from "../../redux/api/departmentApi";

import type { DepartmentFormValues } from "../../zod/departmentZod";

export default function DepartmentEdit() {
  const navigate = useNavigate();

  const id = Number(useParams().id);

  const { data, isLoading, error } =
    useGetDepartmentQuery(id, {
      skip: !Number.isInteger(id),
    });

  const [updateDepartment, { isLoading: saving }] =
    useUpdateDepartmentMutation();

  const onSubmit = async (
    values: DepartmentFormValues
  ) => {
    try {
      await updateDepartment({
        id,
        ...values,
      }).unwrap();

      toast.success("Department updated");

      navigate("/departments");
    } catch (updateError) {
      toast.error(getApiErrorMessage(updateError));
    }
  };

  if (!Number.isInteger(id))
    return <ErrorState message="Invalid Department ID." />;

  if (isLoading) return <LoadingState />;

  if (isApiForbidden(error)) return <AccessDeniedState />;

  if (error || !data)
    return (
      <ErrorState message="Department not found." />
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Department"
        description={`Update ${data.name}`}
      />

      <DepartmentForm
        defaultValues={{
          name: data.name,
          description: data.description,
        }}
        isSubmitting={saving}
        submitLabel="Update Department"
        onSubmit={onSubmit}
      />
    </div>
  );
}
