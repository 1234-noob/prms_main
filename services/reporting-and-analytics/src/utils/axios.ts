
import axios, { AxiosInstance } from "axios";

const httpRequest = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL, // ✅ correct key name
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return instance;
};

export default httpRequest;
