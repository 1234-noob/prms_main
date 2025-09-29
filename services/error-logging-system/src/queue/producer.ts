import logger from "../utils/logger";
import { producer } from "./kafka";

export const publishMessage = async (topic: string, message: any) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  } catch (error) {
    return logger.error("Error publishing message to Kafka", { error });
  }
};
