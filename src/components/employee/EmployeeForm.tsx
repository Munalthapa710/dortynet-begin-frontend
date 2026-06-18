import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { employeeSchema, type EmployeeFormValues } from "../../zod/employeeZod";
import { useGetDepartmentsQuery } from "../../redux/api/departmentApi";

interface EmployeeFormProps {
  defaultValues?: EmployeeFormValues;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (values: EmployeeFormValues) => Promise<void>;
}

export function EmployeeForm({
  defaultValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: EmployeeFormProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultValues ?? { name: "", email: "", salary: 0 },
  });

  const { data: departments = [] } = useGetDepartmentsQuery();
  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 md:p-6">
        <Input
          label="Full name"
          placeholder="e.g. Jane Smith"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="jane@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <div>
          <label className="block mb-2 text-sm font-medium">Department</label>

          <select
            {...register("departmentId", {
              valueAsNumber: true,
            })}
            className="h-11 w-full rounded-lg border border-slate-300 px-3"
          >
            <option value={0}>Select Department</option>

            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>

          {errors.departmentId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.departmentId.message}
            </p>
          )}
        </div>
        <Input
          label="Annual salary"
          type="number"
          step="0.01"
          min="0"
          placeholder="50000"
          error={errors.salary?.message}
          {...register("salary", { valueAsNumber: true })}
        />
      </div>
      <div className="flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        

        <Button variant="secondary" onClick={() => navigate("/employees")}>
          <ArrowLeft size={17} /> Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save size={17} /> {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
