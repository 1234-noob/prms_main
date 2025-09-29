import { kafka } from "./kafka";

export const createTopics = async () => {
  const admin = kafka.admin();
  await admin.connect();

  const existingTopics = await admin.listTopics();
  if (!existingTopics.includes("error_logs")) {
    await admin.createTopics({
      topics: [
        {
          topic: "error_logs",
          numPartitions: process.env.NODE_ENV === "production" ? 3 : 1,
          replicationFactor: 1,
        },
      ],
    });
  }

  admin.disconnect();
};
