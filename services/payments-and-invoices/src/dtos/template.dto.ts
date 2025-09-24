
import { IsNotEmpty, IsOptional } from "class-validator";
export class CreateTemplateDto {
  @IsNotEmpty()
  organization_id!: number;

  @IsNotEmpty()
  template_type_id!: number;

  @IsNotEmpty()
  html_content!: string;
  // layout_type!: string;

  // show_discount?: boolean;
  // show_qr_code?: boolean;
  @IsNotEmpty()
  is_active?: boolean;
}

// export class CreateTemplateDto {
//     organization_id?: number;
//     template_type_id?: number;
//     layout_type?: string;
//     logo_url?: string;
//     primary_color?: string;
//     font_family?: string;
//     show_discount?: boolean;
//     show_qr_code?: boolean;
//     custom_labels?: Record<string, string>;
//     footer_note?: string;
//     date_format?: string;
//     currency_format?: string;
//     receipt_background_url?: string;
//     is_active?: boolean;
// }


export class CreateTemplateTypeDto {
  @IsNotEmpty()
  type!: string;

  @IsNotEmpty()
  description!: string;

 
}

