import React, { useState, useEffect } from 'react';
import { X, FileText, Receipt, Code, Eye, Settings, Palette, Type, QrCode, Percent, Calendar, DollarSign, Image, ToggleLeft, ToggleRight, Plus, Trash2, Move, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface TemplateType {
  id: number;
  type: 'Invoice' | 'Receipt';
  description: string;
  is_active?: boolean; 
  created_at: string;
  updated_at: string;
}

interface Template {
  id: number;
  organization_id: number;
  template_type_id: number;
  is_active: boolean;
  html_content: string;
  layout_type: string | null;
  logo_url: string | null;
  primary_color: string | null;
  font_family: string | null;
  show_discount: boolean;
  show_qr_code: boolean;
  custom_labels: { [key: string]: string } | null;
  footer_note: string | null;
  date_format: string | null;
  currency_format: string | null;
  receipt_background_url: string | null;
  created_at: string;
  updated_at: string;
  template_type?: TemplateType;
}

interface Component {
  id: string;
  type: 'header' | 'field' | 'spacer' | 'divider' | 'text' | 'footer';
  content: string;
  variable?: string;
  style: {
    fontSize: string;
    fontWeight: string;
    color: string;
    backgroundColor: string;
    textAlign: string;
    padding: string;
    margin: string;
    borderRadius: string;
    border: string;
  };
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTemplate: (template: any) => Promise<void>;
  onSaveTemplateType: (templateType: any) => Promise<TemplateType>;
  onUpdateTemplate?: (id: number, template: any) => Promise<void>;
  onUpdateTemplateType?: (id: number, templateType: any) => Promise<void>;
  templateTypes: TemplateType[];
  editingItem?: Template | TemplateType | null;
  templates?: Template[]; 
  initialMode?: 'template-type' | 'template';
  forceMode?: boolean;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ 
  isOpen, 
  onClose, 
  onSaveTemplate,
  onSaveTemplateType,
  onUpdateTemplate,
  onUpdateTemplateType,
  templateTypes,
  editingItem = null,
  templates = [],
  initialMode = 'template-type',
  forceMode = false
}) => {
  const [creationType, setCreationType] = useState<'template-type' | 'template'>(initialMode);
  const [isEditMode, setIsEditMode] = useState(false);
  const [builderMode, setBuilderMode] = useState<'visual' | 'code'>('visual');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [showActiveWarning, setShowActiveWarning] = useState(false);
  const [existingActiveTemplate, setExistingActiveTemplate] = useState<Template | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  
  
  const [templateTypeData, setTemplateTypeData] = useState({
    type: 'Invoice' as 'Invoice' | 'Receipt',
    description: '',
    is_active: true
  });

  const [templateData, setTemplateData] = useState({
    organization_id: 1, 
    template_type_id: templateTypes.length > 0 ? templateTypes[0].id : 1,
    is_active: true,
    html_content: '',
    layout_type: '',
    logo_url: '',
    primary_color: '#004aad',
    font_family: 'Poppins',
    show_discount: false,
    show_qr_code: false,
    custom_labels: {
      invoice: 'Tax Invoice',
      client: 'Customer',
      date: 'Bill Date'
    } as { [key: string]: string },
    footer_note: '',
    date_format: 'DD-MM-YYYY',
    currency_format: 'INR',
    receipt_background_url: ''
  });

  const [components, setComponents] = useState<Component[]>([]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [lastCodeContent, setLastCodeContent] = useState<string>('');

  const requiredVariables = [
    '{{invoice.tenant_name}}',
    '{{invoice.amount}}',
    '{{invoice.due_date}}',
    '{{invoice.status}}',
    '{{invoice.frequency}}',
    '{{invoice.merchant}}'
  ];

  const availableComponents = [
    { type: 'header', label: 'Header', icon: '📋' },
    { type: 'field', label: 'Data Field', icon: '📝' },
    { type: 'text', label: 'Static Text', icon: '📄' },
    { type: 'spacer', label: 'Spacer', icon: '⬜' },
    { type: 'divider', label: 'Divider', icon: '➖' },
    { type: 'footer', label: 'Footer', icon: '📋' }
  ];

  const availableVariables = [
    { variable: '{{invoice.tenant_name}}', label: 'Client Name' },
    { variable: '{{invoice.amount}}', label: 'Amount' },
    { variable: '{{invoice.due_date}}', label: 'Due Date' },
    { variable: '{{invoice.status}}', label: 'Status' },
    { variable: '{{invoice.frequency}}', label: 'Frequency' },
    { variable: '{{invoice.merchant}}', label: 'Merchant' }
  ];

  const isTemplate = (item: Template | TemplateType): item is Template => {
    return 'html_content' in item;
  };

  
const getCurrentTemplateType = (): TemplateType | null => {
  const templateType = templateTypes.find(type => type.id === templateData.template_type_id);
  console.log('Current template type:', templateType); 
  return templateType || null;
};

  
  const getDefaultInvoiceTemplate = (): string => {
    return `<html lang="mr">
<head>
    <title>Maharashtra Government Invoice</title>
    <style>
        body {
            font-family: 'Noto Sans Devanagari', 'Mangal', Arial, sans-serif;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .document {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border: 2px solid #333;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
        }
        .main-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
            text-decoration: underline;
        }
        .sub-title {
            font-size: 14px;
            margin-bottom: 3px;
        }
        .office-details {
            font-size: 12px;
            margin-bottom: 3px;
        }
        .reference {
            text-align: left;
            margin: 20px 0;
            font-size: 13px;
        }
        .date-line {
            text-align: right;
            font-size: 13px;
            margin-bottom: 20px;
        }
        .address-section {
            margin: 20px 0;
            font-size: 13px;
        }
        .subject-line {
            margin: 15px 0;
            font-size: 13px;
            font-weight: bold;
        }
        .content-para {
            margin: 15px 0;
            font-size: 13px;
            text-align: justify;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 12px;
        }
        .invoice-table th,
        .invoice-table td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
        }
        .invoice-table th {
            background-color: #f5f5f5;
            font-weight: bold;
            text-align: center;
        }
        .amount-cell {
            text-align: right;
            font-weight: bold;
        }
        .total-row {
            background-color: #f9f9f9;
            font-weight: bold;
        }
        .footer-note {
            margin: 20px 0;
            font-size: 12px;
            text-align: justify;
        }
        .signature-section {
            margin-top: 40px;
            text-align: right;
        }
        .signature-title {
            font-size: 13px;
            font-weight: bold;
            text-decoration: underline;
        }
        .signature-name {
            font-size: 13px;
            margin: 5px 0;
        }
        .copy-line {
            margin-top: 30px;
            font-size: 12px;
            border-top: 1px solid #ccc;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="document">
        <!-- Header Section -->
        <div class="header">
            <div class="main-title">महाराष्ट्र राज्य शेती महामंडळ मर्यादित</div>
            <div class="sub-title">(महाराष्ट्र शासनाचा आर्थिक व्यवहार)</div>
            <div class="office-details">रजि. कार्यालय: २५०, शेती महामंडळ भवन, सेनापती बापट मार्ग, पुणे - ४११ ००१</div>
            <div class="office-details">फोन: २५६५०५६६, २५६५०५६३</div>
            <div class="office-details">ई-मेल: msfcpune@gmail.com</div>
        </div>

        <!-- Reference and Date -->
        <div class="reference">
            <strong>क्रमांक:</strong> {{invoice.merchant}}/केरसी वैकल्पिकसेरेटो/२०२५/
        </div>
        <div class="date-line">
            <strong>दिनांक:</strong> {{invoice.due_date}}
        </div>

        <!-- Address Section -->
        <div class="address-section">
            <div><strong>प्रिय,</strong></div>
            <div><strong>व्यवस्थापक,</strong></div>
            <div><strong>{{invoice.tenant_name}}</strong></div>
            <div><strong>केरसी चेक, साखळ एण्डप्रॉडक्ट्स,</strong></div>
            <div><strong>पुणे - १६</strong></div>
        </div>

        <!-- Subject -->
        <div class="subject-line">
            <strong>विषय:</strong> {{invoice.frequency}} रेटे माहे एप्रिल - २०२५ चे मागणी पत्राबाबत.
        </div>

        <!-- Content Paragraph -->
        <div class="content-para">
            आपण्याकडेसोबत दिनांक {{invoice.due_date}} रोजी झालेल्या करारानुसार या संकेत माहे एप्रिल २०२५ या महिन्यापासून रेटची मागणी आपल्या वतीने करण्यात येत आहे.
        </div>

        <!-- Invoice Table -->
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Sr. No.</th>
                    <th>तपशील</th>
                    <th>महिना</th>
                    <th>रक्कम रुपये</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1.</td>
                    <td>रक्कम रुपये १०२,४८/- प्रति चौ.फू. या दराने १८५७ चौ.फू. जागेचे वापरमूल्य</td>
                    <td>{{invoice.due_date}}</td>
                    <td class="amount-cell" id="row1-amount">{{invoice.amount}}/-</td>
                </tr>
                <tr>
                    <td>2.</td>
                    <td><strong>एकुण वापरमूल्य रुपये</strong></td>
                    <td>{{invoice.due_date}}</td>
                    <td class="amount-cell" id="row2-amount">{{invoice.amount}}/-</td>
                </tr>
                <tr>
                    <td>3.</td>
                    <td>रक्कम रुपये <span id="base-amount-text">{{invoice.amount}}</span>/- या रक्कमेवर १८% जीएसटी</td>
                    <td>{{invoice.due_date}}</td>
                    <td class="amount-cell" id="gst-amount">{{invoice.amount}}/-</td>
                </tr>
                <tr class="total-row">
                    <td>4.</td>
                    <td><strong>महामंडळास एकुण येय रक्कम रुपये</strong></td>
                    <td>{{invoice.due_date}}</td>
                    <td class="amount-cell"><strong id="total-amount">{{invoice.amount}}</strong></td>
                </tr>
            </tbody>
        </table>

        <!-- Footer Note -->
        <div class="footer-note">
            (अशरी रक्कम रुपये दोन लाख सदतीस हजार सातशे सात पैसे चाळीस फक्त)
        </div>

        <div class="content-para">
            तरी उपरोक्त तक्रारनुसार दरशविण्यात आलेली व महामंडळास देय असलेली थकीत रक्कम रु.२,३७,७४६.४० आपल्या बँकेतील महामंडळाच्या खात्यावर जमा करून या कार्यालयास कळवावे. ही विनंती.
        </div>

        <!-- Signature Section -->
        <div class="signature-section">
            <div class="signature-title">(सहायक महाव्यवस्थापक ऑडिट)</div>
            <div class="signature-name">श्री. पुण्य कार्यकारी (प्रशासन)</div>
            <div class="signature-name">महाराष्ट्र राज्य शेती महामंडळ, पुणे</div>
        </div>

        <!-- Copy Line -->
        <div class="copy-line">
            <strong>प्रत:</strong> विश विभाग म.रा.शे.म., पुणे यांना माहितीसाठी.
        </div>

        <!-- Status Badge -->
        <div style="margin-top: 20px; padding: 10px; background-color: #e8f4f8; border-left: 4px solid #2563eb; font-size: 14px;">
            <strong>स्थिती:</strong> {{invoice.status}}
        </div>
    </div>

    <script>
        
        function extractAmount(amountString) {
            if (!amountString) return 0;
            // Remove all non-numeric characters except decimal point and comma
            const cleanAmount = amountString.toString().replace(/[^\d.,]/g, '');
            // Handle Indian number format (commas)
            const numericAmount = cleanAmount.replace(/,/g, '');
            return parseFloat(numericAmount) || 0;
        }

        
        function formatIndianNumber(num) {
            if (num === 0) return '0';
            
            const numStr = Math.round(num * 100) / 100; // Round to 2 decimal places
            const [integer, decimal] = numStr.toString().split('.');
            
            // Indian numbering system: last 3 digits, then groups of 2
            let formatted = '';
            if (integer.length <= 3) {
                formatted = integer;
            } else {
                const lastThree = integer.slice(-3);
                const remaining = integer.slice(0, -3);
                formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
            }
            
            return decimal ? formatted + '.' + decimal : formatted;
        }

       
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() { // Small delay to ensure template variables are processed
                // Try to extract base amount from any element containing {{invoice.amount}}
                let baseAmount = 0;
                
                
                const row1Element = document.getElementById('row1-amount');
                const row2Element = document.getElementById('row2-amount');
                const gstElement = document.getElementById('gst-amount');
                
                // Extract from first available source
                const sources = [row1Element, row2Element, gstElement];
                for (let element of sources) {
                    if (element && element.textContent) {
                        const text = element.textContent.trim();
                        if (text && !text.includes('{{') && !text.includes('undefined')) {
                            const extracted = extractAmount(text);
                            if (extracted > 0) {
                                baseAmount = extracted;
                                break;
                            }
                        }
                    }
                }
                
                
                if (baseAmount === 0) {
                    const allText = document.body.textContent;
                    // Look for amounts that look like currency (with commas or large numbers)
                    const currencyPattern = /(\d{1,3}(?:,\d{2,3})*|\d{4,})/g;
                    const matches = allText.match(currencyPattern);
                    if (matches) {
                        for (let match of matches) {
                            const num = extractAmount(match);
                            // Take the largest reasonable amount (likely the main invoice amount)
                            if (num > 1000 && num > baseAmount) {
                                baseAmount = num;
                            }
                        }
                    }
                }
                
                
                if (baseAmount === 0) {
                    // Try to find the pattern in the HTML source
                    const bodyHTML = document.body.innerHTML;
                    const templateMatch = bodyHTML.match(/\{\{invoice\.amount\}\}/);
                    if (templateMatch) {
                        // This means template variables haven't been replaced yet
                        // Set a default for preview purposes
                        baseAmount = 190296; // Use sample amount for preview
                    }
                }
                
                // Ensure we have a valid base amount
                if (baseAmount === 0) {
                    baseAmount = 190296; // Fallback amount
                }
                
                // Calculate GST (18% of base amount)
                const gstAmount = Math.round(baseAmount * 0.18 * 100) / 100;
                
                // Calculate total (row1 + row2 + gst) = baseAmount + baseAmount + gstAmount
                const totalAmount = baseAmount + baseAmount + gstAmount;
                
                // Update all elements with calculated values
                if (row1Element) {
                    row1Element.textContent = formatIndianNumber(baseAmount) + '/-';
                }
                
                if (row2Element) {
                    row2Element.textContent = formatIndianNumber(baseAmount) + '/-';
                }
                
                const baseAmountTextElement = document.getElementById('base-amount-text');
                if (baseAmountTextElement) {
                    baseAmountTextElement.textContent = formatIndianNumber(baseAmount);
                }
                
                if (gstElement) {
                    gstElement.textContent = formatIndianNumber(gstAmount) + '/-';
                }
                
                const totalElement = document.getElementById('total-amount');
                if (totalElement) {
                    totalElement.textContent = formatIndianNumber(totalAmount) + '/-';
                }
                
                console.log('Invoice calculations completed:', {
                    baseAmount: baseAmount,
                    gstAmount: gstAmount,
                    totalAmount: totalAmount,
                    gstPercentage: '18%'
                });
                
            }, 200); 
        });

       
        function recalculateAmounts(newBaseAmount) {
            const baseAmount = extractAmount(newBaseAmount);
            const gstAmount = Math.round(baseAmount * 0.18 * 100) / 100;
            const totalAmount = baseAmount + baseAmount + gstAmount; // Sum of all three rows
            
            
            document.getElementById('row1-amount').textContent = formatIndianNumber(baseAmount) + '/-';
            document.getElementById('row2-amount').textContent = formatIndianNumber(baseAmount) + '/-';
            document.getElementById('base-amount-text').textContent = formatIndianNumber(baseAmount);
            document.getElementById('gst-amount').textContent = formatIndianNumber(gstAmount) + '/-';
            document.getElementById('total-amount').textContent = formatIndianNumber(totalAmount) + '/-';
        }

        
        window.recalculateAmounts = recalculateAmounts;
    </script>
</body>
</html>`;
  };

  
  const getDefaultReceiptTemplate = (): string => {
    return `
<html>
<head>
    <title>Maharashtra State Farming Corporation Receipt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
            font-size: 11px;
        }
        .receipt-container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .receipt {
            border: 2px solid #000;
            padding: 15px;
            background-color: #e8f0e8;
            position: relative;
            min-height: 200px;
        }
        
        /* Logo area */
        .logo-area {
            position: absolute;
            top: 15px;
            left: 15px;
            width: 50px;
            height: 50px;
            border: 2px solid #000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            background: white;
            font-weight: bold;
        }
        
        .header {
            text-align: center;
            margin-left: 70px;
            margin-bottom: 15px;
        }
        .org-name {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 3px;
        }
        .sub-text {
            font-size: 10px;
            margin-bottom: 2px;
        }
        
        .top-section {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            font-size: 11px;
        }
        .receipt-number-section {
            display: flex;
            align-items: center;
        }
        .receipt-number {
            font-weight: bold;
            font-size: 16px;
            margin-left: 5px;
        }
        .place-date-section {
            text-align: right;
        }
        .place-date-section div {
            margin-bottom: 5px;
        }
        
        .form-section {
            margin: 15px 0;
        }
        .form-line {
            margin: 8px 0;
            padding-bottom: 4px;
            border-bottom: 1px solid #000;
            min-height: 16px;
            font-size: 11px;
            display: flex;
            align-items: baseline;
        }
        .form-line strong {
            margin-right: 8px;
            white-space: nowrap;
        }
        .form-line .fill-space {
            flex: 1;
            border-bottom: none;
        }
        .variable-data {
            font-weight: normal;
            background-color: #fff3cd;
            padding: 1px 4px;
            border-radius: 2px;
        }
        
        .bottom-section {
            margin-top: 25px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .left-bottom {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .disclaimer {
            font-size: 10px;
        }
        .amount-line {
            font-size: 12px;
        }
        
        .right-bottom {
            text-align: right;
            font-size: 11px;
        }
        .right-bottom div {
            margin-bottom: 3px;
        }
        .accounts-officer {
            margin-top: 20px;
            font-weight: bold;
        }
        
        @media (max-width: 768px) {
            .receipt-container {
                max-width: 90%;
            }
            .header {
                margin-left: 60px;
            }
            .top-section {
                flex-direction: column;
                gap: 10px;
            }
            .place-date-section {
                text-align: left;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="receipt">
            <div class="logo-area">MSFC</div>
            
            <div class="header">
                <div class="org-name">MAHARASHTRA STATE FARMING CORPORATION LTD.</div>
                <div class="sub-text">(Government of Maharashtra Undertaking)</div>
                <div class="sub-text">Regd Office: Post Box: 2105, S. No. 270, Bhamburda, Senapati Bapat Marg, Pune - 411 016.</div>
            </div>
            
            <div class="top-section">
                <div class="receipt-number-section">
                    <span>No. C</span>
                    <span class="receipt-number variable-data">{{invoice.merchant}}</span>
                </div>
                <div class="place-date-section">
                    <div>Place:_____________________</div>
                    <div>Date: <span class="variable-data">{{invoice.due_date}}</span></div>
                </div>
            </div>
            
            <div class="form-section">
                <div class="form-line">
                    <strong>Received with thanks from</strong>
                    <span class="variable-data">{{invoice.tenant_name}}</span>
                </div>
                
                <div class="form-line">
                    <span class="fill-space"></span>
                </div>
                
                <div class="form-line">
                    <strong>Rupees</strong>
                    <span class="variable-data">{{invoice.amount}}</span>
                </div>
                
                <div class="form-line">
                    <span class="fill-space"></span>
                </div>
                
                <div class="form-line">
                    <strong>by Cheque / Cash</strong>
                    <span class="fill-space"></span>
                </div>
                
                <div class="form-line">
                    <strong>on account of</strong>
                    <span class="variable-data">{{invoice.frequency}}</span>
                </div>
                
                <div class="form-line">
                    <span class="fill-space"></span>
                </div>
            </div>
            
            <div class="bottom-section">
                <div class="left-bottom">
                    <div class="disclaimer">(Receipt of Cheque is subject to realization)</div>
                    <div class="amount-line">
                        <strong>Rs.</strong> <span class="variable-data">{{invoice.amount}}</span>
                    </div>
                </div>
                <div class="right-bottom">
                    <div><strong>For MAHARASHTRA STATE</strong></div>
                    <div><strong>FARMING CORPORATION LTD.</strong></div>
                    <div class="accounts-officer"><strong>Accounts Officer</strong></div>
                </div>
            </div>
            
            
            <div style="margin-top: 15px; padding: 8px; background-color: #e8f4f8; border-left: 4px solid #2563eb; font-size: 11px; border-radius: 3px;">
                <strong>Status:</strong> <span class="variable-data">{{invoice.status}}</span>
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  
const getDefaultHTMLTemplate = (templateTypeId?: number): string => {
 
  const typeId = templateTypeId || templateData.template_type_id;
  const templateType = templateTypes.find(type => type.id === typeId);
  
  
  
  if (templateType?.type === 'Receipt') {
    return getDefaultReceiptTemplate();
  } else {
    
    return getDefaultInvoiceTemplate();
  }
};

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setLeftPanelCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!editingItem && !forceMode) {
      if (templateTypes.length === 0) {
        setCreationType('template-type');
      } else {
        setCreationType(initialMode);
      }
    }
  }, [templateTypes.length, initialMode, editingItem, forceMode]);

  const getActiveTemplatesByType = (templateTypeId: number): Template[] => {
    return templates.filter(t => t.template_type_id === templateTypeId && t.is_active);
  };

const checkActiveConflict = (templateTypeId: number, isActive: boolean, currentTemplateId?: number): Template | null => {
  if (!isActive) return null;
  
 
  const templateType = templateTypes.find(t => t.id === templateTypeId);
  if (!templateType) return null;
  
  
  const sameTypeTemplateTypeIds = templateTypes
    .filter(tt => tt.type === templateType.type)
    .map(tt => tt.id);
  
  const activeTemplates = templates.filter(t => 
    sameTypeTemplateTypeIds.includes(t.template_type_id) && 
    t.is_active
  );
  
  const conflictingTemplates = currentTemplateId 
    ? activeTemplates.filter(t => t.id !== currentTemplateId)
    : activeTemplates;
    
  return conflictingTemplates.length > 0 ? conflictingTemplates[0] : null;
};

  const parseHTMLToComponents = (htmlContent: string): Component[] => {
    if (!htmlContent.trim()) return getDefaultComponents();
    
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      const extractedComponents: Component[] = [];
      let componentId = 1;
      
      const container = tempDiv.querySelector('div[style*="border"]') || tempDiv;
      
      if (container.children.length === 0) {
        return getDefaultComponents();
      }
      
      Array.from(container.children).forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const textContent = element.textContent?.trim() || '';
        
        if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
          extractedComponents.push({
            id: (componentId++).toString(),
            type: 'header',
            content: textContent,
            style: {
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1e40af',
              backgroundColor: 'transparent',
              textAlign: 'left',
              padding: '0px',
              margin: '0px 0px 16px 0px',
              borderRadius: '0px',
              border: 'none'
            }
          });
        } else if (tagName === 'p') {
          extractedComponents.push({
            id: (componentId++).toString(),
            type: 'text',
            content: textContent,
            style: {
              fontSize: '16px',
              fontWeight: 'normal',
              color: '#374151',
              backgroundColor: 'transparent',
              textAlign: 'left',
              padding: '0px',
              margin: '8px 0px',
              borderRadius: '0px',
              border: 'none'
            }
          });
        } else if (tagName === 'div' && textContent) {
          const hasVariable = requiredVariables.some(v => textContent.includes(v));
          extractedComponents.push({
            id: (componentId++).toString(),
            type: hasVariable ? 'field' : 'text',
            content: hasVariable ? 'Data Field' : textContent,
            variable: hasVariable ? requiredVariables.find(v => textContent.includes(v)) : undefined,
            style: {
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              backgroundColor: hasVariable ? '#f8fafc' : 'transparent',
              textAlign: 'left',
              padding: hasVariable ? '12px' : '0px',
              margin: '8px 0px',
              borderRadius: hasVariable ? '8px' : '0px',
              border: 'none'
            }
          });
        }
      });
      
      return extractedComponents.length > 0 ? extractedComponents : getDefaultComponents();
    } catch (error) {
      console.error('Error parsing HTML to components:', error);
      return getDefaultComponents();
    }
  };

const getDefaultComponents = (templateTypeId?: number): Component[] => {
  const typeId = templateTypeId || templateData.template_type_id;
  const currentTemplateType = templateTypes.find(type => type.id === typeId);
  
  if (currentTemplateType?.type === 'Receipt') {
    return [
      {
        id: '1',
        type: 'header',
        content: 'MAHARASHTRA STATE FARMING CORPORATION LTD.',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#000000',
          backgroundColor: 'transparent',
          textAlign: 'center',
          padding: '0px',
          margin: '0px 0px 3px 0px',
          borderRadius: '0px',
          border: 'none'
        }
      },
        {
          id: '2',
          type: 'text',
          content: '(Government of Maharashtra Undertaking)',
          style: {
            fontSize: '10px',
            fontWeight: 'normal',
            color: '#000000',
            backgroundColor: 'transparent',
            textAlign: 'center',
            padding: '0px',
            margin: '0px 0px 2px 0px',
            borderRadius: '0px',
            border: 'none'
          }
        },
        {
          id: '3',
          type: 'field',
          content: 'Receipt Number',
          variable: '{{invoice.merchant}}',
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000000',
            backgroundColor: '#fff3cd',
            textAlign: 'left',
            padding: '2px 4px',
            margin: '15px 0px',
            borderRadius: '3px',
            border: 'none'
          }
        },
        {
          id: '4',
          type: 'field',
          content: 'Date',
          variable: '{{invoice.due_date}}',
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000000',
            backgroundColor: '#fff3cd',
            textAlign: 'left',
            padding: '2px 4px',
            margin: '0px',
            borderRadius: '3px',
            border: 'none'
          }
        },
        {
          id: '5',
          type: 'field',
          content: 'Received from',
          variable: '{{invoice.tenant_name}}',
          style: {
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#000000',
            backgroundColor: '#fff3cd',
            textAlign: 'left',
            padding: '2px 4px',
            margin: '8px 0px',
            borderRadius: '3px',
            border: 'none'
          }
        },
        {
          id: '6',
          type: 'field',
          content: 'Amount',
          variable: '{{invoice.amount}}',
          style: {
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#000000',
            backgroundColor: '#fff3cd',
            textAlign: 'left',
            padding: '2px 4px',
            margin: '8px 0px',
            borderRadius: '3px',
            border: 'none'
          }
        },
        {
          id: '7',
          type: 'field',
          content: 'Frequency',
          variable: '{{invoice.frequency}}',
          style: {
            fontSize: '11px',
            fontWeight: 'normal',
            color: '#000000',
            backgroundColor: 'transparent',
            textAlign: 'left',
            padding: '0px',
            margin: '8px 0px',
            borderRadius: '0px',
            border: 'none'
          }
        },
        {
          id: '8',
          type: 'field',
          content: 'Status',
          variable: '{{invoice.status}}',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#000000',
            backgroundColor: '#fff3cd',
            textAlign: 'left',
            padding: '2px 4px',
            margin: '10px 0px',
            borderRadius: '3px',
            border: 'none'
          }
        }
      ];
    } else {
      // Default Invoice components
       return [
      {
        id: '1',
        type: 'header',
        content: 'महाराष्ट्र राज्य शेती महामंडळ मर्यादित',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#000000',
          backgroundColor: 'transparent',
          textAlign: 'center',
          padding: '0px',
          margin: '0px 0px 5px 0px',
          borderRadius: '0px',
          border: 'none'
        }
      },
        {
          id: '2',
          type: 'field',
          content: 'Reference Number',
          variable: '{{invoice.merchant}}',
          style: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#000000',
            backgroundColor: 'transparent',
            textAlign: 'left',
            padding: '0px',
            margin: '20px 0px',
            borderRadius: '0px',
            border: 'none'
          }
        },
        {
          id: '3',
          type: 'field',
          content: 'Date',
          variable: '{{invoice.due_date}}',
          style: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#000000',
            backgroundColor: 'transparent',
            textAlign: 'right',
            padding: '0px',
            margin: '0px 0px 20px 0px',
            borderRadius: '0px',
            border: 'none'
          }
        },
        {
          id: '4',
          type: 'field',
          content: 'Client Name',
          variable: '{{invoice.tenant_name}}',
          style: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#000000',
            backgroundColor: 'transparent',
            textAlign: 'left',
            padding: '0px',
            margin: '20px 0px',
            borderRadius: '0px',
            border: 'none'
          }
        },
        {
          id: '5',
          type: 'field',
          content: 'Total Amount',
          variable: '{{invoice.amount}}',
          style: {
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#000000',
            backgroundColor: '#f9f9f9',
            textAlign: 'right',
            padding: '8px',
            margin: '0px',
            borderRadius: '0px',
            border: '1px solid #333'
          }
        },
        {
          id: '6',
          type: 'field',
          content: 'Status',
          variable: '{{invoice.status}}',
          style: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e40af',
            backgroundColor: '#e8f4f8',
            textAlign: 'left',
            padding: '10px',
            margin: '20px 0px 0px 0px',
            borderRadius: '0px',
            border: '4px solid #2563eb on left'
          }
        }
      ];
    }
  };

  useEffect(() => {
    if (editingItem) {
      setIsEditMode(true);
      if (isTemplate(editingItem)) {
        setCreationType('template');
        setTemplateData({
          organization_id: editingItem.organization_id,
          template_type_id: editingItem.template_type_id,
          is_active: editingItem.is_active,
          html_content: editingItem.html_content,
          layout_type: editingItem.layout_type || '',
          logo_url: editingItem.logo_url || '',
          primary_color: editingItem.primary_color || '#004aad',
          font_family: editingItem.font_family || 'Poppins',
          show_discount: editingItem.show_discount,
          show_qr_code: editingItem.show_qr_code,
          custom_labels: editingItem.custom_labels || {
            invoice: 'Tax Invoice',
            client: 'Customer',
            date: 'Bill Date'
          },
          footer_note: editingItem.footer_note || '',
          date_format: editingItem.date_format || 'DD-MM-YYYY',
          currency_format: editingItem.currency_format || 'INR',
          receipt_background_url: editingItem.receipt_background_url || ''
        });
        setLastCodeContent(editingItem.html_content);
        
        const parsedComponents = parseHTMLToComponents(editingItem.html_content);
        setComponents(parsedComponents);
      } else {
        setCreationType('template-type');
        setTemplateTypeData({
          type: editingItem.type,
          description: editingItem.description,
          is_active: editingItem.is_active ?? true
        });
      }
    } else {
      setIsEditMode(false);
      resetToDefaults();
    }
    setShowActiveWarning(false);
    setExistingActiveTemplate(null);
  }, [editingItem, templateTypes]);

  useEffect(() => {
    if (templateTypes.length > 0 && !templateData.template_type_id) {
      setTemplateData(prev => ({ ...prev, template_type_id: templateTypes[0].id }));
    }
  }, [templateTypes]);

  
  useEffect(() => {
  if (builderMode === 'visual' || creationType === 'template') {
    const htmlContent = components.length > 0 ? generateHTMLFromComponents() : getDefaultHTMLTemplate();
    setTemplateData(prev => ({ ...prev, html_content: htmlContent }));
    setLastCodeContent(htmlContent); 
  }
}, [components, templateData.font_family, templateData.primary_color, templateData.template_type_id]);

  
useEffect(() => {
  if (!isEditMode && creationType === 'template') {
    
    const selectedTemplateType = templateTypes.find(t => t.id === templateData.template_type_id);
    const defaultComponents = getDefaultComponents();
    setComponents(defaultComponents);
    
    
    const newHtmlContent = getDefaultHTMLTemplate(templateData.template_type_id);
    setTemplateData(prev => ({ 
      ...prev, 
      html_content: newHtmlContent 
    }));
    setLastCodeContent(newHtmlContent);
  }
}, [templateData.template_type_id, isEditMode, creationType]);


useEffect(() => {
  if (builderMode === 'visual' || creationType === 'template') {
    const htmlContent = components.length > 0 ? generateHTMLFromComponents() : getDefaultHTMLTemplate();
    setTemplateData(prev => ({ ...prev, html_content: htmlContent }));
    setLastCodeContent(htmlContent);
  }
}, [components, templateData.font_family, templateData.primary_color, templateData.template_type_id]);


  useEffect(() => {
  if (creationType === 'template' && templateData.is_active && !showActiveWarning) {
    const conflictTemplate = checkActiveConflict(
      templateData.template_type_id, 
      templateData.is_active,
      isEditMode && editingItem && isTemplate(editingItem) ? editingItem.id : undefined
    );
    
    if (conflictTemplate) {
      setExistingActiveTemplate(conflictTemplate);
      setShowActiveWarning(true);
    } else {
      setShowActiveWarning(false);
      setExistingActiveTemplate(null);
    }
  }
}, [templateData.template_type_id, templateData.is_active, templates, creationType, isEditMode, editingItem, showActiveWarning]);

  const generateHTMLFromComponents = () => {
    return getDefaultHTMLTemplate();
  };

  const resetToDefaults = () => {
  setTemplateTypeData({ 
    type: 'Invoice', 
    description: '',
    is_active: true
  });
  
  const defaultTemplateData = {
    organization_id: 1, 
    template_type_id: templateTypes.length > 0 ? templateTypes[0].id : 1,
    is_active: true,
    html_content: '', 
    layout_type: '',
    logo_url: '',
    primary_color: '#004aad',
    font_family: 'Poppins',
    show_discount: false,
    show_qr_code: false,
    custom_labels: {
      invoice: 'Tax Invoice',
      client: 'Customer',
      date: 'Bill Date'
    },
    footer_note: '',
    date_format: 'DD-MM-YYYY',
    currency_format: 'INR',
    receipt_background_url: ''
  };
  
  setTemplateData(defaultTemplateData);
  
  const defaultComponents = getDefaultComponents();
  setComponents(defaultComponents);
  const defaultHtml = getDefaultHTMLTemplate();
  setTemplateData(prev => ({ ...prev, html_content: defaultHtml }));
  
  setLastCodeContent('');
  setShowActiveWarning(false);
  setExistingActiveTemplate(null);
};
  const addComponent = (type: string) => {
    const newComponent: Component = {
      id: Date.now().toString(),
      type: type as any,
      content: type === 'header' ? 'Header Text' : type === 'footer' ? 'Footer Text' : type === 'field' ? 'Field Label' : type === 'text' ? 'Static Text' : '',
      variable: type === 'field' ? requiredVariables[0] : undefined,
      style: {
        fontSize: type === 'header' ? '24px' : '16px',
        fontWeight: type === 'header' ? 'bold' : 'normal',
        color: '#374151',
        backgroundColor: type === 'field' ? '#f8fafc' : 'transparent',
        textAlign: 'left',
        padding: type === 'field' ? '12px' : '0px',
        margin: '8px 0px',
        borderRadius: type === 'field' ? '8px' : '0px',
        border: 'none'
      }
    };
    
    setComponents([...components, newComponent]);
  };

  const updateComponent = (id: string, updates: Partial<Component>) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
  };

  const deleteComponent = (id: string) => {
    setComponents(components.filter(comp => comp.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  const moveComponent = (id: string, direction: 'up' | 'down') => {
    const index = components.findIndex(comp => comp.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= components.length) return;
    
    const newComponents = [...components];
    [newComponents[index], newComponents[newIndex]] = [newComponents[newIndex], newComponents[index]];
    setComponents(newComponents);
  };

  const validateTemplateType = () => {
    const newErrors: {[key: string]: string} = {};
    if (!templateTypeData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTemplate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (templateTypes.length === 0 && !isEditMode) {
      newErrors.template_type_id = 'Please create a template type first';
    }
    
    if (!templateData.html_content.trim()) {
      newErrors.html_content = 'Template content is required';
    } else {
      const missingVariables = requiredVariables.filter(variable => 
        !templateData.html_content.includes(variable)
      );
      
      if (missingVariables.length > 0) {
        newErrors.html_content = `Missing required variables: ${missingVariables.join(', ')}`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTemplateTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setTemplateTypeData({ 
      ...templateTypeData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value, type } = e.target;
  const checked = (e.target as HTMLInputElement).checked;
  
  const newValue = type === 'checkbox' ? checked : (name === 'template_type_id') ? parseInt(value) : value;
  
  setTemplateData(prev => ({ 
    ...prev, 
    [name]: newValue
  }));
  

  if (name === 'template_type_id' && !isEditMode) {
    const templateTypeId = parseInt(value);
    const selectedTemplateType = templateTypes.find(t => t.id === templateTypeId);
    
    setTimeout(() => {
      const defaultComponents = getDefaultComponents();
      setComponents(defaultComponents);
      
 
      const newHtmlContent = getDefaultHTMLTemplate(templateTypeId);
      console.log('Generated HTML template type:', newHtmlContent.includes('MAHARASHTRA STATE FARMING CORPORATION LTD') ? 'Receipt' : 'Invoice'); // Debug log
      
      setTemplateData(prev => ({ 
        ...prev, 
        html_content: newHtmlContent 
      }));
      setLastCodeContent(newHtmlContent);
    }, 0);
  }
  
  
  if (name === 'html_content' && builderMode === 'code') {
    setLastCodeContent(value);
  }
  
  if (errors[name]) {
    setErrors({ ...errors, [name]: '' });
  }
};

  const handleCustomLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTemplateData({
      ...templateData,
      custom_labels: {
        ...templateData.custom_labels,
        [name]: value,
      },
    });
  };

  const handleActiveToggle = () => {
    const newIsActive = !templateData.is_active;
    
    if (newIsActive) {
      const conflictTemplate = checkActiveConflict(
        templateData.template_type_id, 
        newIsActive,
        isEditMode && editingItem && isTemplate(editingItem) ? editingItem.id : undefined
      );
      
      if (conflictTemplate) {
        setExistingActiveTemplate(conflictTemplate);
        setShowActiveWarning(true);
        return;
      }
    }
    
    setTemplateData(prev => ({ ...prev, is_active: newIsActive }));
    setShowActiveWarning(false);
    setExistingActiveTemplate(null);
  };

  const handleProceedWithActive = () => {
    setTemplateData(prev => ({ ...prev, is_active: true }));
    setShowActiveWarning(false);
  };

  const handleCancelActive = () => {
    setTemplateData(prev => ({ ...prev, is_active: false }));
    setShowActiveWarning(false);
    setExistingActiveTemplate(null);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (creationType === 'template-type') {
        if (!validateTemplateType()) return;
        
        if (isEditMode && editingItem && !isTemplate(editingItem)) {
          await onUpdateTemplateType?.(editingItem.id, templateTypeData);
        } else {
          await onSaveTemplateType(templateTypeData);
        }
        
        resetForm();
        handleClose();
      } else {
        if (!validateTemplate()) return;
        
        const templatePayload: any = {
          organization_id: templateData.organization_id,
          template_type_id: templateData.template_type_id,
          is_active: templateData.is_active,
          html_content: templateData.html_content,
          show_discount: templateData.show_discount,
          show_qr_code: templateData.show_qr_code,
        };

        if (templateData.layout_type?.trim()) templatePayload.layout_type = templateData.layout_type.trim();
        if (templateData.logo_url?.trim()) templatePayload.logo_url = templateData.logo_url.trim();
        if (templateData.primary_color?.trim()) templatePayload.primary_color = templateData.primary_color.trim();
        if (templateData.font_family?.trim()) templatePayload.font_family = templateData.font_family.trim();
        if (templateData.footer_note?.trim()) templatePayload.footer_note = templateData.footer_note.trim();
        if (templateData.date_format?.trim()) templatePayload.date_format = templateData.date_format.trim();
        if (templateData.currency_format?.trim()) templatePayload.currency_format = templateData.currency_format.trim();
        if (templateData.receipt_background_url?.trim()) templatePayload.receipt_background_url = templateData.receipt_background_url.trim();
        
        if (templateData.custom_labels && Object.keys(templateData.custom_labels).length > 0) {
          const filteredLabels = Object.fromEntries(
            Object.entries(templateData.custom_labels).filter(([_, value]) => value && value.trim() !== '')
          );
          if (Object.keys(filteredLabels).length > 0) {
            templatePayload.custom_labels = filteredLabels;
          }
        }
        
        if (isEditMode && editingItem && isTemplate(editingItem)) {
          await onUpdateTemplate?.(editingItem.id, templatePayload);
        } else {
          await onSaveTemplate(templatePayload);
        }
        
        resetForm();
        handleClose();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    resetToDefaults();
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    setCreationType(initialMode);
    setIsEditMode(false);
    setShowActiveWarning(false);
    setExistingActiveTemplate(null);
    setLeftPanelCollapsed(false);
    onClose();
  };

  const canCreateTemplate = () => {
    return templateTypes.length > 0;
  };

  const getCreationTypeMessage = () => {
    if (templateTypes.length === 0) {
      return "Create a template type first - templates need a type to be associated with.";
    }
    return "Choose what you want to create.";
  };

  if (!isOpen) return null;

  const fontFamilies = ['Poppins', 'Arial', 'Helvetica', 'Times New Roman', 'Roboto', 'Open Sans'];
  const dateFormats = ['DD-MM-YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD/MM/YY'];
  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY'];
  const layoutTypes = ['Default', 'Compact', 'Detailed', 'Modern'];

  const selectedComp = selectedComponent ? components.find(c => c.id === selectedComponent) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[98vh] sm:max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
            <div className={`p-2 md:p-3 rounded-xl shadow-sm flex-shrink-0 ${creationType === 'template-type' ? 'bg-green-500' : 'bg-blue-500'}`}>
              {creationType === 'template-type' ? (
                <Settings className="w-4 h-4 md:w-6 md:h-6 text-white" />
              ) : (
                <FileText className="w-4 h-4 md:w-6 md:h-6 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 md:space-x-4 mb-1 md:mb-2">
                <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                  {isEditMode ? 'Edit Item' : 'Create New Item'}
                </h2>
                {!isEditMode && !forceMode && (
                  <div className="hidden sm:flex bg-white rounded-lg p-1 shadow-sm border">
                    <button
                      onClick={() => setCreationType('template-type')}
                      className={`px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-semibold transition-all duration-200 ${
                        creationType === 'template-type' 
                          ? 'bg-green-500 text-white shadow-sm transform scale-105' 
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <Settings className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 inline" />
                      <span className="hidden sm:inline">Template Type</span>
                    </button>
                    <button
                      onClick={() => setCreationType('template')}
                      disabled={!canCreateTemplate()}
                      className={`px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-semibold transition-all duration-200 ${
                        creationType === 'template' 
                          ? 'bg-blue-500 text-white shadow-sm transform scale-105' 
                          : !canCreateTemplate()
                          ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      title={!canCreateTemplate() ? 'Create a template type first' : ''}
                    >
                      <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 inline" />
                      <span className="hidden sm:inline">Template</span>
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                {isEditMode 
                  ? `Edit ${creationType === 'template-type' ? 'template type configuration' : 'template settings and content'}`
                  : getCreationTypeMessage()
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
          </button>
        </div>

        {/* Mobile Toggle Buttons */}
        {!isEditMode && !forceMode && (
          <div className="sm:hidden p-3 bg-white border-b border-gray-200 flex-shrink-0">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCreationType('template-type')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  creationType === 'template-type' 
                    ? 'bg-green-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Settings className="w-4 h-4 mr-2 inline" />
                Template Type
              </button>
              <button
                onClick={() => setCreationType('template')}
                disabled={!canCreateTemplate()}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  creationType === 'template' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : !canCreateTemplate()
                    ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title={!canCreateTemplate() ? 'Create a template type first' : ''}
              >
                <FileText className="w-4 h-4 mr-2 inline" />
                Template
              </button>
            </div>
          </div>
        )}

        {/* Warning Messages */}
        {!isEditMode && creationType === 'template' && templateTypes.length === 0 && (
          <div className="bg-amber-50 border-b border-amber-200 p-3 sm:p-4 flex-shrink-0">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-amber-800">
                  Template Type Required
                </h3>
                <div className="mt-1 text-xs sm:text-sm text-amber-700">
                  <p>You need to create at least one template type before you can create templates.</p>
                  <p className="mt-1 hidden sm:block">Template types define whether a template is for invoices or receipts and provide organizational structure.</p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => setCreationType('template-type')}
                    className="px-3 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Create Template Type First
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Template Warning */}
        {showActiveWarning && existingActiveTemplate && (
  <div className="bg-yellow-50 border-b border-yellow-200 p-3 sm:p-4 flex-shrink-0">
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-yellow-800">
          Active {getCurrentTemplateType()?.type} Template Conflict
        </h3>
        <div className="mt-1 text-xs sm:text-sm text-yellow-700">
          <p>There's already an active {getCurrentTemplateType()?.type.toLowerCase()} template for this template type:</p>
          <div className="mt-2 bg-yellow-100 rounded-lg p-3 border border-yellow-200">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              <span className="font-medium">Template #{existingActiveTemplate.id}</span>
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Currently Active</span>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              {templateTypes.find(t => t.id === existingActiveTemplate.template_type_id)?.description}
            </p>
          </div>
          <p className="mt-2 hidden sm:block">
            Setting this {getCurrentTemplateType()?.type.toLowerCase()} template as active will automatically deactivate the existing one. 
            Only one {getCurrentTemplateType()?.type.toLowerCase()} template can be active per template type.
          </p>
        </div>
        <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleProceedWithActive}
            className="px-3 py-1.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Proceed & Deactivate Existing {getCurrentTemplateType()?.type}
          </button>
          <button
            onClick={handleCancelActive}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Keep Inactive Instead
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {creationType === 'template-type' ? (
            /* Template Type Form */
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-50">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 sm:p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 flex items-center">
                      <Settings className="w-5 h-5 md:w-6 md:h-6 mr-3 flex-shrink-0" />
                      <span className="min-w-0">Template Type Configuration</span>
                    </h3>
                    <p className="text-green-100 text-sm">
                      {isEditMode 
                        ? "Update the template type configuration"
                        : "Create a template type that will be used as a foundation for multiple templates"
                      }
                    </p>
                  </div>
                  
                  <div className="p-3 sm:p-4 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                          <Receipt className="w-4 h-4 inline mr-2 text-green-500" />
                          Type *
                        </label>
                        <select
                          name="type"
                          value={templateTypeData.type}
                          onChange={handleTemplateTypeChange}
                          disabled={isEditMode}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                          <option value="Invoice">Invoice</option>
                          <option value="Receipt">Receipt</option>
                        </select>
                        {isEditMode && (
                          <p className="mt-1 text-xs text-gray-500">Type cannot be changed when editing</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                          <FileText className="w-4 h-4 inline mr-2 text-green-500" />
                          Description *
                        </label>
                        <input
                          type="text"
                          name="description"
                          value={templateTypeData.description}
                          onChange={handleTemplateTypeChange}
                          placeholder="e.g., Standard business invoice format"
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200 text-sm sm:text-base ${
                            errors.description 
                              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                              : 'border-gray-200 bg-white focus:border-green-500'
                          }`}
                        />
                        {errors.description && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <X className="w-4 h-4 mr-1 flex-shrink-0" />
                            {errors.description}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          This description helps identify the template type's purpose
                        </p>
                      </div>
                    </div>

                    {/* Status Configuration */}
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        <Settings className="w-4 h-4 inline mr-2 text-green-500" />
                        Status Configuration
                      </label>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 mr-4">
                          <span className="text-sm font-medium text-gray-700">Active Status</span>
                          <p className="text-xs text-gray-500 mt-1">
                            Active template types can be used to create new templates
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTemplateTypeData(prev => ({ ...prev, is_active: !prev.is_active }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                            templateTypeData.is_active ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            templateTypeData.is_active ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>

                    {/* Existing Template Types */}
                    {!isEditMode && templateTypes.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Existing Template Types:</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {templateTypes.map(tt => (
                            <div key={tt.id} className="flex items-center justify-between bg-white p-2 sm:p-3 rounded border">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                {tt.type === 'Invoice' ? (
                                  <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                ) : (
                                  <Receipt className="w-4 h-4 text-green-500 flex-shrink-0" />
                                )}
                                <span className="font-medium text-gray-900 text-sm">{tt.type}</span>
                                <span className="text-xs sm:text-sm text-gray-600 truncate">- {tt.description}</span>
                              </div>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  tt.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {tt.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-xs text-gray-500">ID: {tt.id}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            (canCreateTemplate() || isEditMode) ? (
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Panel - Settings & Components */}
                <div className={`w-full lg:w-80 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-hidden flex flex-col transition-all duration-300 ${
                  isMobile && leftPanelCollapsed ? 'hidden' : ''
                }`}>
                  {/* Mobile Panel Header */}
                  {isMobile && (
                    <div className="p-2 border-b border-gray-200 bg-white flex justify-between items-center lg:hidden">
                      <h3 className="text-sm font-semibold text-gray-800">Settings & Components</h3>
                      <button
                        onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {leftPanelCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto">
                    {/* Builder Mode Toggle */}
                    <div className="p-3 sm:p-4 border-b border-gray-200 bg-white">
                      <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setBuilderMode('visual')}
                          className={`flex-1 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                            builderMode === 'visual' 
                              ? 'bg-blue-500 text-white shadow-sm' 
                              : 'text-gray-600 hover:text-blue-600'
                          }`}
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
                          Visual Builder
                        </button>
                        <button
                          onClick={() => setBuilderMode('code')}
                          className={`flex-1 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                            builderMode === 'code' 
                              ? 'bg-purple-500 text-white shadow-sm' 
                              : 'text-gray-600 hover:text-purple-600'
                          }`}
                        >
                          <Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
                          Code Editor
                        </button>
                      </div>
                    </div>

                    {builderMode === 'visual' ? (
                      <>
                        {/* Component Library */}
                        <div className="p-3 sm:p-4 border-b border-gray-200 bg-white">
                          <h3 className="text-sm font-semibold text-gray-800 mb-3">Add Components</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {availableComponents.map(comp => (
                              <button
                                key={comp.type}
                                onClick={() => addComponent(comp.type)}
                                className="p-2 sm:p-3 text-xs text-center border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                              >
                                <div className="text-base sm:text-lg mb-1">{comp.icon}</div>
                                <div className="font-medium text-gray-700">{comp.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Required Variables */}
                        <div className="p-3 sm:p-4 border-b border-gray-200 bg-white">
                          <h3 className="text-sm font-semibold text-gray-800 mb-3">Required Variables</h3>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {requiredVariables.map(variable => {
                              const isUsed = components.some(comp => comp.variable === variable);
                              return (
                                <div key={variable} className={`text-xs font-mono px-2 py-1 rounded border ${
                                  isUsed ? 'bg-green-100 border-green-300 text-green-700' : 'bg-yellow-100 border-yellow-300 text-yellow-700'
                                }`}>
                                  <span className="break-all">{variable}</span> {isUsed ? '✅' : '❌'}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Component List */}
                        <div className="p-3 sm:p-4">
                          <h3 className="text-sm font-semibold text-gray-800 mb-3">Template Structure</h3>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {components.map((comp, index) => (
                              <div
                                key={comp.id}
                                className={`p-2 sm:p-3 border rounded-lg cursor-pointer transition-all ${
                                  selectedComponent === comp.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                                onClick={() => setSelectedComponent(comp.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <div className="text-sm flex-shrink-0">
                                      {comp.type === 'header' && '📋'}
                                      {comp.type === 'field' && '📝'}
                                      {comp.type === 'text' && '📄'}
                                      {comp.type === 'spacer' && '⬜'}
                                      {comp.type === 'divider' && '➖'}
                                      {comp.type === 'footer' && '📋'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-xs font-medium text-gray-700">{comp.type}</div>
                                      <div className="text-xs text-gray-500 truncate">
                                        {comp.content || comp.variable || 'Empty'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1 flex-shrink-0">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); moveComponent(comp.id, 'up'); }}
                                      disabled={index === 0}
                                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 text-xs"
                                    >
                                      ⬆️
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); moveComponent(comp.id, 'down'); }}
                                      disabled={index === components.length - 1}
                                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 text-xs"
                                    >
                                      ⬇️
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); deleteComponent(comp.id); }}
                                      className="p-1 hover:bg-red-100 rounded text-red-500"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {components.length === 0 && (
                              <div className="text-center py-8 text-gray-500">
                                <div className="text-2xl mb-2">🏗️</div>
                                <div className="text-sm">No components yet</div>
                                <div className="text-xs">Add components from above</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Component Editor */}
                        {selectedComp && (
                          <div className="border-t border-gray-200 bg-white">
                            <div className="p-3 sm:p-4">
                              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                <Settings className="w-4 h-4 mr-2 flex-shrink-0" />
                                Edit {selectedComp.type}
                              </h3>
                              
                              <div className="space-y-4">
                                {/* Content */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
                                  <input
                                    type="text"
                                    value={selectedComp.content}
                                    onChange={(e) => updateComponent(selectedComp.id, { content: e.target.value })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    placeholder="Enter text content"
                                  />
                                </div>

                                {/* Variable Selection for Fields */}
                                {selectedComp.type === 'field' && (
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Variable</label>
                                    <select
                                      value={selectedComp.variable || ''}
                                      onChange={(e) => updateComponent(selectedComp.id, { variable: e.target.value })}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    >
                                      {availableVariables.map(v => (
                                        <option key={v.variable} value={v.variable}>{v.label}</option>
                                      ))}
                                    </select>
                                  </div>
                                )}

                                {/* Style Controls */}
                                <div className="space-y-3">
                                  <div className="text-xs font-medium text-gray-700">Styling</div>
                                  
                                  {/* Font Size & Weight */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Size</label>
                                      <select
                                        value={selectedComp.style.fontSize}
                                        onChange={(e) => updateComponent(selectedComp.id, { 
                                          style: { ...selectedComp.style, fontSize: e.target.value }
                                        })}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                      >
                                        <option value="12px">12px</option>
                                        <option value="14px">14px</option>
                                        <option value="16px">16px</option>
                                        <option value="18px">18px</option>
                                        <option value="20px">20px</option>
                                        <option value="24px">24px</option>
                                        <option value="28px">28px</option>
                                        <option value="32px">32px</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Weight</label>
                                      <select
                                        value={selectedComp.style.fontWeight}
                                        onChange={(e) => updateComponent(selectedComp.id, { 
                                          style: { ...selectedComp.style, fontWeight: e.target.value }
                                        })}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                      >
                                        <option value="normal">Normal</option>
                                        <option value="500">Medium</option>
                                        <option value="600">Semibold</option>
                                        <option value="bold">Bold</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Colors */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                                      <div className="flex items-center space-x-1">
                                        <input
                                          type="color"
                                          value={selectedComp.style.color}
                                          onChange={(e) => updateComponent(selectedComp.id, { 
                                            style: { ...selectedComp.style, color: e.target.value }
                                          })}
                                          className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                                        />
                                        <input
                                          type="text"
                                          value={selectedComp.style.color}
                                          onChange={(e) => updateComponent(selectedComp.id, { 
                                            style: { ...selectedComp.style, color: e.target.value }
                                          })}
                                          className="flex-1 px-1 py-1 border border-gray-300 rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Background</label>
                                      <div className="flex items-center space-x-1">
                                        <input
                                          type="color"
                                          value={selectedComp.style.backgroundColor === 'transparent' ? '#ffffff' : selectedComp.style.backgroundColor}
                                          onChange={(e) => updateComponent(selectedComp.id, { 
                                            style: { ...selectedComp.style, backgroundColor: e.target.value }
                                          })}
                                          className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                                        />
                                        <button
                                          onClick={() => updateComponent(selectedComp.id, { 
                                            style: { ...selectedComp.style, backgroundColor: 'transparent' }
                                          })}
                                          className="flex-1 px-1 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
                                        >
                                          {selectedComp.style.backgroundColor === 'transparent' ? 'None' : 'Color'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Alignment */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Alignment</label>
                                    <div className="flex space-x-1">
                                      {['left', 'center', 'right'].map(align => (
                                        <button
                                          key={align}
                                          onClick={() => updateComponent(selectedComp.id, { 
                                            style: { ...selectedComp.style, textAlign: align }
                                          })}
                                          className={`flex-1 px-2 py-1 text-xs rounded border ${
                                            selectedComp.style.textAlign === align
                                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                                              : 'border-gray-300 hover:bg-gray-50'
                                          }`}
                                        >
                                          {align === 'left' && <AlignLeft className="w-3 h-3 mx-auto" />}
                                          {align === 'center' && <AlignCenter className="w-3 h-3 mx-auto" />}
                                          {align === 'right' && <AlignRight className="w-3 h-3 mx-auto" />}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Padding */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Padding</label>
                                    <input
                                      type="text"
                                      value={selectedComp.style.padding}
                                      onChange={(e) => updateComponent(selectedComp.id, { 
                                        style: { ...selectedComp.style, padding: e.target.value }
                                      })}
                                      placeholder="e.g., 12px or 8px 16px"
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
                                    <select
                                      value={selectedComp.style.borderRadius}
                                      onChange={(e) => updateComponent(selectedComp.id, { 
                                        style: { ...selectedComp.style, borderRadius: e.target.value }
                                      })}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                    >
                                      <option value="0px">No Radius</option>
                                      <option value="4px">Small (4px)</option>
                                      <option value="8px">Medium (8px)</option>
                                      <option value="12px">Large (12px)</option>
                                      <option value="999px">Pill</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Code Editor Mode */
                      <div className="p-3 sm:p-4 bg-white">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4">
                          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                            <Code className="w-4 h-4 mr-2 flex-shrink-0" />
                            Required Variables
                          </h4>
                          <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                            {requiredVariables.map(variable => (
                              <span key={variable} className="text-xs font-mono bg-yellow-100 px-2 py-1 rounded border break-all">
                                {variable}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Template Settings */}
                    <div className="border-t border-gray-200 bg-white p-3 sm:p-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">Template Settings</h3>
                      
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Template Type</label>
                          <select
                            name="template_type_id"
                            value={templateData.template_type_id}
                            onChange={handleTemplateChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            {templateTypes.map(type => (
                              <option key={type.id} value={type.id}>
                                {type.type} - {type.description}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Layout Type</label>
                          <select
                            name="layout_type"
                            value={templateData.layout_type}
                            onChange={handleTemplateChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Choose layout style</option>
                            {layoutTypes.map(layout => (
                              <option key={layout} value={layout}>{layout}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
                          <select
                            name="font_family"
                            value={templateData.font_family}
                            onChange={handleTemplateChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            {fontFamilies.map(font => (
                              <option key={font} value={font}>{font}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Primary Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              name="primary_color"
                              value={templateData.primary_color}
                              onChange={handleTemplateChange}
                              className="w-8 h-8 border border-gray-300 rounded cursor-pointer flex-shrink-0"
                            />
                            <input
                              type="text"
                              value={templateData.primary_color}
                              onChange={handleTemplateChange}
                              name="primary_color"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm min-w-0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Logo URL</label>
                          <input
                            type="url"
                            name="logo_url"
                            value={templateData.logo_url}
                            onChange={handleTemplateChange}
                            placeholder="https://example.com/logo.png"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Background URL</label>
                          <input
                            type="url"
                            name="receipt_background_url"
                            value={templateData.receipt_background_url}
                            onChange={handleTemplateChange}
                            placeholder="https://example.com/bg.png"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Date Format</label>
                            <select
                              name="date_format"
                              value={templateData.date_format}
                              onChange={handleTemplateChange}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              {dateFormats.map(format => (
                                <option key={format} value={format}>{format}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Currency</label>
                            <select
                              name="currency_format"
                              value={templateData.currency_format}
                              onChange={handleTemplateChange}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              {currencies.map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Footer Note</label>
                          <textarea
                            name="footer_note"
                            value={templateData.footer_note}
                            onChange={handleTemplateChange}
                            rows={2}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Thank you for your business"
                          />
                        </div>

                        {/* Custom Labels */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Custom Labels</label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              name="invoice"
                              value={templateData.custom_labels?.invoice || ''}
                              onChange={handleCustomLabelChange}
                              placeholder="Invoice Label"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                            />
                            <input
                              type="text"
                              name="client"
                              value={templateData.custom_labels?.client || ''}
                              onChange={handleCustomLabelChange}
                              placeholder="Client Label"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                            />
                            <input
                              type="text"
                              name="date"
                              value={templateData.custom_labels?.date || ''}
                              onChange={handleCustomLabelChange}
                              placeholder="Date Label"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                            />
                          </div>
                        </div>

                        {/* Display Options */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700">Show Discount</span>
                            <input
                              type="checkbox"
                              name="show_discount"
                              checked={templateData.show_discount}
                              onChange={handleTemplateChange}
                              className="w-4 h-4 text-blue-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700">Show QR Code</span>
                            <input
                              type="checkbox"
                              name="show_qr_code"
                              checked={templateData.show_qr_code}
                              onChange={handleTemplateChange}
                              className="w-4 h-4 text-blue-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700">Active Status</span>
                            <button
                              type="button"
                              onClick={handleActiveToggle}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                                templateData.is_active ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                templateData.is_active ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Preview/Editor */}
                <div className="flex-1 bg-white flex flex-col min-h-0">
                  {/* Mobile Toggle */}
                  {isMobile && (
                    <div className="p-3 border-b border-gray-200 bg-white lg:hidden">
                      <button
                        onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                        className="w-full flex items-center justify-center space-x-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {leftPanelCollapsed ? 'Show' : 'Hide'} Settings & Components
                        </span>
                        {leftPanelCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  <div className="border-b border-gray-200 p-3 sm:p-4 flex-shrink-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center">
                      {builderMode === 'visual' ? (
                        <>
                          <Eye className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-500 flex-shrink-0" />
                          <span className="min-w-0">Live Preview</span>
                        </>
                      ) : (
                        <>
                          <Code className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-500 flex-shrink-0" />
                          <span className="min-w-0">HTML Code Editor</span>
                        </>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {builderMode === 'visual' 
                        ? 'See how your template looks in real-time'
                        : 'Edit HTML directly with syntax highlighting'
                      }
                    </p>
                  </div>
                  
                  <div className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 min-h-0">
                    {builderMode === 'visual' ? (
                      /* Live Preview */
                      <div className="bg-gray-50 p-2 sm:p-4 md:p-8 rounded-lg min-h-full">
                        {components.length > 0 ? (
                          <div className="mx-auto w-full max-w-4xl">
                            <div 
                              className="w-full overflow-x-auto"
                              dangerouslySetInnerHTML={{ __html: templateData.html_content }}
                            />
                          </div>
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <div className="text-4xl mb-4">📄</div>
                            <div className="text-lg font-medium mb-2">No Template Content</div>
                            <div className="text-sm">Add components from the left panel to build your template</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Code Editor */
                      <div className="h-full min-h-96">
                        <textarea
                          name="html_content"
                          value={templateData.html_content}
                          onChange={handleTemplateChange}
                          className={`w-full h-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg font-mono text-xs sm:text-sm resize-none ${
                            errors.html_content
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 bg-white"
                          }`}
                          style={{ 
                            minHeight: "300px", 
                            fontFamily: 'Monaco, Consolas, "Lucida Console", monospace' 
                          }}
                          placeholder="Enter your HTML template code here..."
                        />
                        {errors.html_content && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <X className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="break-words">{errors.html_content}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* No Template Types Message */
              <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 sm:p-8">
                <div className="text-center max-w-md">
                  <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🏗️</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Template Type Required
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    You need to create at least one template type before you can create templates. 
                    Template types define the basic structure and purpose (Invoice or Receipt).
                  </p>
                  <button
                    onClick={() => setCreationType('template-type')}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto text-sm sm:text-base"
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>Create Template Type First</span>
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 md:p-6 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            Cancel
          </button>
          
          {(creationType === 'template-type' || (creationType === 'template' && (canCreateTemplate() || isEditMode))) && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 text-sm font-semibold text-white border border-transparent rounded-lg focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-sm ${
                creationType === 'template-type'
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </span>
                </div>
              ) : (
                isEditMode 
                  ? `Update ${creationType === 'template-type' ? 'Template Type' : 'Template'}`
                  : creationType === 'template-type'
                  ? 'Create Template Type'
                  : 'Create Template'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;