import express from "express";
import http from "http";
import health from "./health.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
const swaggerDocument = YAML.load("./docs/openai.yaml");

app.use(express.json());
app.use("/api/v1/notes/health", health);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
