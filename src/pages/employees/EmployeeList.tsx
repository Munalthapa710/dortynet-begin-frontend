import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { AccessDeniedState, ErrorState, LoadingState } from "../../components/common/StateMessage";
import { Button } from "../../components/ui/Button";
import { getApiErrorMessage, isApiForbidden } from "../../lib/apiError";
import { getAuthRole } from "../../lib/auth";
import { formatCurrency } from "../../lib/format";
import { useGetDepartmentsQuery } from "../../redux/api/departmentApi";
import { useDeleteEmployeeMutation, useGetEmployeesQuery } from "../../redux/api/employeeApi";

const EMPLOYEE_LIMIT = 10;

export default function EmployeeList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const isManager = getAuthRole() === "Manager";
  const { data, isLoading, error } = useGetEmployeesQuery({
    page,
    limit: EMPLOYEE_LIMIT,
    query: search,
  });
  const employees = data?.items ?? [];
  const totalEmployees = data?.rowTotal ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalEmployees / EMPLOYEE_LIMIT));
  const firstResult = totalEmployees === 0 ? 0 : (page - 1) * EMPLOYEE_LIMIT + 1;
  const lastResult = Math.min(page * EMPLOYEE_LIMIT, totalEmployees);
  const { data: departments = [] } = useGetDepartmentsQuery();
  const [deleteEmployee, { isLoading: deleting }] = useDeleteEmployeeMutation();

  const departmentNames = useMemo(
    () => new Map(departments.map((department) => [department.id, department.name])),
    [departments],
  );

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) return;
    try {
      await deleteEmployee(id).unwrap();
      toast.success("Employee deleted");
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError));
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employees"
        description={isManager ? "View, search, create, and update employee records." : "View and search employee records."}
        action={isManager ? <Link to="/employees/new"><Button><Plus size={17} /> Add employee</Button></Link> : undefined}
      />
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input value={search} onChange={(event) => handleSearchChange(event.target.value)} placeholder="Search name or email..." className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
      </div>
      {isLoading ? (
        <LoadingState />
      ) : isApiForbidden(error) ? (
        <AccessDeniedState />
      ) : error ? (
        <ErrorState message="Could not load employees. Check that the backend is running on port 5256." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-600">
            Showing {firstResult}-{lastResult} of {totalEmployees} employees
          </div> */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Email</th><th>Department</th><th className="px-5 py-3">Salary</th>{isManager && <th className="px-5 py-3 text-right">Actions</th>}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">{employee.name}</td>
                    <td className="px-5 py-4 text-slate-600">{employee.email}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {employee.departmentName ?? employee.department?.name ?? departmentNames.get(employee.departmentId) ?? `Department #${employee.departmentId}`}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{formatCurrency(employee.salary)}</td>
                    {isManager && (
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link to={`/employees/${employee.id}/edit`} className="grid size-9 place-items-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100" aria-label={`Edit ${employee.name}`}><Pencil size={16} /></Link>
                          <button disabled={deleting} onClick={() => handleDelete(employee.id, employee.name)} className="grid size-9 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50" aria-label={`Delete ${employee.name}`}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {employees.length === 0 && <div className="p-10 text-center text-sm text-slate-500">{search ? "No employees match your search." : "No employees yet. Add your first employee."}</div>}
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <Button variant="secondary" disabled={page <= 1 || isLoading} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                <ChevronLeft size={16} /> Previous
              </Button>
              <Button variant="secondary" disabled={page >= totalPages || isLoading} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
