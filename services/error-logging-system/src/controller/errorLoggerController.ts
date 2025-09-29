import { Request, Response } from "express";

import logger from "../utils/logger";
import { publishMessage } from "../queue/producer";

export const errorLogger = async (req: Request, res: Response) => {
  try {
    const {
      origin,
      message,
      stack = null,
      statusCode,
      metadata = null,
    } = req.body;

    const applicationId = (req as any).application_id;

    await publishMessage("error_logs", {
      applicationId,
      origin,
      message,
      stack,
      statusCode,
      metadata,
    });

    res.status(201).json({
      success: true,
      message: "Error logged successfully",
    });
  } catch (err) {
    logger.error("Failed to log error:", err);
    res.status(500).json({ success: false, error: "Logging failed" });
  }
};

export const axiosTest = async (req: Request, res: Response) => {
  console.log("Axios test endpoint reached");

  res.status(200).json({ success: true, message: "Axios test endpoint" });
};
