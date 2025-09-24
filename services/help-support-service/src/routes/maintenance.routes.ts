import { Router } from 'express';
import * as maintenanceController from '../controllers/maintenance.controller';
import { validateDto } from '../middlewares/validateDto';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from '../dtos/maintenance.dto';
const router = Router();

router.get('/', maintenanceController.getAllMaintenances);
router.post('/',validateDto(CreateMaintenanceDto), maintenanceController.createMaintenanceHandler);
router.put('/:id', validateDto(UpdateMaintenanceDto), maintenanceController.updateMaintenanceHandler);
router.get('/:id', maintenanceController.getMaintanceById);
router.delete('/:id', maintenanceController.deleteMaintenanceHandler);


export default router;