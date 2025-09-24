import { Organization } from './../../../organization-management/src/entities/organization.entity';
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv"; 
import { Role } from "../entities/role.entity";
import { Permission } from "../entities/permission.entity";
import { Menu } from "../entities/menu.entity";
import { Submenu } from "../entities/submenu.entity";




dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "organization-management-database-service", 
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "nilesh",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "organization_management",
  entities: [Organization],
  synchronize: true,
  logging: false,
});

AppDataSource.initialize()
  .then(() => console.log("✅ Database connected!"))
  .catch((err) => console.error("❌ Database connection error:", err));
  