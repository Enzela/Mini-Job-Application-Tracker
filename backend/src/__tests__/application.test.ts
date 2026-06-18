import request from "supertest";
import express from "express";
import applicationRoutes from "../routes/applicationRoutes";

const app = express();
app.use(express.json());
app.use("/applications", applicationRoutes);

describe("Applications API", () => {
  it("GET /applications should return 200 and an array", async () => {
    const res = await request(app).get("/applications");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});