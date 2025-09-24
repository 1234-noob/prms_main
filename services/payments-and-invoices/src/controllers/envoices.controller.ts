
import { Router, Request, Response, NextFunction } from "express";

import { InvoiceService } from "../services/invoice.service";
import { CreateInvoiceDto } from "../dtos/create-invoice.dto";
// import { createBulkInvoices } from "../dtos/create-invoice.dto
import { UpdateInvoiceDto } from "../dtos/update-invoice.dto";
import { validateDto } from "../middlewares/validate";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { validateDtoArray } from "../middlewares/validateDtoArray";
import multer from 'multer'
import * as XLSX from 'xlsx'
import { excelDateToIsoString } from "../utils/date.utils";
import { generateReceiptPDF } from "../services/receipt.service";
import { ReceiptDto } from "../dtos/receipt.dto";
import * as path from 'path';
import * as fs from 'fs';
import { TemplateService } from "../services/template.service";
import { renderWithData, TemplateCode } from "../utils/template.uitls";

const router = Router();
const svc = new InvoiceService();
const templateSvc = new TemplateService();
const upload = multer({ storage: multer.memoryStorage() })

interface MulterRequest extends Request {
  file: Express.Multer.File
}
// Test route



router.get("/", async (req: Request, res: Response) => {
  try {
    const invoices = await svc.fetchInvoices();
    res.json(invoices);
  } catch (error: any) {
    console.error("Error fetching invoices:", error.message);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});







// router.get<{ id: string }>(
//   "/:id/receipt",
//   async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const invoiceId = parseInt(req.params.id, 10);
//       if (isNaN(invoiceId)) {
//         res.status(400).send("Invalid invoice ID");
//         return;
//       }

//       const invoice = await svc.fetchInvoiceById(invoiceId);
//       if (!invoice) {
//         res.status(404).send("Invoice not found");
//         return;
//       }

//       // Fetch template (can be null)
//       let template = await templateSvc.fetchActiveByOrganizationId(invoice.organization_id);

//       // If null, assign full fallback including template_type
//       if (!template) {
//         template = {
//           template_type: {
//             template_file_path: "templates/a4.pug",
//           },
//           html_content:`<div style='border: 2px solid #e2e8f0; padding: 24px; border-radius: 12px; font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>
//  <h1 style='font-size: 28px; font-weight: bold; color: #1e40af; background-color: transparent; text-align: center; padding: 0px; margin: 0px 0px 16px 0px; border-radius: 0px;'>INVOICE</h1>
//  <div style='display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: 600; color: #374151; background-color: #f8fafc; text-align: left; padding: 12px; margin: 8px 0px; border-radius: 8px;'><span style='font-weight: 600;'>Client Name:</span><span style='font-weight: 500;'>{{invoice.tenant_name}}</span></div>
//  <div style='display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: bold; color: #374151; background-color: #f8fafc; text-align: left; padding: 12px; margin: 8px 0px; border-radius: 8px;'><span style='font-weight: 600;'>Amount:</span><span style='font-weight: 500;'>{{invoice.amount}}</span></div>
//  <div style='display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: normal; color: #374151; background-color: #f8fafc; text-align: left; padding: 12px; margin: 8px 0px; border-radius: 8px;'><span style='font-weight: 600;'>Due date:</span><span style='font-weight: 500;'>{{invoice.due_date}}</span></div>
//  <div style='display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: normal; color: #374151; background-color: #f8fafc; text-align: left; padding: 12px; margin: 8px 0px; border-radius: 8px;'><span style='font-weight: 600;'>Status:</span><span style='font-weight: 500;'>{{invoice.status}}</span></div>
//  <div style='display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: normal; color: #374151; background-color: #f8fafc; text-align: left; padding: 12px; margin: 8px 0px; border-radius: 8px;'><span style='font-weight: 600;'>Frequency:</span><span style='font-weight: 500;'>{{invoice.frequency}}</span></div>
//  <div style='display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: normal; color: #374151; background-color: #f8fafc; text-align: left; padding: 12px; margin: 8px 0px; border-radius: 8px;'><span style='font-weight: 600;'>Company Marchant:</span><span style='font-weight: 500;'>{{invoice.merchant}}</span></div>
//  </div>`,
//           font_family: "Arial",
//           primary_color: "#000",
//           logo_url: null,
//           show_discount: false,
//           show_qr_code: false,
//           custom_labels: {
//             invoice: "Invoice",
//             client: "Client",
//             date: "Date",
//           },
//           footer_note: "Thank you for your business.",
//           receipt_background_url: "",
//         } as any;
//       }

//       // Safe path handling
//       const layoutPath =  "templates/a4.pug";
//       const layoutName = layoutPath.split("/").pop()?.replace(".pug", "") || "a4";
//       const htmlContent = renderWithData(template!.html_content || "", { invoice });
//       res.render(`templates/${layoutName}`, {
//         invoice,
//         htmlContent,
//       });
//     } catch (error: any) {
//       console.error("❌ Error rendering receipt:", error.message);
//       res.status(500).send("Failed to render receipt");
//     }
//   }
// );



router.get<{ id: string; kind: 'invoice' | 'receipt' }>(
  "/:id/:kind(invoice|receipt)",
  async (req: Request<{ id: string; kind: 'invoice' | 'receipt' }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const invoiceId = Number(req.params.id);
      if (Number.isNaN(invoiceId)) {
        res.status(400).send("Invalid invoice ID");
        return;
      }

      const invoice = await svc.fetchInvoiceById(invoiceId);
      if (!invoice) {
        res.status(404).send("Invoice not found");
        return;
      }

      // Decide the template type from the URL
      const kind = req.params.kind.toUpperCase() as 'INVOICE' | 'RECEIPT';

      console.log(kind);
      const templateType: TemplateCode =
        kind === 'RECEIPT' ? TemplateCode.RECEIPT : TemplateCode.INVOICE;
      
      // Prefer active template for this org **and type**
      let template = await templateSvc.fetchActiveByOrgAndType(invoice.organization_id, templateType);

      // Fallback if none configured
      if (!template) {
        const title = kind; // 'INVOICE' or 'RECEIPT'
        template = {
          template_type: {
            code: templateType,
            template_file_path: "templates/a4.pug",
          },
          html_content: `
<div style='border: 2px solid #e2e8f0; padding: 24px; border-radius: 12px; font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);'>
  <h1 style='font-size: 28px; font-weight: bold; color: #1e40af; text-align: center; margin: 0 0 16px;'>${title}</h1>
  <div style='display:flex; justify-content:space-between; font-size:16px; background:#f8fafc; padding:12px; margin:8px 0; border-radius:8px;'><span>Client Name:</span><span>{{invoice.tenant_name}}</span></div>
  <div style='display:flex; justify-content:space-between; font-size:16px; background:#f8fafc; padding:12px; margin:8px 0; border-radius:8px;'><span>Amount:</span><span>{{invoice.amount}}</span></div>
  <div style='display:flex; justify-content:space-between; font-size:16px; background:#f8fafc; padding:12px; margin:8px 0; border-radius:8px;'><span>${title === 'RECEIPT' ? 'Paid date' : 'Due date'}:</span><span>{{invoice.due_date}}</span></div>
  <div style='display:flex; justify-content:space-between; font-size:16px; background:#f8fafc; padding:12px; margin:8px 0; border-radius:8px;'><span>Status:</span><span>{{invoice.status}}</span></div>
</div>`,
          font_family: "Arial",
          primary_color: "#000",
          logo_url: null,
          show_discount: false,
          show_qr_code: false,
          custom_labels: { invoice: kind, client: "Client", date: "Date" },
          footer_note: kind === 'RECEIPT' ? "Thank you for your payment." : "Thank you for your business.",
          receipt_background_url: "",
        } as any;
      }

      // Use the template's layout path if present
      const layoutPath = "templates/a4.pug";
      const layoutName = layoutPath.split("/").pop()?.replace(".pug", "") || "a4";
      const htmlContent = renderWithData(template!.html_content || "", { invoice });


      res.render(`templates/${layoutName}`, { invoice, htmlContent });
    } catch (error: any) {
      console.error("❌ Error rendering doc:", error.message);
      res.status(500).send("Failed to render document");
    }
  }
);




