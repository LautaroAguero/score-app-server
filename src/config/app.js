import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import routes from "../api/v1/index.js";
import cookierParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookierParser());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

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
