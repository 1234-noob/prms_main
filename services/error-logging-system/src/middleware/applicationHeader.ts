// middlewares/applicationHeader.ts
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
// import { ResponseData } from "../utils/response";

export const validateApplicationHeader = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const applicationId =
    req.headers["application_id"] || req.headers["application-id"];

  if (!applicationId || typeof applicationId !== "string") {
    logger.error("Missing or invalid application_id header");
    res.status(400).json({
      message: "Missing or invalid application_id header",

      error: "You must provide a valid application_id in request headers",
    });
    return;
  }
  console.log("Valid application_id header:", applicationId);
  // Attach to request object
  (req as any).application_id = applicationId;
  next();
};