// // CREATE invoice
// router.post("/", async (req: Request, res: Response) => {
//   const dto: CreateInvoiceDto = req.body;
//   const invoice = await svc.createInvoice(dto);
//   res.status(201).json(invoice);
// });

router.post("/", validateDto(CreateInvoiceDto), async (req: Request, res: Response) => {
  try {
    const dto: CreateInvoiceDto = req.body;
    const invoice = await svc.createInvoice(dto);
    res.status(201).json(invoice);
  } catch (error: any) {
    console.error("Invoice creation failed:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});






// router.post('/upload-excel', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
//   try {
//     const file = (req as MulterRequest).file;

//     if (!file) {
//       res.status(400).json({ message: 'No file uploaded' });
//       return;
//     }

//     const workbook = XLSX.read(file.buffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const jsonData: CreateInvoiceDto[] = XLSX.utils.sheet_to_json(worksheet);

//     if (!Array.isArray(jsonData) || jsonData.length === 0) {
//       res.status(400).json({ message: 'Excel file contains no valid data' });
//       return;
//     }

//     const invoices = await svc.createBulkInvoices(jsonData);

//     res.status(201).json({
//       message: 'Invoices created successfully',
//       data: invoices,
//     });
//   } catch (error: any) {
//     console.error('Excel upload error:', error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });


// router.post('/upload-excel', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
//   try {
//     const file = (req as MulterRequest).file

//     if (!file) {
//       res.status(400).json({ message: 'No file uploaded' })
//       return
//     }

//     const workbook = XLSX.read(file.buffer, { type: 'buffer' })
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]]
//     const rawData = XLSX.utils.sheet_to_json(worksheet)

//     if (!Array.isArray(rawData) || rawData.length === 0) {
//       res.status(400).json({ message: 'Excel file contains no valid data' })
//       return
//     }

//     // ✅ Transform to class instances
//     const dtoArray = plainToInstance(CreateInvoiceDto, rawData)

//     // ✅ Validate each instance
//     const validationErrors: any[] = []
//     for (let i = 0; i < dtoArray.length; i++) {
//       const errors = await validate(dtoArray[i])
//       if (errors.length > 0) {
//         validationErrors.push({
//           row: i + 2, // Excel row (including header)
//           errors,
//         })
//       }
//     }

//     if (validationErrors.length > 0) {
//       res.status(400).json({
//         message: 'Validation failed for some rows',
//         validationErrors,
//       })
//       return
//     }

//     // ✅ All data valid → insert to DB
//     const invoices = await svc.createBulkInvoices(dtoArray)

//     res.status(201).json({
//       message: 'Invoices created successfully',
//       data: invoices,
//     })
//   } catch (error: any) {
//     console.error('Excel upload error:', error.message)
//     res.status(500).json({ message: 'Server error', error: error.message })
//   }
// })


router.post('/upload-excel', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = (req as MulterRequest).file;
    const { file_alias_name } = req.body; // Extract the file alias name from the form data

    // Check if file and file_alias_name are provided
    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    if (!file_alias_name) {
      res.status(400).json({ message: 'File alias name is required' });
      return;
    }

    // Read and parse the Excel file
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    // Check if the data is valid
    if (!Array.isArray(rawData) || rawData.length === 0) {
      res.status(400).json({ message: 'Excel file contains no valid data' });
      return;
    }

    // ✅ Transform to class instances
    const dtoArray = plainToInstance(CreateInvoiceDto, rawData);

    // Add file alias name to each DTO instance
    dtoArray.forEach(dto => {
      dto.file_alias_name = file_alias_name;  // Assign the file alias name to all invoices

      // Handle Excel serial date conversion for due_date if it's a number
      if (typeof dto.due_date === 'number') {
        dto.due_date = excelDateToIsoString(dto.due_date); // Convert Excel serial date to ISO date string
      }
    });

    // ✅ Validate each instance
    const validationErrors: any[] = [];
    for (let i = 0; i < dtoArray.length; i++) {
      const errors = await validate(dtoArray[i]);
      if (errors.length > 0) {
        validationErrors.push({
          row: i + 2, // Excel row (including header)
          errors,
        });
      }
    }

    // If validation errors exist, return them
    if (validationErrors.length > 0) {
      res.status(400).json({
        message: 'Validation failed for some rows',
        validationErrors,
      });
      return;
    }

    // ✅ All data valid → insert to DB
    const invoices = await svc.createBulkInvoices(dtoArray);

    res.status(201).json({
      message: 'Invoices created successfully',
      data: invoices,
    });
  } catch (error: any) {
    console.error('Excel upload error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});













router.put("/:id", (async (req: Request, res: Response) => {
  const dto: UpdateInvoiceDto = req.body;
  const updated = await svc.updateInvoice(+req.params.id, dto);
  if (!updated) {
    return res.status(404).json({ message: "Invoice not found" });
  }
  res.json(updated);
}) as any);


router.delete<{ id: string }>(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const deleted = await svc.deleteInvoice(id);

      if (!deleted) {
        res.status(404).json({ message: "Invoice not found" });
        return;
      }

      res.json({ message: "Invoice deleted successfully" });
      return;
    } catch (error: any) {
      console.error("Error deleting invoice:", error.message);
      res.status(500).json({ error: "Failed to delete invoice" });
      return;
    }
  }
);


router.post("/generate-receipt", async (req: Request, res: Response) => {
  try {
    const dto: ReceiptDto = {
      ...req.body,
      date: new Date().toLocaleDateString(),
    };

    const pdfBuffer = await generateReceiptPDF(dto);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=receipt-${dto.receiptId}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (error: any) {
    console.error("Receipt generation failed:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


router.get<{ id: string }>("/receipt/:id", async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoiceId = req.params.id;
    const filePath = path.join(__dirname, `../../receipts/receipt-${invoiceId}.pdf`);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: "Receipt not found" });
      return;
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=receipt-${invoiceId}.pdf`,
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error: any) {
    console.error("Error serving receipt:", error.message);
    res.status(500).json({ error: "Failed to serve receipt" });
  }
});











export default router;
