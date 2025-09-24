import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/AppDataSource";

import envoicetRoutes from "./controllers/envoices.controller";
import templateTypeRoutes from "./controllers/templateType.controller";
import templateRoutes from "./controllers/template.controller";
import path from "path";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(cors());

app.use(morgan('tiny'));


app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

const PORT = Number(process.env.PORT) || 3007;
// greg
AppDataSource.initialize().then(() => {
  console.log("✅ Database Connected");


  app.use("/api/invoices", envoicetRoutes);
  app.use("/api/template-type", templateTypeRoutes);
  app.use("/api/templates", templateRoutes);

  app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
});


