import { Eye, Download } from "lucide-react"
import { StatusBadge } from "./StatusBagde"
import { useQuery } from "@apollo/client/react"
import { TEST_QUERY } from "../core/_request"



interface ReportData {
  id: string
  reportType: string
  propertyName: string
  propertyLocation: string
  organizationName: string
  organizationEmail: string
  tenantName: string
  tenantEmail: string
  propertyPartName: string
  propertyPartStatus: "Rented" | "Available"
  contractStartDate: string
  contractEndDate: string
  invoiceAmount: string
  invoiceDueDate: string
 
}

const reportsData: ReportData[] = [
  {
    id: "CNT001",
    reportType: "Property Contract",
    propertyName: "Sunshine Apartments",
    propertyLocation: "Mumbai, Maharashtra",
    organizationName: "Sunshine Properties Ltd",
    organizationEmail: "contact@sunshineproperties.com",
    tenantName: "John Smith",
    tenantEmail: "john.smith@email.com",
    propertyPartName: "Unit 101 - 2BHK",
    propertyPartStatus: "Rented",
    contractStartDate: "01/01/2025",
    contractEndDate: "31/12/2025",
    invoiceAmount: "₹25,000",
    invoiceDueDate: "30/09/2025",

  },
  {
    id: "CNT002",
    reportType: "Property Contract",
    propertyName: "Green Valley Complex",
    propertyLocation: "Pune, Maharashtra",
    organizationName: "Green Valley Real Estate",
    organizationEmail: "info@greenvalley.com",
    tenantName: "Sarah Johnson",
    tenantEmail: "sarah.johnson@email.com",
    propertyPartName: "Unit 205 - 3BHK",
    propertyPartStatus: "Available",
    contractStartDate: "15/03/2025",
    contractEndDate: "14/03/2026",
    invoiceAmount: "₹35,000",
    invoiceDueDate: "15/10/2025",

  },
  {
    id: "CNT003",
    reportType: "Property Contract",
    propertyName: "City Center Plaza",
    propertyLocation: "Delhi, NCR",
    organizationName: "Metro Development Corp",
    organizationEmail: "admin@metrodev.com",
    tenantName: "Mike Wilson",
    tenantEmail: "mike.wilson@email.com",
    propertyPartName: "Office Space A-301",
    propertyPartStatus: "Rented",
    contractStartDate: "01/06/2025",
    contractEndDate: "31/05/2026",
    invoiceAmount: "₹50,000",
    invoiceDueDate: "01/10/2025",
   
  },
  {
    id: "CNT004",
    reportType: "Property Contract",
    propertyName: "Royal Heights",
    propertyLocation: "Bangalore, Karnataka",
    organizationName: "Royal Estate Holdings",
    organizationEmail: "contact@royalestates.com",
    tenantName: "Emily Davis",
    tenantEmail: "emily.davis@email.com",
    propertyPartName: "Unit 402 - 1BHK",
    propertyPartStatus: "Available",
    contractStartDate: "01/09/2024",
    contractEndDate: "31/08/2025",
    invoiceAmount: "₹18,000",
    invoiceDueDate: "25/09/2025",
  
  },
  {
    id: "CNT005",
    reportType: "Property Contract",
    propertyName: "Garden View Residency",
    propertyLocation: "Chennai, Tamil Nadu",
    organizationName: "Garden Properties Inc",
    organizationEmail: "info@gardenview.com",
    tenantName: "Robert Brown",
    tenantEmail: "robert.brown@email.com",
    propertyPartName: "Unit 103 - 2BHK",
    propertyPartStatus: "Rented",
    contractStartDate: "01/07/2025",
    contractEndDate: "30/06/2026",
    invoiceAmount: "₹28,000",
    invoiceDueDate: "20/09/2025",

  },
  {
    id: "CNT006",
    reportType: "Property Contract",
    propertyName: "Metro Towers",
    propertyLocation: "Hyderabad, Telangana",
    organizationName: "Metro Infrastructure Ltd",
    organizationEmail: "support@metrotowers.com",
    tenantName: "Lisa Anderson",
    tenantEmail: "lisa.anderson@email.com",
    propertyPartName: "Unit 801 - 3BHK Premium",
    propertyPartStatus: "Available",
    contractStartDate: "01/04/2025",
    contractEndDate: "31/03/2026",
    invoiceAmount: "₹45,000",
    invoiceDueDate: "01/10/2025",

  }
]

export function ReportsTable() {

    


    

  return (
    <div className="bg-card border border-border rounded-none overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f0f6ff]">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
                CONTRACT ID
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
                PROPERTY
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
                ORGANIZATION
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
                TENANT
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
                PROPERTY PART
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
                PART STATUS
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
                CONTRACT PERIOD
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
                INVOICE AMOUNT
              </th>
             
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {reportsData.map((report, index) => (
              <tr 
                key={report.id} 
                className={`border-t border-border hover:bg-table-row-hover transition-colors ${
                  index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                }`}
              >
                <td className="py-4 px-4 text-sm font-medium text-foreground">
                  {report.id}
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-foreground">
                    {report.propertyName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {report.propertyLocation}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-foreground">
                    {report.organizationName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {report.organizationEmail}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-foreground">
                    {report.tenantName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {report.tenantEmail}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-foreground">
                    {report.propertyPartName}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <StatusBadge
                   status={report.propertyPartStatus}
                  
                  />
                   
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-foreground">
                    {report.contractStartDate}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    to {report.contractEndDate}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-foreground">
                    {report.invoiceAmount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Due: {report.invoiceDueDate}
                  </div>
                </td>
               
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button   className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button  className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}