import axios from "axios";
import type { Application, ApplicationFormData } from "../types/application";

const API_BASE_URL = "https://mini-job-application-tracker-60yu.onrender.com/applications";

export const getApplications = async (
  status?: string,
  search?: string
): Promise<Application[]> => {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  if (search) params.search = search;

  const response = await axios.get<Application[]>(API_BASE_URL, { params });
  return response.data;
};

export const getApplicationById = async (id: string): Promise<Application> => {
  const response = await axios.get<Application>(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createApplication = async (
  data: ApplicationFormData
): Promise<Application> => {
  const response = await axios.post<Application>(API_BASE_URL, data);
  return response.data;
};

export const updateApplication = async (
  id: string,
  data: Partial<ApplicationFormData>
): Promise<Application> => {
  const response = await axios.patch<Application>(`${API_BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};