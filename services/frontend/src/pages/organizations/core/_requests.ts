import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const API_BASE_URL = `${API_URL}/api/organizations/`; // Adjust backend URL if needed


console.log(API_URL);
// Get all organizations
export const getAllOrganizations = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching organizations", error);
      throw error;
    }
  };

  export const getOrganizationById = async (id: number) => {
    try {
        const response = await axios.get(API_BASE_URL + id);
        return response.data;
    } catch (error) {
        console.error(`Error fetching organization with ID ${id}`);
        throw error;
    }
  }

  // Create a new organization
export const createOrganization = async (data: { name: string; address: string, email?: string, contactNo?: string }) => {
    try {
      const response = await axios.post(API_BASE_URL, data);
      console.log("Organization Created:" , response.data); 
      return response.data;
    } catch (error) {
      console.error("Error creating organization", error);
      throw error;
    }
  };

  // Update an organization
export const updateOrganization = async (id: number, data: { name?: string; address?: string, email?: string, contactNo?: string, isActive?: boolean }) => {
  try {
    const response = await axios.put(API_BASE_URL + id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating organization with ID ${id}`, error);
    throw error;
  }
};

// Delete an organization
export const deleteOrganization = async (id: number) => {
  try {
    await axios.delete(API_BASE_URL + id);
  } catch (error) {
    console.error(`Error deleting organization with ID ${id}`, error);
    throw error;
  }
};
