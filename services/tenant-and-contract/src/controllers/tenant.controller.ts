// src/controllers/tenant.controller.ts
import { Router,Request, Response, NextFunction } from "express";
import { TenantService } from "../services/tenant.service";
import { TenantFilterDto } from "../dtos/tenant-filter.dto";

//tenant part
import { AppDataSource } from "../config/AppDataSource";
import { TenantPropertyPart } from "../entities/tenantPropertyPart.entity";

const router = Router();
const svc = new TenantService();

const tenantPropertyPartRepo = AppDataSource.getRepository(TenantPropertyPart);


router.get("/property-parts",async (req,res) =>{
  const items = await tenantPropertyPartRepo.find({ where: { isActive: true } })
  res.json(items)
})



router.get("/test", async (req, res) => {
  const response = {
    message: "greeting from Nilesh",
    microservice: "Tenants"
  }
  res.json(response);
});

router.get("/", async (req, res) => {
  const filter: TenantFilterDto = {
    organization_id: Number(req.query.organization_id),
    property_id: Number(req.query.property_id),
    property_part_id: Number(req.query.property_part_id),
    isActive:
      req.query.isActive == null
        ? undefined
        : req.query.isActive === "true",
    createdAfter: req.query.createdAfter as string,
    includeContracts: req.query.includeContracts === "true",
    contract_id: req.query.contract_id
      ? Number(req.query.contract_id)
      : undefined,
  };

  const tenants = await svc.fetchTenants(filter);
  res.json(tenants);
});

router.get<{ id: string }>(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {    const includeContracts = req.query.includeContracts === "true";
    const tenant = await svc.fetchTenantById(
      Number(req.params.id),
      includeContracts
    );
    if (!tenant) {
      res.status(404).json({ message: "Not found" });
           return;
          }
    res.json(tenant);
    return;
  }
);


// POST, PUT, DELETE as before...

/** 1. Create tenant (inactive by default) */
router.post("/", async (req: Request, res: Response) => {
  const tenant = await svc.createTenant(req.body);
 
  res.json(tenant);
});

/** 2. Toggle tenant status */
router.patch("/:id/status", async (req: Request, res: Response) => {
  const updated = await svc.changeTenantStatus(
    +req.params.id,
    req.body.isActive
  );
  res.json(updated);
});

/** 5. Update tenant fields */
router.put("/:id", async (req: Request, res: Response) => {
  const updated = await svc.updateTenant(+req.params.id, req.body);
  res.json(updated);
});

/** 9. Delete tenant if no mappings/contracts exist */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await svc.deleteTenantConditional(+req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/** 3. Assign a tenant to an org-prop-part */
router.post(
  "/property-parts",
  async (req: Request, res: Response) => {
    const mapping = await svc.createTenantPropertyPart(req.body);
    res.json(mapping);
  }
);

/** 6. Toggle mapping status */
router.patch(
  "/property-parts/:id/status",
  async (req: Request, res: Response) => {
    const updated = await svc.updateTenantPropertyPart(+req.params.id, {
      isActive: req.body.isActive,
    });
    res.json(updated);
  }
);

/** 7. Update mapping details */
router.put(
  "/property-parts/:id",
  async (req: Request, res: Response) => {
    const updated = await svc.updateTenantPropertyPart(
      +req.params.id,
      req.body
    );
    res.json(updated);
  }
);

/** 8. Delete a tenant–property-part mapping */
router.delete(
  "/property-parts/:id",
  async (req: Request, res: Response) => {
    await svc.deleteTenantPropertyPart(+req.params.id);
    res.json({ message: "Deleted successfully" });
  }
);




export default router;






