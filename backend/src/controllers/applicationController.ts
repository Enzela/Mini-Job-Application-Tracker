import { Request, Response } from "express";
import prisma from "../config/prisma";

// GET /applications — list all, with optional ?status= and ?search=
export const getApplications = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    const applications = await prisma.application.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(search
          ? {
              OR: [
                { companyName: { contains: search as string, mode: "insensitive" } },
                { jobTitle: { contains: search as string, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// GET /applications/:id — get single application
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const application = await prisma.application.findUnique({ where: { id } });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch application" });
  }
};

// POST /applications — create new application
export const createApplication = async (req: Request, res: Response) => {
  try {
    const { companyName, jobTitle, jobType, status, appliedDate, notes } = req.body;

    if (!companyName || companyName.trim().length < 2) {
      return res.status(400).json({ error: "Company name must be at least 2 characters" });
    }
    if (!jobTitle || jobTitle.trim().length === 0) {
      return res.status(400).json({ error: "Job title is required" });
    }
    if (!appliedDate) {
      return res.status(400).json({ error: "Applied date is required" });
    }

    const application = await prisma.application.create({
      data: {
        companyName,
        jobTitle,
        jobType,
        status: status || "Applied",
        appliedDate: new Date(appliedDate),
        notes,
      },
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to create application" });
  }
};

// PATCH /applications/:id — update application
export const updateApplication = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { companyName, jobTitle, jobType, status, appliedDate, notes } = req.body;

    const existing = await prisma.application.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (companyName !== undefined && companyName.trim().length < 2) {
      return res.status(400).json({ error: "Company name must be at least 2 characters" });
    }

    const application = await prisma.application.update({
      where: { id },
      data: {
        ...(companyName !== undefined && { companyName }),
        ...(jobTitle !== undefined && { jobTitle }),
        ...(jobType !== undefined && { jobType }),
        ...(status !== undefined && { status }),
        ...(appliedDate !== undefined && { appliedDate: new Date(appliedDate) }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to update application" });
  }
};

// DELETE /applications/:id — delete application
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.application.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }

    await prisma.application.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete application" });
  }
};