import express from 'express';
// import mysql from 'mysql2/promise';
import cors from "cors";
import { AppDataSource } from "./config/AppDataSource";
import organizationRoutes from "./controllers/organization.controller";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = Number(process.env.PORT) || 3005;
// fhgurghwrghrigsngtji
AppDataSource.initialize().then(() => {
  console.log("Database Connected");

  app.use("/api/organizations", organizationRoutes);

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
});

