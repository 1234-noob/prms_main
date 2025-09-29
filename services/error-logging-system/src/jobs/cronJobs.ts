import cron from "node-cron";
import { ErrorLog } from "../model/ErrorLog";
import logger from "../utils/logger";
import { Op } from "sequelize";

export const scheduleErrorLogCleanup = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 5);

      await ErrorLog.destroy({
        where: {
          createdAt: {
            [Op.lt]: cutoff,
          },
        },
      });
    } catch (err) {
      logger.error("Failed to delete expired logs", err);
    }
  });
};
