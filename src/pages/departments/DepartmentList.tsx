import {
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { PageHeader } from "../../components/common/PageHeader";
import {
  ErrorState,
  LoadingState,
} from "../../components/common/StateMessage";

import { Button } from "../../components/ui/Button";

import { getApiErrorMessage } from "../../lib/apiError";

import {
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
} from "../../redux/api/departmentApi";

export default function DepartmentList() {
  const [search, setSearch] = useState("");

  const {
    data = [],
    isLoading,
    error,
  } = useGetDepartmentsQuery();

  const [deleteDepartment, { isLoading: deleting }] =
    useDeleteDepartmentMutation();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return query
      ? data.filter((department) =>
          `${department.name} ${department.description}`
            .toLowerCase()
            .includes(query)
        )
      : data;
  }, [data, search]);

  const handleDelete = async (
    id: number,
    name: string
  ) => {
    if (
      !window.confirm(
        `Delete ${name}? This action cannot be undone.`
      )
    )
      return;

    try {
      await deleteDepartment(id).unwrap();

      toast.success("Department deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Departments"
        description="Manage departments."
        action={
          <Link to="/departments/new">
            <Button>
              <Plus size={17} />
              Add Department
            </Button>
          </Link>
        }
      />

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search departments..."
          className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm"
        />
      </div>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message="Could not load departments." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3">
                    Department
                  </th>

                  <th className="px-5 py-3">
                    Description
                  </th>

                  <th className="px-5 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((department) => (
                  <tr key={department.id}>
                    <td className="px-5 py-4 font-semibold">
                      {department.name}
                    </td>

                    <td className="px-5 py-4">
                      {department.description}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/departments/${department.id}/edit`}
                          className="grid size-9 place-items-center rounded-lg border"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          disabled={deleting}
                          onClick={() =>
                            handleDelete(
                              department.id,
                              department.name
                            )
                          }
                          className="grid size-9 place-items-center rounded-lg border border-red-200 text-red-600"
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

          {filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-500">
              No departments found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}