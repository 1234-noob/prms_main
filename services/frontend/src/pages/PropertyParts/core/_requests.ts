import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_PROPERTY;
const API_BASE_URL = `${API_URL}/api/propertypart/`; 

// Get all properties
export const getAllPropertyParts = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching property part", error);
      throw error;
    }
  };

  export const getPropertyPartById = async (id: number) => {
    try {
        const response = await axios.get(API_BASE_URL + id);
        return response.data;
    } catch (error) {
        console.error(`Error fetching property part with ID ${id}`);
        throw error;
    }
  }

  // Create a new property
export const createPropertyPart = async (data: {property_id: number; part_name: string; status: string}) => {
    try {
      const response = await axios.post(API_BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error("Error creating property part", error);
      throw error;
    }
  };

  // Update a property
export const updatePropertyPart = async (id: number, data: { part_name?: string; status?: string }) => {
  try {
    const response = await axios.put(API_BASE_URL + id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating property part with ID ${id}`, error);
    throw error;
  }
};

// Delete a property
export const deletePropertyPart = async (id: number) => {
  try {
    await axios.delete(API_BASE_URL + id);
  } catch (error) {
    console.error(`Error deleting property part with ID ${id}`, error);
    throw error;
  }
};
