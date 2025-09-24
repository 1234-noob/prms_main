import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv"; 
import { Organization } from "../entities/organization.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  
  // host: process.env.DB_HOST || "localhost",
  // port: parseInt(process.env.DB_PORT || "3306"),
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME, 
  host: process.env.DB_HOST || "organization-management-database-service", 
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "organization_management",
  entities: [Organization],
  synchronize: false,
  logging: false,
});

AppDataSource.initialize()
  .then(() => console.log("✅ Database connected!"))
  .catch((err) => console.error("❌ Database connection error:", err));
   
