import dotenv from "dotenv";
dotenv.config();
import { createApp } from "./app";
import { getAllOrganizations } from "./clients/organizationClient";



const PORT = process.env.PORT



async function start() {
    const app = await createApp();
    app.listen(PORT, () => {
      console.log(`Report & Analytics service running at http://localhost:${PORT}/graphql`);
    });
  
}

start();
