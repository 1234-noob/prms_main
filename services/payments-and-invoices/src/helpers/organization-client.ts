import axios from "axios";

const axiosInstance = axios.create({ timeout: 5000 });

export async function getOrganizationDetails(orgId: number) {
  const ORG_SERVICE_URL = process.env.ORG_SERVICE_URL;

  if (!ORG_SERVICE_URL) {
    console.error("❌ ORG_SERVICE_URL is not defined");
    return { name: "Unknown Org", address: "N/A" };
  }

  const url = `${ORG_SERVICE_URL}/api/organizations/${orgId}`;
  console.log(`➡️ Calling: ${url}`);

  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error fetching organization:");
    if (error.response) {
      console.error("📦 Status:", error.response.status);
      console.error("📝 Response:", error.response.data);
    } else if (error.request) {
      console.error("🔌 No response received");
    } else {
      console.error("⚠️ Axios error:", error.message);
    }

    return {
      name: "Unknown Organization",
      address: "N/A",
    };
  }
}
