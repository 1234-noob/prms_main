import dotenv from "dotenv";
dotenv.config();
import httpRequest from "../utils/axios";



const paymentClient = httpRequest(process.env.PAYMENT_SERVICE_URL!)


export const getAllInvoices = async () => {
    const response = await paymentClient.get('/api/invoices');
    
    return response.data;
}



export const getInvoiceById = async (id: number) => {
    const response = await paymentClient.get(`/api/invoices/${id}`);
    
    return response.data;
}