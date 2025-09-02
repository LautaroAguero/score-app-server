import dotenv from "dotenv";
import { environment } from "./config/environment.js";
import app from "./config/app.js";
import { connectDB } from "./config/database.js";

dotenv.config();

const PORT = environment.PORT;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

startServer();
