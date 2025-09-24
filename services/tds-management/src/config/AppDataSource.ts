import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { TdsDeduction } from "../entities/tds.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",

  // host: "localhost",
  // port: 3306,
  // username:"root",
  // password: "",
  // database: "prms_tds", 
  host: process.env.DB_HOST || "tds-management-database-service",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "tds_management",
  entities: [TdsDeduction],
  synchronize: false,
  logging: false,
});

AppDataSource.initialize()
  .then(() => console.log("✅ Database connected!"))
  .catch((err) => console.error("❌ Database connection error:", err));
 
