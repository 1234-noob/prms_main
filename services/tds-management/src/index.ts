import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/AppDataSource";
import path from "path";
import tdsRoutes from "./controllers/tds.controller";

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

const PORT = Number(process.env.PORT) || 3008;
// greg
AppDataSource.initialize().then(() => {
  console.log("✅ Database Connected");

  app.use("/api/tds", tdsRoutes);

  app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
});

