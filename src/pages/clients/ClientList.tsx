import { Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "../../components/common/PageHeader";
import { AccessDeniedState, ErrorState, LoadingState } from "../../components/common/StateMessage";
import { getApiErrorMessage, isApiForbidden } from "../../lib/apiError";
import { getAuthRole } from "../../lib/auth";
import { useDeleteClientMutation, useGetClientsQuery } from "../../redux/api/clientApi";

export default function ClientList() {
  const [search, setSearch] = useState("");
  const isManager = getAuthRole() === "Manager";
  const { data = [], isLoading, error } = useGetClientsQuery();
  const [deleteClient, { isLoading: deleting }] = useDeleteClientMutation();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? data.filter((client) =>
          `${client.clientName} ${client.phoneNumber} ${client.projectName}`.toLowerCase().includes(query),
        )
      : data;
  }, [data, search]);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) return;

    try {
      await deleteClient(id).unwrap();
      toast.success("Client deleted");
    } catch (deleteError) {
      console.error("Delete client failed", deleteError);
      toast.error(getApiErrorMessage(deleteError));
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Clients" description="View and search client records." />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search clients..."
          className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isApiForbidden(error) ? (
        <AccessDeniedState />
      ) : error ? (
        <ErrorState message="Could not load clients." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Project</th>
                  {isManager && <th className="px-5 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">{client.clientName}</td>
                    <td className="px-5 py-4 text-slate-600">{client.phoneNumber}</td>
                    <td className="px-5 py-4 text-slate-600">{client.projectName}</td>
                    {isManager && (
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            disabled={deleting}
                            onClick={() => handleDelete(client.id, client.clientName)}
                            className="grid size-9 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            aria-label={`Delete ${client.clientName}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-500">
              {search ? "No clients match your search." : "No clients yet."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
