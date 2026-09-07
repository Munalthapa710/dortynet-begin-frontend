import { Navigate, type RouteObject } from "react-router-dom";

import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { DashboardLayout } from "../components/layout/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

import EmployeeList from "../pages/employees/EmployeeList";
import EmployeeCreate from "../pages/employees/EmployeeCreate";
import EmployeeEdit from "../pages/employees/EmployeeEdit";

import DepartmentList from "../pages/departments/DepartmentList";
import DepartmentCreate from "../pages/departments/DepartmentCreate";
import DepartmentEdit from "../pages/departments/DepartmentEdit";

import AssignTaskPage from "../pages/assign-tasks/AssignTaskPage";

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "login",
        element: <Navigate to="/login" replace />,
      },

      // Employees
      {
        path: "employees",
        element: <EmployeeList />,
      },
      {
        path: "employees/new",
        element: (
          <ProtectedRoute allowedRoles={["Manager"]}>
            <EmployeeCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "employees/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["Manager"]}>
            <EmployeeEdit />
          </ProtectedRoute>
        ),
      },

      // Departments
      {
        path: "departments",
        element: (
          <ProtectedRoute >
            <DepartmentList />
          </ProtectedRoute>
        ),
      },
      {
        path: "departments/new",
        element: (
          <ProtectedRoute allowedRoles={["Manager"]}>
            <DepartmentCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "departments/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["Manager"]}>
            <DepartmentEdit />
          </ProtectedRoute>
        ),
      },

      // Assign Tasks
      {
        path: "assign-tasks",
        element: (
          <ProtectedRoute allowedRoles={["Manager"]}>
            <AssignTaskPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
