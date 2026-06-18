export type JobType = "Internship" | "FullTime" | "PartTime";

export type ApplicationStatus = "Applied" | "Interviewing" | "Offer" | "Rejected";

export interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFormData {
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string;
}