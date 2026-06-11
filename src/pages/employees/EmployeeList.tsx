import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { ErrorState, LoadingState } from "../../components/common/StateMessage";
import { Button } from "../../components/ui/Button";
import { getApiErrorMessage } from "../../lib/apiError";
import { formatCurrency } from "../../lib/format";
import { useDeleteEmployeeMutation, useGetEmployeesQuery } from "../../redux/api/employeeApi";

export default function EmployeeList() {
  const [search, setSearch] = useState("");
  const { data = [], isLoading, error } = useGetEmployeesQuery();
  const [deleteEmployee, { isLoading: deleting }] = useDeleteEmployeeMutation();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? data.filter((employee) => `${employee.name} ${employee.email}`.toLowerCase().includes(query)) : data;
  }, [data, search]);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) return;
    try {
      await deleteEmployee(id).unwrap();
      toast.success("Employee deleted");
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError));
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employees"
        description="View, search, create, and update employee records."
        action={<Link to="/employees/new"><Button><Plus size={17} /> Add employee</Button></Link>}
      />
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email..." className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
      </div>
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message="Could not load employees. Check that the backend is running on port 5256." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Salary</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">{employee.name}</td>
                    <td className="px-5 py-4 text-slate-600">{employee.email}</td>
                    <td className="px-5 py-4 text-slate-600">{formatCurrency(employee.salary)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/employees/${employee.id}/edit`} className="grid size-9 place-items-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100" aria-label={`Edit ${employee.name}`}><Pencil size={16} /></Link>
                        <button disabled={deleting} onClick={() => handleDelete(employee.id, employee.name)} className="grid size-9 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50" aria-label={`Delete ${employee.name}`}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="p-10 text-center text-sm text-slate-500">{search ? "No employees match your search." : "No employees yet. Add your first employee."}</div>}
        </div>
      )}
    </div>
  );
}
