import httpRequest from "../utils/axios";


import dotenv from "dotenv";

dotenv.config();


const contractClient = httpRequest(process.env.TENANT_SERVICE_URL!);



export const getAllContracts = async () =>{
    const response = await contractClient.get("/api/contracts");
    return response.data;
}


export const getContractById = async (id:number) =>{
    const response = await contractClient.get(`/api/contracts/${id}`);
    return response.data;
}   


export const getTenantByContractId = async (id:number) =>{
    const response = await contractClient.get(`/api/contracts/${id}/tenants`)
    console.log(response.data);
    return response.data;
    
}
