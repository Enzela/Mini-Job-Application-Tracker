import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Application, ApplicationStatus } from "../types/application";
import { getApplicationById } from "../services/applicationService";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-100 text-blue-700",
  Interviewing: "bg-yellow-100 text-yellow-700",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

function ViewApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const goBack = () => {
    window.location.href = "/#/";
  };

  const goToEdit = () => {
    if (id) window.location.href = "/#/edit/" + id;
  };

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (err) {
        setError("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-gray-500">
        Loading application details...
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button onClick={goBack} className="text-gray-600 hover:text-gray-900 mb-4 inline-block">
          ← Back to list
        </button>
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
          {error || "Application not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={goBack} className="text-gray-600 hover:text-gray-900 mb-4 inline-block">
        ← Back to list
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{application.companyName}</h1>
            <p className="text-gray-600">{application.jobTitle}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[application.status]}`}
          >
            {application.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Job Type</p>
            <p className="text-gray-800 font-medium">{application.jobType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Applied Date</p>
            <p className="text-gray-800 font-medium">
              {new Date(application.appliedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">Notes</p>
          <p className="text-gray-800">{application.notes || "No notes added."}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-xs text-gray-400">
          <div>
            <p>Created</p>
            <p>{new Date(application.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p>Last Updated</p>
            <p>{new Date(application.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={goBack}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={goToEdit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewApplicationPage;