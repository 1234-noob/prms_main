import axios from "axios";

// Define separate base URLs for different services
const TENANT_BASE_URL = process.env.REACT_APP_API_URL_RENTAL_AGREEMENT; // For tenant-related operations (Port 3005)
const PROPERTY_BASE_URL = process.env.REACT_APP_API_URL_PROPERTY;     // For property-related operations (Port 3009)

// Construct specific API URLs using the appropriate base URL
const TENANT_URL = `${TENANT_BASE_URL}/api/tenants/`;
const PROPERTY_PART_URL = `${PROPERTY_BASE_URL}/api/propertypart/`;
const TENANT_MAPPING_URL = `${TENANT_BASE_URL}/api/tenants/property-parts/`; // Assuming tenant mappings are with the tenant service
const TOGGLE_MAPPING_STATUS_URL = `${TENANT_BASE_URL}/api/tenants/property-parts/`; // Assuming tenant mapping status is with the tenant service


// Get all properties (This function's name is misleading, it fetches tenants)
export const getAllTenants = async () => {
  try {
    const response = await axios.get(TENANT_URL, {
      params: {
        isActive: true,
        organization_id: 1,
        includeContracts: true
      }
    });
    const tenants = response.data.map((tenant: any) => {
      const mapping = tenant.mappings[0] || {};
      const contracts = tenant.contracts[0] || {};
      return {
        id: tenant.id,
        name: tenant.name,
        contact: tenant.contact,
        email: tenant.email,
        isActive: tenant.isActive,
        organization_id: mapping.organization_id || null,
        organization_name: mapping.organization_name || "",
        property_id: mapping.property_id || null,
        property_name: mapping.property_name || "",
        property_part_id: mapping.property_part_id || null,
        property_part_name: mapping.property_part_name || "",
        rent_amount: contracts.rent_amount || null,
        contract_start_date: contracts.start_date || null,
        contract_end_date: contracts.end_date || null,
        tds_applicable: mapping.tds_applicable || false,
      };
    });

    return tenants;
  }
  catch (error) {
    console.error("Error fetching tenant", error);
    throw error;
  }
};

export const getTenantById = async (id: number) => {
  try {
    const response = await axios.get(TENANT_URL + id, {
      params: {
        includeContracts: true
      }
    });
    const tenant = response.data;
    const mapping = tenant.mappings?.[0] || {};
    const contracts = tenant.contracts?.[0] || {};
    console.log(tenant)
    return {
      id: tenant.id,
      name: tenant.name,
      contact: tenant.contact,
      email: tenant.email,
      isActive: tenant.isActive,
      organization_id: mapping.organization_id || null,
      organization_name: mapping.organization_name || "",
      property_id: mapping.property_id || null,
      property_name: mapping.property_name || "",
      property_part_id: mapping.property_part_id || null,
      property_part_name: mapping.property_part_name || "",
      rent_amount: contracts.rent_amount || null,
      contract_start_date: contracts.start_date || null,
      contract_end_date: contracts.end_date || null,
      tds_applicable: mapping.tds_applicable || false,
    };
  } catch (error) {
    console.error(`Error fetching tenant with ID ${id}`);
    throw error;
  }
}

export const getPropertyPartByPropertyId = async (id: number) => {
  try {
    console.log("propertyid" + id)
    const response = await axios.get(PROPERTY_PART_URL, {
      params: { property_id: id }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching property part with property ID ${id}`); // Changed error message for clarity
    throw error;
  }
}

export const createTenant = async (data: {
  name: string;
  contact: string;
  email: string;
}) => {
  try {
    const formattedData = { ...data };
    const response = await axios.post(TENANT_URL, formattedData);
    return response.data;
  } catch (error) {
    console.error("Error creating tenant", error);
    throw error;
  }
};

export const createTenantMapping = async (data: {
  tenant_id: number;
  organization_id: number;
  organization_name: string;
  property_id: number;
  property_name: string;
  property_part_id: number;
  property_part_name: string;
}) => {
  try {
    const formattedData = { ...data };
    const response = await axios.post(TENANT_MAPPING_URL, formattedData);
    return response.data;
  } catch (error) {
    console.error("Error creating tenant mapping", error); // Changed error message for clarity
    throw error;
  }
};

// Update a property (This function's name is misleading, it updates a tenant)
export const updateTenant = async (id: number, data: {
  name?: string;
  contact?: string;
  email?: string;
  isActive?: boolean
}) => {
  try {
    const response = await axios.put(TENANT_URL + id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating tenant with ID ${id}`, error);
    throw error;
  }
};

export const deleteTenant = async (id: number, data: {
  isActive?: boolean;
}) => {
  try {
    const response = await axios.patch(TOGGLE_MAPPING_STATUS_URL + id + "/status/", data);
    return response.data;
  } catch (error) {
    console.error(`Error updating tenant mapping status with ID ${id}`, error);
    throw error;
  }
};