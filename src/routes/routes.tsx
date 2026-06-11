import { Navigate, type RouteObject } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import EmployeeCreate from "../pages/employees/EmployeeCreate";
import EmployeeEdit from "../pages/employees/EmployeeEdit";
import EmployeeList from "../pages/employees/EmployeeList";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "login", element: <Navigate to="/" replace /> },
      { path: "employees", element: <EmployeeList /> },
      { path: "employees/new", element: <EmployeeCreate /> },
      { path: "employees/:id/edit", element: <EmployeeEdit /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
