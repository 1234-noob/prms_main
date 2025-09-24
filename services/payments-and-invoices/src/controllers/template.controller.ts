import { Router, Request, Response } from "express";
import { TemplateService } from "../services/template.service";
import { renderWithData } from "../utils/template.uitls";


const svc = new TemplateService();
const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const template = await svc.create(req.body);
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ message: "Failed to create template" });
  }
});



router.get<{ id: string }>("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const template = await svc.getById(id);

    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }
    const invoice = {
      tenant_name: "John Doe",
      amount: 1234,
      status: "Paid",
      due_date: "2025-08-10",
      frequency: "Monthly",
      merchant: "My Company Pvt Ltd",
    };



    // Inside route
    const finalHtmlContent = renderWithData(template.html_content || '', { invoice });

    res.render("templates/a4.pug", {
      template,
      invoice,
      htmlContent: finalHtmlContent,
    });

  } catch (err) {
    console.error("Error rendering template preview:", err);
    res.status(500).send("Failed to render template preview");
  }
});


// Update Template
router.put<{ id: string }>("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await svc.update(id, req.body);
    if (!updated) {
      res.status(404).json({ message: "Template not found" });
      return;
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating template:", err);
    res.status(500).json({ message: "Failed to update template" });
  }
});



router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await svc.getAllTemplate();

    if (!data || data.length === 0) {
      res.status(404).json({
        success: false,
        message: "No templates found",
        data: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Templates fetched successfully",
      data: data,
    });
    return;
  } catch (err: any) {
    console.error("Error fetching templates:", err);

    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      error: err.message || err,
    });
    return;
  }
});

router.delete<{ id: string }>("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
     res.status(400).json({ message: "Invalid template ID" });
     return;
  }

  try {
    await svc.deleteTemplate(id);
     res.status(200).json({ message: `Template ID ${id} deleted successfully` });
      return;
    } catch (err: any) {
    console.error("Error deleting template:", err);

    // Use statusCode if attached in service, otherwise 500
    const status = err.statusCode || 500;
    const message = err.message || "Something went wrong";
     res.status(status).json({ message });
     return;
  }
});

export default router;
