import { getDisputeById } from './../services/dispute.service';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as DisputeService from '../services/dispute.service';
import { CreateDisputeDto, UpdateDisputeDto } from '../dtos/dispute.dto';
import upload from '../utils/fileUpload';  // Multer file upload handler



/**
 * @swagger
 * /api/disputes:
 *   post:
 *     summary: Create a new dispute
 *     tags: [Disputes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tenantId:
 *                 type: integer
 *               invoiceId:
 *                 type: integer
 *               reason:
 *                 type: string
 *               external_id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, resolved, rejected]
 *               submissionDate:
 *                 type: string
 *                 format: date-time
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Dispute created
 *       400:
 *         description: Validation error or file upload issue
 *       500:
 *         description: Server error
 */

export const createDispute = async (req: Request, res: Response) => {

    upload.single('file')(req, res, async (err: any) => {

        if (err) {
            return res.status(400).json({ message: 'File upload error', error: err.message });
        }
        if (req.file) {
            console.log("Uploaded File:", req.file);
            console.log("Uploaded File MIME Type:", req.file.mimetype);
        } else {
            console.log("No file uploaded.");
        }
        const { tenantId, invoiceId, reason } = req.body;

        req.body.tenantId = parseInt(tenantId, 10);
        req.body.invoiceId = parseInt(invoiceId, 10);
        const dto = plainToInstance(CreateDisputeDto, req.body);

        const errors = await validate(dto);

        if (errors.length > 0) {
            const formattedErrors = errors.map((err) => ({
                field: err.property,
                message: Object.values(err.constraints || {}).join(', '),
            }));
            return res.status(400).json({ message: 'Validation failed', errors: formattedErrors });
        }

        try {

            const filePath = req.file ? req.file.path : '';  // Get file path from Multer or leave it empty
            const formattedFilePath = filePath.replace(/\\/g, '/');
            const dispute = await DisputeService.createDispute({ ...dto, filePath: formattedFilePath });
            res.status(201).json({
                message: 'Dispute created successfully',
                data: dispute,
            });
        } catch (err) {
            res.status(500).json({ message: 'Error creating dispute', error: err });
        }
    });
};

export const updateDisputeStatus = async (req: Request, res: Response) => {
    // Step 1: Validate the status
    const disputeUpdate = await DisputeService.updateDisputeStatus(Number(req.params.id), req.body.status);

    // Step 2: Check if the dispute was found and updated
    if (!disputeUpdate) {
        return res.status(404).json({ message: 'Dispute not found' });
    }

    // Step 3: Return a success message with the updated dispute data
    return res.status(200).json({
        message: 'Dispute status updated successfully',
        data: disputeUpdate,
    });
};


export const updateDispute = async (req: Request, res: Response) => {
    try {

        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        // Extract dispute ID from params
        const disputeId = parseInt(req.params.id, 10);
        if (isNaN(disputeId)) {
            return res.status(400).json({ message: 'Invalid dispute ID' });
        }


        const existingDispute = await DisputeService.getDisputeById(disputeId);
        if (!existingDispute) {
            return res.status(404).json({ message: 'Dispute not found' });
        }

        // Prepare data (including filePath if uploaded)
        const updateData: UpdateDisputeDto & { filePath?: string } = {
            tenantId: req.body.tenantId ? parseInt(req.body.tenantId, 10) : undefined,
            invoiceId: req.body.invoiceId ? parseInt(req.body.invoiceId, 10) : undefined,
            status: req.body.status,
            reason: req.body.reason,
            external_id: req.body.external_id,
            submissionDate: req.body.submissionDate ? new Date(req.body.submissionDate) : existingDispute.submissionDate,

            filePath: req.file ? req.file.path.replace(/\\/g, '/') : existingDispute.filePath,
        };

        // Validate the request data using the DTO
        const dto = plainToInstance(UpdateDisputeDto, updateData);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const formattedErrors = errors.map((err) => ({
                field: err.property,
                message: Object.values(err.constraints || {}).join(', '),
            }));
            return res.status(400).json({ message: 'Validation failed', errors: formattedErrors });
        }

        try {
            // Update the dispute using the service
            const updatedDispute = await DisputeService.updateDispute(updateData, disputeId);

            if (!updatedDispute) {
                return res.status(404).json({ message: 'Dispute not found' });
            }

            // Return success response with updated dispute data
            return res.status(200).json({
                message: 'Dispute updated successfully',
                data: updatedDispute,
            });
        } catch (updateError: any) {
            // Handle errors from the update operation
            return res.status(500).json({ message: 'Error updating dispute', error: updateError.message });
        }
    } catch (err: any) {
        // Catch any unexpected errors
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Error updating dispute', error: err.message });
    }
};


export const getAllDisputes = async (req: Request, res: Response) => {
    try {
        const disputes = await DisputeService.getAllDisputes()
        res.status(200).json({
            message: 'Disputes retrieved successfully',
            data: disputes,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving disputes', error: err });
    }
}

export const getDisputeByIdHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid dispute ID' });
    }
    try {
        const dispute = await DisputeService.getDisputeById(id);
        if (!dispute) {
            return res.status(404).json({ message: 'Dispute not found' });
        }
        res.status(200).json({
            message: 'Dispute retrieved successfully',
            data: dispute,
        });
    } catch (err: any) {
        if (err.type === 'not_found') {
            return res.status(404).json({
                message: err.message,
            });
        }

        return res.status(500).json({
            message: 'Internal server error',
            error: err.message || err,
        });
    }

}

export const deleteDisputeHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid dispute ID' });
    }

    try {
        const dispute = await DisputeService.getDisputeById(id);
        if (!dispute) {
            return res.status(404).json({ message: 'Dispute not found' });
        }

        await DisputeService.deleteDispute(id);
        res.status(410).json({ message: 'Dispute deleted successfully' });
    } catch (err: any) {
        if (err.type === 'not_found') {
            return res.status(404).json({
                message: err.message,
            });
        }

        return res.status(500).json({
            message: 'Internal server error',
            error: err.message || err,
        });
    }

}
