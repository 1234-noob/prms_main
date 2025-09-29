import dotenv from "dotenv";
import express, { Request, Response } from "express";
import sequelize from "./db/db";
import { scheduleErrorLogCleanup } from "./jobs/cronJobs";
dotenv.config();

import errorLoggerRoute from "./routes/errorLoggerRoute";
import { producer } from "./queue/kafka";
import { consumeMessages } from "./queue/consumer";
import { createTopics } from "./queue/admin";
import logger from "./utils/logger";
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/health-check", (req: Request, res: Response) => {
  res.send("Health check");
});

app.use("/api", errorLoggerRoute);


(async () => {
  try {
    // Database
    await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync();
    console.log("Database synced");

    // Kafka
    await createTopics(); 
    await producer.connect(); 
    await consumeMessages(); 

    // Jobs
    scheduleErrorLogCleanup();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("Server startup failed:", err);
  }
})();
