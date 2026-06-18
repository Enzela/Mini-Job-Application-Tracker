import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ApplicationFormData, JobType, ApplicationStatus } from "../types/application";
import { getApplicationById, updateApplication } from "../services/applicationService";

const JOB_TYPES: JobType[] = ["Internship", "FullTime", "PartTime"];
const STATUS_OPTIONS: ApplicationStatus[] = ["Applied", "Interviewing", "Offer", "Rejected"];

interface FormErrors {
  companyName?: string;
  jobTitle?: string;
  appliedDate?: string;
}

function EditApplicationPage() {
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<ApplicationFormData>({
    companyName: "",
    jobTitle: "",
    jobType: "Internship",
    status: "Applied",
    appliedDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");

  const goBack = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const app = await getApplicationById(id);
        setFormData({
          companyName: app.companyName,
          jobTitle: app.jobTitle,
          jobType: app.jobType,
          status: app.status,
          appliedDate: app.appliedDate.split("T")[0],
          notes: app.notes || "",
        });
      } catch (err) {
        setApiError("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName || formData.companyName.trim().length < 2) {
      newErrors.companyName = "Company name must be at least 2 characters";
    }
    if (!formData.jobTitle || formData.jobTitle.trim().length === 0) {
      newErrors.jobTitle = "Job title is required";
    }
    if (!formData.appliedDate) {
      newErrors.appliedDate = "Applied date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!id) return;
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await updateApplication(id, formData);
      window.location.href = "/";
    } catch (err) {
      setApiError("Failed to update application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-gray-500">
        Loading application details...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={goBack}
        className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
      >
        ← Back to list
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Job Application</h1>

      {apiError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{apiError}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.jobTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Applied Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.appliedDate && (
            <p className="text-red-500 text-sm mt-1">{errors.appliedDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={goBack}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Update Application"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditApplicationPage;