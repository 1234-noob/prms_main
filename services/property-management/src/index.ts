import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/AppDataSource";
import propertyRoutes from "./controllers/property.controller";
import propertyPartRoutes from "./controllers/propertyPart.controller";

const app = express();
app.use(express.json());
app.use(cors());
 
const PORT = process.env.PORT || 3009;
//gvrege
AppDataSource.initialize().then(() => {
  console.log("Database Connected");

  app.use("/api/properties", propertyRoutes);
  app.use("/api/propertypart", propertyPartRoutes);

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

