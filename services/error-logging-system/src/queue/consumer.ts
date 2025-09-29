import { consumer, producer } from "./kafka";
import { ErrorLog } from "../model/ErrorLog";
import logger from "../utils/logger";

export const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "error_logs", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const logData = JSON.parse(message.value?.toString() || "{}");

      try {
        await ErrorLog.create(logData);
      } catch (error) {
        logger.error("Error saving log to database", { error, logData });

        // const retries = logData.retries ? logData.retries + 1 : 1;
        // if (retries > 5) {
        //   logger.error("Max retries reached for log", { logData });
        //   return;
        // }
        await producer.send({
          topic: "error_logs",
          messages: [{ value: JSON.stringify({ ...logData }) }],
        });
      }
    },
  });
};
