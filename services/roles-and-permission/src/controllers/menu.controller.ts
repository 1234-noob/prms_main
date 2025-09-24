import { Router } from "express";
import { MenuService } from "../services/menu.service";
import { CreateMenuDto } from "../dtos/menu/create-menu.dto";
import { UpdateMenuDto } from "../dtos/menu/update-menu.dto";

const router = Router();
const menuService = new MenuService();

router.get("/", async (req, res) => {
  const menus = await menuService.findAll();
  res.json(menus);
});

router.get("/:id", async (req, res) => {
  const menu = await menuService.findOne(Number(req.params.id));
  res.json(menu);
});

router.post("/", async (req, res) => {
  const newMenu = await menuService.create(req.body as CreateMenuDto);
  res.json(newMenu);
});

router.put("/:id", async (req, res) => {
  const updatedMenu = await menuService.update(Number(req.params.id), req.body as UpdateMenuDto);
  res.json(updatedMenu);
});

router.delete("/:id", async (req, res) => {
  await menuService.remove(Number(req.params.id));
  res.json({ message: "Deleted successfully" });
});

export default router;
