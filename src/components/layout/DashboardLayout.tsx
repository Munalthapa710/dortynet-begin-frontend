import { BriefcaseBusiness, ClipboardList, LayoutDashboard, LogOut, Menu, Users, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAuthSession, getAuthRole, type AuthRole } from "../../lib/auth";

const managerRoles: AuthRole[] = ["Manager"];

const navigation = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
  { label: "Employees", to: "/employees", icon: Users, end: false },
  { label: "Departments", to: "/departments", icon: ClipboardList, end: false },
  { label: "Assign Tasks", to: "/assign-tasks", icon: ClipboardList, end: false, roles: managerRoles },

] satisfies Array<{
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  end: boolean;
  roles?: AuthRole[];
}>;

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const role = getAuthRole();
  const visibleNavigation = navigation.filter((item) => !item.roles || (role && item.roles.includes(role)));

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 bg-slate-950 text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-2 font-bold">
            <span className="grid size-9 place-items-center rounded-lg bg-teal-600">
              <BriefcaseBusiness size={19} />
            </span>
            Admin
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={21} />
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {visibleNavigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-teal-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && <button className="fixed inset-0 z-20 bg-slate-950/50 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu overlay" />}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button className="mr-3 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={21} />
          </button>
          <p className="text-sm font-semibold text-slate-700">Employee Management</p>
          <button
            onClick={handleLogout}
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
