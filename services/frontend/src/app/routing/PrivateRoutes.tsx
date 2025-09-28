import { Navigate, Route, Routes } from "react-router-dom"
import { MasterLayout } from "../../_nilesh/layout/MasterLayout"
import { DashboardWrapper } from "../../pages/DashboardPage"
import OrganizationsPage from "../../pages/organizations/OrganizationsPage"
import ManageLayout from "../../_nilesh/layout/ManageLayout"
import PropertyPartsPage from "../../pages/PropertyParts/PropertyPartsPage"
import MyUnitsPage from "../../pages/MyUnits"
import Ecommerce from "../../pages/Dashboard/ECommerce"
import ManageOrganizationsPage from "../../pages/organizations/ManageOrganizationsPage"
import MakePaymentPage from "../../pages/MakePaymentPage"
import ViewContractsPage from "../../pages/RentalAgreements/ViewContractsPage"
import ContractManagementPage from "../../pages/RentalAgreements/ContractManagementPage"
import PaymentHistoryPage from "../../pages/PaymentHistoryPage"
import PendingTDSPage from "../../pages/TDS/PendingTDSPage"
import TenantPaymentHistoryPage from "../../pages/TenantPaymentHistory"
import TenantPaymentStatusPage from "../../pages/TenantPaymentStatusPage"
import TDSDeductionsPage from "../../pages/TDS/TDSDeductionsPage"
import RaisePaymentDisputesPage from "../../pages/RaisePaymentDisputesPage"
import RecurringInvoicesPage from "../../pages/RecurringInvoicesPage"
import RentAjustmentsRenewalsPage from "../../pages/RentalAgreements/RentAjustmentsRenewalsPage"
import ContactManagementPage from "../../pages/ContactManagementPage"
import MaintenanceRequest from "../../pages/MaintenanceRequest"
import ModulePage from "../../pages/ModulePage"
import PropertiesPage from "../../pages/Properties/PropertiesPage"
import TenantsPage from "../../pages/Tenant/TenantsPage"
import RentalAgreementsPage from "../../pages/RentalAgreements/RentalAgreementsPage"
import HierarchyManagement from "../../pages/HierarchyManagement"
import InvoiceTemplates from "../../pages/InvoiceTemplates"
import ReportAndAnalyticsPage from "../../pages/Report And Analytics/ReportAndAnalyticsPage"



const PrivateRoutes = () => {

    return (
        <Routes >
            <Route element={<MasterLayout />}>
                <Route path="auth/*" element={<Navigate to='/dashboard' />} />
                <Route path='dashboard' element={<Ecommerce />} />
            </Route>
            <Route element={<ManageLayout />}>
                <Route path="/organizations-list" element={<OrganizationsPage />} />
                <Route path="/manage-organizations" element={<ManageOrganizationsPage />} />
                <Route path="/module-management" element={<ModulePage />} />
                <Route path="/manage-properties" element={<PropertiesPage />} />
                <Route path="/manage-property-parts" element={<PropertyPartsPage />} />
                <Route path="/manage-tenants" element={<TenantsPage />} />
                <Route path="/manage-contract" element={<ContractManagementPage />} />
                <Route path="/payment-history" element={<TenantPaymentHistoryPage />} />
                <Route path="/rental-agreements" element={<RentalAgreementsPage />} />
                <Route path="/recurring-invoices" element={<RecurringInvoicesPage />} />
                <Route path="/rent-ajustments-renewals" element={<RentAjustmentsRenewalsPage />} />
                <Route path="/payment-status" element={<TenantPaymentStatusPage />} />
                <Route path="/tds-deductions-reports" element={<TDSDeductionsPage />} />
                <Route path="/make-payment" element={<MakePaymentPage />} />
                <Route path="/tds-deduction" element={<PendingTDSPage />} />
                <Route path="/payment-receipts" element={<PaymentHistoryPage />} />
                <Route path="/contract-renewal-status" element={<ViewContractsPage />} />
                <Route path="/raise-payment-disputes" element={<RaisePaymentDisputesPage />} />
                <Route path="/maintenance-requests" element={<MaintenanceRequest />} />
                <Route path="/contact-management" element={<ContactManagementPage />} />
                <Route path="/hierarchy" element={<HierarchyManagement />} />
                <Route path="/Invoice-Templates" element={<InvoiceTemplates />} />
                <Route path="/reports" element={<ReportAndAnalyticsPage/>}/>
            </Route>
        </Routes>
    )
}

export { PrivateRoutes }