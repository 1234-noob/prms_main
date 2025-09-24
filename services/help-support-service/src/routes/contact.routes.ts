import { updateContactHandler } from './../controllers/contact.controller';
import { Router } from 'express';
import * as contactController from '../controllers/contact.controller';
import { validateDto } from '../middlewares/validateDto';
import { CreateContactDto } from '../dtos/contact.dto';

const router = Router();

router.get('/', contactController.getAllContacts);
router.post('/', validateDto(CreateContactDto), contactController.createContacteHandler);
router.put('/:id', validateDto(CreateContactDto), contactController.updateContactHandler);
router.get('/:id', contactController.getContactById);
router.delete('/:id', contactController.deleteContactHandler);


export default router;