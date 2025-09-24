import { Router } from "express";
import { PropertyService } from "../services/property.service";

const router = Router();
const propertyService = new PropertyService();

router.post("/", async (req, res) => {
  const newProperty = await propertyService.createProperty(req.body);
  res.json(newProperty);
});

router.get("/", async (req, res) => {
  const properties = await propertyService.getAllProperties();
  res.json(properties);
});

router.get("/:id", async (req, res) => {
  const property = await propertyService.getPropertyById(Number(req.params.id));
  res.json(property);
});

router.delete("/:id", async (req, res) => {
  await propertyService.deleteProperty(Number(req.params.id));
  res.json({ message: "Deleted successfully" });
});

export default router;
