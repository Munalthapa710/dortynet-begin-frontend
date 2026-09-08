import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { EmployeeForm } from "../../components/employee/EmployeeForm";
import { PageHeader } from "../../components/common/PageHeader";
import { getApiErrorMessage } from "../../lib/apiError";
import { useCreateEmployeeMutation } from "../../redux/api/employeeApi";
import type { EmployeeFormValues } from "../../zod/employeeZod";

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      await createEmployee(values).unwrap();
      toast.success("Employee created");
      navigate("/employees");
    } catch (error) {
      console.error("Create employee failed", error);
      toast.error(getApiErrorMessage(error));
    }
  };

  return <div className="space-y-6"><PageHeader title="New employee" description="Add a new employee record." /><EmployeeForm isSubmitting={isLoading} submitLabel="Create employee" onSubmit={onSubmit} /></div>;
}
