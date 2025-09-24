import { Router } from "express";
import { RoleService } from "../services/role.service";
import { AddPermissionsDto } from "../dtos/role/add-permissions.dto";
import { CreateRoleDto } from "../dtos/role/create-role.dto";
import { RemovePermissionDto } from "../dtos/role/remove-permission.dto";

const router = Router();
const roleService = new RoleService();

router.get("/", async (req, res) => {
  const roles = await roleService.findAll();
  res.json(roles);
});

router.get("/:id", async (req, res) => {
  const role = await roleService.findOne(Number(req.params.id));
  res.json(role);
});

router.post("/", async (req, res) => {
  const newRole = await roleService.create(req.body as CreateRoleDto);
  res.json(newRole);
});

router.put("/:roleId/permissions", async (req, res) => {
  const updatedRole = await roleService.addPermissions(
    Number(req.params.roleId),
    (req.body as AddPermissionsDto).permissions.map(p => p.permission_id)
  );
  res.json(updatedRole);
});

router.delete("/:id", async (req, res) => {
  await roleService.remove(Number(req.params.id));
  res.json({ message: "Deleted successfully" });
});

router.put("/:role_id/permissions", async (req, res) => {
  const updatedRole = await roleService.assignPermissionsToRole(
    Number(req.params.role_id),
    req.body as number[]
  );
  res.json(updatedRole);
});

router.get("/with-permissions", async (req, res) => {
  const rolesWithPermissions = await roleService.findAllWithPermissions();
  res.json(rolesWithPermissions);
});

router.delete("/:role_id/permissions/:permission_id", async (req, res) => {
  const removePermissionDto: RemovePermissionDto = {
    role_id: Number(req.params.role_id),
    permission_id: Number(req.params.permission_id),
  };
  const updatedRole = await roleService.removePermissionFromRole(removePermissionDto);
  res.json(updatedRole);
});

export default router;
