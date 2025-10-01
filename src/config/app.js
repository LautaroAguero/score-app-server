import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import routes from "../api/v1/index.js";
import cookierParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookierParser());
app.use(cors());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Serve static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// Prefijo para API versionada
app.use("/api/v1", routes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
    },
  });
});

export default app;
