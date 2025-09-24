import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; 
const API_BASE_URL = `${API_URL}/api/properties/`;

// Get all properties
export const getAllProperties = async () => { 
    try {
      const response = await axios.get(API_BASE_URL);
      console.log("properties: " , response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching properties", error);
      throw error;
    }
  };

  export const getPropertyById = async (id: number) => {
    try {
        const response = await axios.get(API_BASE_URL + id);
        return response.data;
    } catch (error) {
        console.error(`Error fetching property with ID ${id}`);
        throw error;
    }
  }

  // Create a new property
export const createProperty = async (data: { name: string; organization_id: number; organization_name: string;  location: string; splitable: boolean }) => {
    try {
      const response = await axios.post(API_BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error("Error creating property", error);
      throw error;
    }
  };

  // Update a property
export const updateProperty = async (id: number, data: { name?: string; organization_name?: string;  location?: string; splitable?: boolean; isActive?: boolean; }) => {
  try {
    const response = await axios.put(API_BASE_URL + id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating property with ID ${id}`, error);
    throw error;
  }
};

// Delete a property
export const deleteProperty = async (id: number) => {
  try {
    await axios.delete(API_BASE_URL + id);
  } catch (error) {
    console.error(`Error deleting property with ID ${id}`, error);
    throw error;
  }
};
