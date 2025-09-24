import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Invoice } from "../entities/enovices.entity";
import { TemplateType } from "../entities/templates.entity";
import { Templates } from "../entities/receipt_template.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",

  // host: "localhost",
  // port: 3306,
  // username:"root",
  // password: "",
  // database: "prms_tenant", 
  host: process.env.DB_HOST || "tenant-management-database-service",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "payment_invoices",
  entities: [ Invoice,TemplateType,Templates],
  synchronize: false,
  logging: true,
});

AppDataSource.initialize()
  .then(() => console.log("✅ Database connected!"))
  .catch((err) => console.error("❌ Database connection error:", err));
 
