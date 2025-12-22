import dotenv from "dotenv";

dotenv.config();

export const environment = {
  PORT: process.env.PORT || 4000,
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017/tournaments",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-key-CHANGE-IN-PRODUCTION",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};
