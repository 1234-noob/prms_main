import { getDisputeByIdHandler } from './../controllers/dispute.controller';
import { Router } from 'express';
import * as DisputeController from '../controllers/dispute.controller';
import { validateDto } from '../middlewares/validateDto';
import { CreateDisputeDto, UpdateDisputeDto, UpdateDisputeStatusDto } from '../dtos/dispute.dto';
import upload from '../utils/fileUpload';

const router = Router();

router.post('/', DisputeController.createDispute);
router.patch('/:id', validateDto(UpdateDisputeStatusDto), DisputeController.updateDisputeStatus);

router.put('/:id', upload.single('file'), DisputeController.updateDispute);
router.get('/', DisputeController.getAllDisputes);
router.delete('/:id', DisputeController.deleteDisputeHandler);
router.get('/:id', DisputeController.getDisputeByIdHandler);
// router.get('/tenant/:tenantId', DisputeController.getDisputesByTenant);
// router.patch('/:id/status', DisputeController.updateDisputeStatus);

export default router;
