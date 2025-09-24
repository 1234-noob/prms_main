import dotenv from 'dotenv';
dotenv.config();
import httpRequest from '../utils/axios';


const propertyPartsClient = httpRequest(process.env.PROP_SERVICE_URL!||"http://localhost:3009");

export const getAllProperties = async (isActive:boolean=true) => {
    const response = await propertyPartsClient.get("/api/properties",{
        params: { isActive }
    });

    
    return response.data;
}


export const getPropertyById= async (id:number) =>{
    const response = await propertyPartsClient.get(`/api/properties/${id}`);
       
    return response.data;
}

