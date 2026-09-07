import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, ClipboardList, Save, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PageHeader } from "../../components/common/PageHeader";
import { AccessDeniedState, ErrorState, LoadingState } from "../../components/common/StateMessage";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { getApiErrorMessage, isApiForbidden } from "../../lib/apiError";
import {
  useCreateAssignedTaskMutation,
  useDeleteAssignedTaskMutation,
  useGetAssignedTasksQuery,
  useUpdateAssignedTaskMutation,
} from "../../redux/api/assignTaskApi";
import { useGetEmployeesQuery } from "../../redux/api/employeeApi";
import type { AssignedTask } from "../../types/apiTypes";
import { assignTaskSchema, taskStatuses, type AssignTaskFormValues } from "../../zod/assignTaskZod";

const initialValues: AssignTaskFormValues = {
  employeeId: 0,
  title: "",
  description: "",
  dueDate: "",
  status: "Pending",
};

function toPayload(values: AssignTaskFormValues) {
  return {
    employeeId: values.employeeId,
    title: values.title,
    description: values.description ?? "",
    dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
    status: values.status,
  };
}

function formatDate(value: string | null) {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export default function AssignTaskPage() {
  const { data: employees = [], isLoading: employeesLoading, error: employeesError } = useGetEmployeesQuery();
  const { data: tasks = [], isLoading: tasksLoading, error: tasksError } = useGetAssignedTasksQuery();
  const [createTask, { isLoading: creating }] = useCreateAssignedTaskMutation();
  const [updateTask, { isLoading: updating }] = useUpdateAssignedTaskMutation();
  const [deleteTask, { isLoading: deleting }] = useDeleteAssignedTaskMutation();

  const employeeNames = useMemo(
    () => new Map(employees.map((employee) => [employee.id, employee.name])),
    [employees],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignTaskFormValues>({
    resolver: zodResolver(assignTaskSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: AssignTaskFormValues) => {
    try {
      await createTask(toPayload(values)).unwrap();
      toast.success("Task assigned");
      reset(initialValues);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleStatusChange = async (task: AssignedTask, status: AssignedTask["status"]) => {
    try {
      await updateTask({ ...task, status }).unwrap();
      toast.success("Task status updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async (task: AssignedTask) => {
    if (!window.confirm(`Delete task "${task.title}"? This action cannot be undone.`)) return;
    try {
      await deleteTask(task.id).unwrap();
      toast.success("Task deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const isLoading = employeesLoading || tasksLoading;
  const hasError = employeesError || tasksError;
  const isForbidden = isApiForbidden(employeesError) || isApiForbidden(tasksError);

  return (
    <div className="space-y-6">
      <PageHeader title="Assign task" description="Create tasks for employees and track their current status." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Employee</span>
            <select
              className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 ${
                errors.employeeId ? "border-red-400" : "border-slate-300"
              }`}
              {...register("employeeId", { valueAsNumber: true })}
            >
              <option value={0}>Select employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
            {errors.employeeId && <span className="block text-xs text-red-600">{errors.employeeId.message}</span>}
          </label>

          <Input label="Task title" placeholder="e.g. Prepare monthly report" error={errors.title?.message} {...register("title")} />

          <label className="block space-y-1.5 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              rows={4}
              placeholder="Add clear task details..."
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 ${
                errors.description ? "border-red-400" : "border-slate-300"
              }`}
              {...register("description")}
            />
            {errors.description && <span className="block text-xs text-red-600">{errors.description.message}</span>}
          </label>

          <Input label="Due date" type="date" error={errors.dueDate?.message} {...register("dueDate")} />

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              {...register("status")}
            >
              {taskStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={creating || employees.length === 0}>
            <Save size={17} /> {creating ? "Assigning..." : "Assign task"}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <LoadingState />
      ) : isForbidden ? (
        <AccessDeniedState />
      ) : hasError ? (
        <ErrorState message="Could not load assign task data. Check that the backend is running and you are authorized." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <ClipboardList size={18} /> Assigned tasks
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Task</th>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Due date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{task.title}</div>
                      {task.description && <div className="mt-1 max-w-xl text-sm text-slate-500">{task.description}</div>}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{employeeNames.get(task.employeeId) ?? `Employee #${task.employeeId}`}</td>
                    <td className="px-5 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={16} /> {formatDate(task.dueDate)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={task.status}
                        disabled={updating}
                        onChange={(event) => handleStatusChange(task, event.target.value)}
                        className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-700 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:opacity-60"
                      >
                        {taskStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          disabled={deleting}
                          onClick={() => handleDelete(task)}
                          className="grid size-9 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          aria-label={`Delete ${task.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tasks.length === 0 && <div className="p-10 text-center text-sm text-slate-500">No tasks assigned yet.</div>}
        </div>
      )}
    </div>
  );
}
