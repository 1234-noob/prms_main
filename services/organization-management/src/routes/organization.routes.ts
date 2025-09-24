import { Router } from "express";
import { OrganizationService } from "../services/organization.service";

const router = Router();
const organizationService = new OrganizationService();

router.post("/", async (req, res) => {
  const newOrg = await organizationService.createOrganization(req.body);
  res.json(newOrg);
});

router.get("/", async (req, res) => {
  const organizations = await organizationService.getAllOrganizations();
  res.json(organizations);
});

router.get("/:id", async (req, res) => {
  const org = await organizationService.getOrganizationById(Number(req.params.id));
  res.json(org);
});

router.put("/:id", async (req, res) => {
  const updatedOrg = await organizationService.updateOrganization(Number(req.params.id), req.body);
  res.json(updatedOrg);
});

router.delete("/:id", async (req, res) => {
  await organizationService.deleteOrganization(Number(req.params.id));
  res.json({ message: "Deleted successfully" });
});

export default router;
