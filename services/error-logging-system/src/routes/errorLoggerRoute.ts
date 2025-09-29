import { Router } from "express";
import { axiosTest, errorLogger } from "../controller/errorLoggerController";
import { validateDto } from "../middleware/validate";
import { ErrorLogDto } from "../dto/ErrorLogDto";
import { validateApplicationHeader } from "../middleware/applicationHeader";
const router = Router();

router.post(
  "/log-error",
  validateApplicationHeader,
  validateDto(ErrorLogDto),
  errorLogger
);


export default router;
