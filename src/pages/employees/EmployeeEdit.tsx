import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { EmployeeForm } from "../../components/employee/EmployeeForm";
import { PageHeader } from "../../components/common/PageHeader";
import { ErrorState, LoadingState } from "../../components/common/StateMessage";
import { getApiErrorMessage } from "../../lib/apiError";
import { useGetEmployeeQuery, useUpdateEmployeeMutation } from "../../redux/api/employeeApi";
import type { EmployeeFormValues } from "../../zod/employeeZod";

export default function EmployeeEdit() {
  const navigate = useNavigate();
  const id = Number(useParams().id);
  const { data, isLoading, error } = useGetEmployeeQuery(id, { skip: !Number.isInteger(id) });
  const [updateEmployee, { isLoading: saving }] = useUpdateEmployeeMutation();

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      await updateEmployee({ id, ...values }).unwrap();
      toast.success("Employee updated");
      navigate("/employees");
    } catch (updateError) {
      toast.error(getApiErrorMessage(updateError));
    }
  };

  if (!Number.isInteger(id)) return <ErrorState message="Invalid employee ID." />;
  if (isLoading) return <LoadingState />;
  if (error || !data) return <ErrorState message="Employee could not be found." />;

  return <div className="space-y-6"><PageHeader title="Edit employee" description={`Update ${data.name}'s employee record.`} /><EmployeeForm defaultValues={{ name: data.name, email: data.email, salary: data.salary }} isSubmitting={saving} submitLabel="Update employee" onSubmit={onSubmit} /></div>;
}
