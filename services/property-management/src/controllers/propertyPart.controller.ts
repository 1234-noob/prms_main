import { Router } from "express";
import { PropertyPartService } from "../services/propertyPart.service";

const router = Router();
const svc = new PropertyPartService();

router.get("/test", async (req, res) => {
  const response = {
    message: "greeting from Nilesh",
    microservice: "Property Part"
  }
  res.json(response);
});

router.post("/", async (req, res) => {
  res.json(await svc.createPropertyPart(req.body));
});

router.get("/", async (req, res) => {
  const { isActive, property_id } = req.query;
  const filter: any = {};
  if (typeof isActive === "string")
    filter.isActive = isActive === "true";
  if (typeof property_id === "string")
    filter.property_id = Number(property_id);

  res.json(await svc.getAllPropertyParts(filter));
});

router.get("/:id", async (req, res) => {
  res.json(await svc.getPropertyPartById(Number(req.params.id)));
});

router.put("/:id", async (req, res) => {
  res.json(await svc.updatePropertyPart(Number(req.params.id), req.body));
});

router.delete("/:id", async (req, res) => {
  await svc.deletePropertyPart(Number(req.params.id));
  res.json({ message: "Deleted successfully" });
});

export default router;
