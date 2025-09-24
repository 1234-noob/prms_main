import { Router } from "express";
import { PropertyPartService } from "../services/propertyPart.service";

const router = Router();
const propertyPartService = new PropertyPartService();

router.post("/", async (req, res) => {
  const newPropertyPart = await propertyPartService.createPropertyPart(req.body);
  res.json(newPropertyPart);
});

router.get("/", async (req, res) => {
  const propertyParts = await propertyPartService.getAllPropertyParts();
  res.json(propertyParts);
});

router.get("/:id", async (req, res) => {
  const propertyPart = await propertyPartService.getPropertyPartById(Number(req.params.id));
  res.json(propertyPart);
});

router.delete("/:id", async (req, res) => {
  await propertyPartService.deletePropertyPart(Number(req.params.id));
  res.json({ message: "Deleted successfully" });
});

export default router;
