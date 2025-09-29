import httpRequest from "../utils/axios";
const errorLoggingClient = httpRequest(process.env.ERROR_LOGGING_SERVICE_URL!);


export async function logError(origin: string, error: any) {
  await errorLoggingClient.post("api/log-error", {
    origin,
    message: error.message,
    stack: error.stack,
    statusCode: error.status || 500,
    meta: {},
  });
}