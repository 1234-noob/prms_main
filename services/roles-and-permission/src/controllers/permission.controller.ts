import { Router } from "express";
import { PermissionService } from "../services/permission.service";
import { CreatePermissionDto } from "../dtos/permission/create-permission.dto";
import { UpdatePermissionDto } from "../dtos/permission/update-permission.dto";

const router = Router();
const permissionService = new PermissionService();

router.post("/", async (req, res) => {
  const newPermission = await permissionService.create(req.body as CreatePermissionDto);
  res.json(newPermission);
});

router.get("/", async (req, res) => {
  const permissions = await permissionService.findAll();
  res.json(permissions);
});

router.put("/:permission_id", async (req, res) => {
  const updatedPermission = await permissionService.update(Number(req.params.permission_id), req.body as UpdatePermissionDto);
  res.json(updatedPermission);
});

router.delete("/:permission_id", async (req, res) => {
  await permissionService.remove(Number(req.params.permission_id));
  res.json({ message: "Deleted successfully" });
});

export default router;
