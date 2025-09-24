

import dotenv from 'dotenv';
dotenv.config();
import httpRequest from '../utils/axios';


const propertyClient = httpRequest(process.env.PROP_SERVICE_URL!||"http://localhost:3009");




export const getAllPropertyParts = async (isActive:boolean=true) => {
     const response = await propertyClient.get("/api/propertypart",{
        params: { isActive }
    });
 
    return response.data;
}



       
export const getPropertyPartById= async (id:number) =>{
    const response = await propertyClient.get(`/api/propertypart/${id}`);
       
    return response.data;
}