// src/controllers/tds.controller.ts
import { Router, Request, Response, NextFunction } from "express";
import { TdsService } from "../services/tds.service";
import multer from "multer";
import path from "path";

const router = Router();
const svc = new TdsService();

// ── Multer setup ───────────────────────────────────────────────────────────────

// Store files under services/tds-management/uploads
const upload = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, "..", "..", "uploads"));
      },
      filename: (_req, file, cb) => {
        const unique = `tds-${Date.now()}-${file.originalname}`;
        cb(null, unique);
      },
    }),
  });

  // Augment Request so TS knows about req.file
interface MulterRequest extends Request {
    file?: Express.Multer.File;
  }
  

// Health check
router.get("/test", async (_req, res) => {
  res.json({
    message: "greeting from Nilesh",
    microservice: "TDS Management",
  });
});

// Create TDS deduction + upload receipt
router.post(
    "/",
    upload.single("receipt"),
    async (
      req: MulterRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        if (!req.file) {
          res.status(400).json({ error: "Receipt file is required" });
          return;
        }
  
        const receiptUrl = `/uploads/${req.file.filename}`;
        const dto = {
          ...req.body,
          receipt_url: receiptUrl,
        };
        const created = await svc.createTds(dto);
  
        res.json(created);
        return;
      } catch (err) {
        next(err);
      }
    }
  );



// Get all TDS deductions
router.get("/", async (_req: Request, res: Response) => {
  const all = await svc.getAllTds();
  res.json(all);
});

// Get a single TDS deduction by ID
router.get<{ id: string }>(
  "/:id",
  async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const rec = await svc.getTdsById(Number(req.params.id));
      if (!rec) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(rec);
    } catch (err) {
      next(err);
    }
  }
);

// **New**: Download the receipt file for a TDS record
router.get<{ id: string }>(
    "/:id/receipt",
    async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
      try {
        const rec = await svc.getTdsById(Number(req.params.id));
        if (!rec) {
          res.status(404).json({ error: "TDS record not found" });
          return;
        }
        if (!rec.receipt_url) {
          res.status(404).json({ error: "No receipt uploaded for this record" });
          return;
        }
  
        // Extract filename from the stored URL (/uploads/<filename>)
        const filename = rec.receipt_url.replace(/^\/uploads\//, "");
        const filePath = path.join(__dirname, "..", "..", "uploads", filename);
  
        // Stream the file
        res.sendFile(filePath, (err) => {
          if (err) next(err);
        });
        return;
      } catch (err) {
        next(err);
      }
    }
  );

// Update a TDS deduction
router.put<{ id: string }>(
  "/:id",
  async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updated = await svc.updateTds(Number(req.params.id), req.body);
      if (!updated) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

// Delete a TDS deduction
router.delete<{ id: string }>(
  "/:id",
  async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await svc.deleteTds(Number(req.params.id));
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
