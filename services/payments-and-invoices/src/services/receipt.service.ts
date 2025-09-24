import { ReceiptDto } from '../dtos/receipt.dto';
import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs';
import * as pdf from 'html-pdf';

export const generateReceiptPDF = async (dto: ReceiptDto): Promise<Buffer> => {
  const templatePath = path.join(__dirname, '../templates/receipt.ejs');
  const template = fs.readFileSync(templatePath, 'utf-8');

  const html = ejs.render(template, { ...dto }); // ✅ Spread the DTO here

  return new Promise((resolve, reject) => {
    pdf.create(html, { format: 'A4' }).toBuffer((err, buffer) => {
      if (err) reject(err);
      else resolve(buffer);
    });
  });
};
