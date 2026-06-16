import { Navigate, type RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import AssignTaskPage from "../pages/assign-tasks/AssignTaskPage";
import EmployeeCreate from "../pages/employees/EmployeeCreate";
import EmployeeEdit from "../pages/employees/EmployeeEdit";
import EmployeeList from "../pages/employees/EmployeeList";

export const routes: RouteObject[] = [
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "login", element: <Navigate to="/login" replace /> },
      { path: "employees", element: <EmployeeList /> },
      { path: "employees/new", element: <EmployeeCreate /> },
      { path: "employees/:id/edit", element: <EmployeeEdit /> },
      { path: "assign-tasks", element: <AssignTaskPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
