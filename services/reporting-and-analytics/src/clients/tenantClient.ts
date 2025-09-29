import httpRequest from "../utils/axios";
import dotenv from "dotenv";

dotenv.config();


const tenantClient = httpRequest(process.env.TENANT_SERVICE_URL!);
const errorClient = httpRequest(process.env.ERROR_LOGGING_SERVICE_URL!)


export const getAllTenants = async () =>{

       
        
        const response = await tenantClient.get("/api/tenants");
       
       

 
    return response.data;
       
    
 
}


export const getTenantById = async (id:number) =>{
    const response = await tenantClient.get(`/api/tenants/${id}`);
    return response.data;
}



export const getAllTenantPropertyParts = async () =>{
    const response = await tenantClient.get("/api/tenants/property-parts");

    return response.data;
}


