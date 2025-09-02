import dotenv from "dotenv";

dotenv.config();

export const environment = {
  PORT: process.env.PORT || 4000,
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017",
};
