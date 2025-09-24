import { Router } from "express";
import { OrganizationService } from "../services/organization.service";

const router = Router();
const organizationService = new OrganizationService();


router.get("/test", async (req, res) => {
  const response = {
    message: "greeting from Nilesh",
    microservice: "Organisation"
  }
  res.json(response);
});

router.post("/", async (req, res) => {
  const newOrg = await organizationService.createOrganization(req.body);
  res.json(newOrg);
});

router.get("/", async (req, res) => {
  // optional ?isActive=true or false
  const { isActive } = req.query;
  const filter: { isActive?: boolean } = {};
  if (typeof isActive === "string") {
    filter.isActive = isActive.toLowerCase() === "true";
  }
  const organizations = await organizationService.getAllOrganizations(filter);
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
