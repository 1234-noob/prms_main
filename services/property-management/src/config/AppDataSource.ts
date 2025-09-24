import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Property } from "../entities/property.entity";
import { PropertyPart } from "../entities/propertyPart.entity";

dotenv.config();



export const AppDataSource = new DataSource({
  type: "mysql",
  // host: process.env.DB_HOST || "localhost",
  // port: parseInt(process.env.DB_PORT || "3306"),
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD, 
  // database: process.env.DB_NAME,
  host: process.env.DB_HOST || "property-management-database-service",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "property_management",
  entities: [Property, PropertyPart],
  synchronize: false,
  logging: true,
  migrationsRun:true,

});
 
AppDataSource.initialize()
  .then(() => console.log("✅ Database connected!")) 
  .catch((err) => console.error("❌ Database connection error:", err));
 
