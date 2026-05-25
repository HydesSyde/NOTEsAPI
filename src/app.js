import express from "express";
import http from "http";
import health from "./health.js";

const app = express();

app.use(express.json());
app.use("/api/v1/notes/health", health);

export default app;
