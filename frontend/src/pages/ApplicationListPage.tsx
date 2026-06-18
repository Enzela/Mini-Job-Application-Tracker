import { useEffect, useState } from "react";
import type { Application, ApplicationStatus } from "../types/application";
import { getApplications, deleteApplication } from "../services/applicationService";

const STATUS_OPTIONS: ApplicationStatus[] = ["Applied", "Interviewing", "Offer", "Rejected"];

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-100 text-blue-700",
  Interviewing: "bg-yellow-100 text-yellow-700",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

function ApplicationListPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getApplications(statusFilter || undefined, searchQuery || undefined);
      setApplications(data);
    } catch (err) {
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, searchQuery]);

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      setDeleteId(null);
    } catch (err) {
      setError("Failed to delete application.");
    }
  };

  const goToAdd = () => {
    window.location.href = "/add";
  };

  const goToView = (id: string) => {
    window.location.href = "/view/" + id;
  };

  const goToEdit = (id: string) => {
    window.location.href = "/edit/" + id;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Job Applications</h1>
        <button
          onClick={goToAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Application
        </button>
      </div>

      <div className="mb-4 flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search by company or job title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-72"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No applications found. Add your first one!
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="p-3">Company</th>
                <th className="p-3">Job Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Applied Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-t border-gray-100">
                  <td className="p-3 font-medium text-gray-800">{app.companyName}</td>
                  <td className="p-3 text-gray-600">{app.jobTitle}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">
                    {new Date(app.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => goToView(app.id)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => goToEdit(app.id)}
                      className="text-amber-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(app.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this application? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationListPage;