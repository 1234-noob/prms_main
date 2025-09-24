import { Router } from "express";
import { PropertyService } from "../services/property.service";

const router = Router();
const svc = new PropertyService();

router.get("/test", async (req, res) => {
  const response = {
    message: "greeting from Nilesh",
    microservice: "Property"
  }
  res.json(response);
});

router.post("/", async (req, res) => {
  const prop = await svc.createProperty(req.body);
  res.json(prop);
});

router.get("/", async (req, res) => {
  const { isActive, organization_id } = req.query;
  const filter: any = {};
  if (typeof isActive === "string")
    filter.isActive = isActive === "true";
  if (typeof organization_id === "string")
    filter.organization_id = Number(organization_id);

  res.json(await svc.getAllProperties(filter));
});

router.get("/:id", async (req, res) => {
  res.json(await svc.getPropertyById(Number(req.params.id)));
});

router.put("/:id", async (req, res) => {
  res.json(await svc.updateProperty(Number(req.params.id), req.body));
});

router.delete("/:id", async (req, res) => {
  await svc.deleteProperty(Number(req.params.id));
  res.json({ message: "Deleted successfully" });
});

export default router;
