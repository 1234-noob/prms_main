// src/controllers/contract.controller.ts
import { Router, Request, NextFunction, Response } from "express";
import { ContractService } from "../services/contract.service";
import { ContractFilterDto } from "../dtos/contract-filter.dto";
//needed for contract tenant 
import { AppDataSource } from "../config/AppDataSource";
import { ContractTenant } from "../entities/contractTenant.entity";

const router = Router();
const svc = new ContractService();
const contractTenantRepo = AppDataSource.getRepository(ContractTenant);

router.get("/test", async (req, res) => {
  const response = {
    message: "greeting from Nilesh",
    microservice: "Contract"
  }
  res.json(response);
});

router.get("/", async (req, res) => {
  const filter: ContractFilterDto = {
    organization_id: Number(req.query.organization_id),
    property_id: Number(req.query.property_id),
    property_part_id: Number(req.query.property_part_id),
    isActive:
      req.query.isActive == null ? undefined : req.query.isActive === "true",
    tds_applicable:
      req.query.tds_applicable == null
        ? undefined
        : req.query.tds_applicable === "true",
    tenant_id: req.query.tenant_id ? Number(req.query.tenant_id) : undefined,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    createdAfter: req.query.createdAfter as string,
    updatedAfter: req.query.updatedAfter as string,
  };

  const contracts = await svc.fetchContracts(filter);
  res.json(contracts);
});

router.get<{ id: string }>(
  "/:id",
async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    const contract = await svc.fetchContractById(Number(req.params.id));
    if (!contract) {
     res.status(404).json({ message: "Not found" });
     return;
    }
   res.json(contract);
   return;
  }
);


// 4. Create contract
router.post("/", async (req, res) => {
  const created = await svc.createContract(req.body);
  res.json(created);
});

// 10. Update entire contract
router.put("/:id", async (req, res) => {
  const updated = await svc.updateContract(+req.params.id, req.body);
  res.json(updated);
});

// 11. Toggle contract status
router.patch("/:id/status", async (req, res) => {
  const { isActive } = req.body;
  const updated = await svc.changeContractStatus(+req.params.id, isActive);
  res.json(updated);
});

// 12. Delete contract + mappings
router.delete("/:id", async (req, res) => {
  await svc.deleteContract(+req.params.id);
  res.json({ message: "Deleted successfully" });
});


//13. get data of tenants when using this contract id


router.get(
  "/:id/tenants",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const contractId = parseInt(req.params.id, 10);

    if (isNaN(contractId)) {
      res.status(400).json({ error: "Invalid contract ID" });
      return;
    }

    try {
      const contractTenants = await contractTenantRepo.find({
        where: { contract_id: contractId }, // matches entity property
        relations: ["tenant", "contract"],
      });
      res.json(contractTenants);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);



export default router;
