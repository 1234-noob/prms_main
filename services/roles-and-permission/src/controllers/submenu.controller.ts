import { Router } from "express";
import { SubmenuService } from "../services/submenu.service";
import { CreateSubmenuDto } from "../dtos/submenu/create-submenu.dto";

const router = Router();
const submenuService = new SubmenuService();

router.get("/", async (req, res) => {
  const submenus = await submenuService.findAll();
  res.json(submenus);
});

router.get("/:id", async (req, res) => {
  const submenu = await submenuService.findOne(Number(req.params.id));
  res.json(submenu);
});

router.post("/", async (req, res) => {
  const newSubmenu = await submenuService.create(req.body as CreateSubmenuDto);
  res.json(newSubmenu);
});

router.delete("/:id", async (req, res) => {
  await submenuService.remove(Number(req.params.id));
  res.json({ message: "Deleted successfully" });
});

export default router;
