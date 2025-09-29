import { Kafka, Partitioners } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID!,
  brokers: [process.env.KAFKA_BROKER!],
});

export const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
export const consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID!,
});
