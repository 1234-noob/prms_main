import dotenv from 'dotenv';
dotenv.config();
import httpRequest from '../utils/axios';


const organizationClient = httpRequest(process.env.ORG_SERVICE_URL!||"http://localhost:3005");


export const getAllOrganizations = async (isActive:boolean=true) => {
    const response = await organizationClient.get("/api/organizations",{
        params: { isActive }
    });
  
    
    return response.data;
}

export const getOrganizationById= async (id:number) =>{
    const response = await organizationClient.get(`/api/organizations/${id}`);
  
    return response.data;
}

