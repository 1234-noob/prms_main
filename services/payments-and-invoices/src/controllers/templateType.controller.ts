import { Router, Request, Response } from "express";
import { TemplateService } from "../services/template.service";
import { TemplateTypeService } from "../services/templateType.service";


const svc = new TemplateTypeService();
const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const template = await svc.create(req.body);
    res.status(201).json(template);
  } catch (err: any) {
    console.error("❌ Error while creating template:", err.message || err);
    res.status(500).json({ message: "Failed to create template" });
  }
});

// Update Template
router.put<{ id: string }>("/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await svc.update(id, req.body);
    if (!updated) {
      res.status(404).json({ message: "Template not found" });
      return;
    }
    res.status(200).json(updated);
  } catch (err: any) {
    console.error("❌ Error while updating template:", err.message || err);
    res.status(500).json({ message: "Failed to update template" });
  }
});


// Get Template by ID
router.get<{ id: string }>("/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const template = await svc.getById(id);

    if (!template) {
      res.status(404).json({ message: "Template not found" }); // Client receives 404
      return;
    }

    res.status(200).json(template); // Client receives JSON
  } catch (err: any) {
    console.error("❌ Error fetching template:", err.message || err);
    res.status(500).json({ message: "Failed to fetch template" }); // Client sees 500
  }
});


// Delete Template
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) :Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await svc.delete(id);
    if (!result) {
     res.status(404).json({ message: "Template not found" });
      return ;
    }
    res.status(200).json({ message: "Template deleted successfully" });
  } catch (err: any) {
    console.error("❌ Error deleting template:", err.message || err);
    res.status(500).json({ message: "Failed to delete template" });
  }
});

// Get All Templates
router.get("/", async (_req: Request, res: Response) => {
  try {
    const templates = await svc.getAll();
    res.status(200).json(templates);
  } catch (err: any) {
    console.error("❌ Error fetching templates:", err.message || err);
    res.status(500).json({ message: "Failed to fetch templates" });
  }
});



export default router;
