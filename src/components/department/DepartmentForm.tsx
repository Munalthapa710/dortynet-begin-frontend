import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

import {
  departmentSchema,
  type DepartmentFormValues,
} from "../../zod/departmentZod";

interface DepartmentFormProps {
  defaultValues?: DepartmentFormValues;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (
    values: DepartmentFormValues
  ) => Promise<void>;
}

export function DepartmentForm({
  defaultValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: DepartmentFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues:
      defaultValues ?? {
        name: "",
        description: "",
      },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Input
          label="Department Name"
          placeholder="IT"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Description"
          placeholder="Information Technology Department"
          error={errors.description?.message}
          {...register("description")}
        />
      </div>

      <div className="flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Button
          variant="secondary"
          onClick={() =>
            navigate("/departments")
          }
        >
          <ArrowLeft size={17} />
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          <Save size={17} />
          {isSubmitting
            ? "Saving..."
            : submitLabel}
        </Button>
      </div>
    </form>
  );
}