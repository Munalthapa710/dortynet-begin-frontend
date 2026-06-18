import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DepartmentForm } from "../../components/department/DepartmentForm";
import { PageHeader } from "../../components/common/PageHeader";
import { getApiErrorMessage } from "../../lib/apiError";
import { useCreateDepartmentMutation } from "../../redux/api/departmentApi";
import type { DepartmentFormValues } from "../../zod/departmentZod";

export default function DepartmentCreate() {
  const navigate = useNavigate();

  const [createDepartment, { isLoading }] =
    useCreateDepartmentMutation();

  const onSubmit = async (
    values: DepartmentFormValues
  ) => {
    try {
      await createDepartment(values).unwrap();

      toast.success("Department created");

      navigate("/departments");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Department"
        description="Add a new department."
      />

      <DepartmentForm
        isSubmitting={isLoading}
        submitLabel="Create Department"
        onSubmit={onSubmit}
      />
    </div>
  );
}