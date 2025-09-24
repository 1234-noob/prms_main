import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/AppDataSource";
import tenantRoutes from "./controllers/tenant.controller";
import contractRoutes from "./controllers/contract.controller";


const app = express();
app.use(express.json());
app.use(cors());

const PORT = Number(process.env.PORT) || 3008;
// greg
AppDataSource.initialize().then(() => {
  console.log("✅ Database Connected");

  app.use("/api/tenants", tenantRoutes);
  app.use("/api/contracts", contractRoutes);
 

  app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
});

