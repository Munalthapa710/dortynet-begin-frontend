import { Banknote, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { AccessDeniedState, ErrorState, LoadingState } from "../components/common/StateMessage";
import { getAuthRole } from "../lib/auth";
import { isApiForbidden } from "../lib/apiError";
import { formatCurrency } from "../lib/format";
import { useGetEmployeesQuery } from "../redux/api/employeeApi";

export default function Dashboard() {
  const role = getAuthRole();
  const isManager = role === "Manager";
  const { data = [], isLoading, error } = useGetEmployeesQuery(undefined, { skip: !isManager });
  const totalPayroll = data.reduce((sum, employee) => sum + employee.salary, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="A quick overview of your employee records." />
      {!isManager ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Signed in role</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{role ?? "Employee"}</p>
        </div>
      ) : isLoading ? (
        <LoadingState />
      ) : isApiForbidden(error) ? (
        <AccessDeniedState />
      ) : error ? (
        <ErrorState message="Could not connect to the Employee API." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="grid size-10 place-items-center rounded-lg bg-teal-100 text-teal-700"><Users size={20} /></span>
              <p className="mt-4 text-sm font-medium text-slate-500">Total employees</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{data.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="grid size-10 place-items-center rounded-lg bg-amber-100 text-amber-700"><Banknote size={20} /></span>
              <p className="mt-4 text-sm font-medium text-slate-500">Total annual payroll</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(totalPayroll)}</p>
            </div>
          </div>
          <Link to="/employees" className="inline-flex text-sm font-semibold text-teal-700 hover:text-teal-900">Manage employee records →</Link>
        </>
      )}
    </div>
  );
}
