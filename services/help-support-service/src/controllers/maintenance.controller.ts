import { Request, Response } from 'express';
import * as MaintenanceService from '../services/maintenance.service';

export const getAllMaintenances = async (req: Request, res: Response) => {
    try {
        const maintenances = await MaintenanceService.getAllMaintenance();
        res.status(200).json({
            message: 'Maintenance requests retrieved successfully',
            data: maintenances,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving maintenance requests',
            error: err,
        });
    }
};


export const createMaintenanceHandler = async (req: Request, res: Response) => {
    try {
        const maintenance = await MaintenanceService.createMaintenance(req.body);
        res.status(201).json({
            message: 'Maintenance request created successfully',
            data: maintenance,
        });
    } catch (err: any) {
        res.status(500).json({
            message: 'Failed to create maintenance request',
            error: err.message || err,
        });
    }
};


export const updateMaintenanceHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid maintenance ID' });
    }

    try {
        const updatedMaintenance = await MaintenanceService.updateMaintenance(id, req.body);
        res.status(200).json({
            message: 'Maintenance request updated successfully',
            data: updatedMaintenance,
        });
    } catch (err: any) {
        if (err.type === 'validation') {
            return res.status(400).json({
                message: 'Validation failed',
                errors: err.errors,
            });
        }

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
};


export const getMaintanceById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid maintenance ID' });
    }

    try {
        const maintenance = await MaintenanceService.getMaintanceById(id);
        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }
        res.status(200).json({
            message: 'Maintenance request retrieved successfully',
            data: maintenance,
        });
    } catch (err: any) {
        if (err.type === 'validation') {
            return res.status(400).json({
                message: 'Validation failed',
                errors: err.errors,
            });
        }

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

export const deleteMaintenanceHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid maintenance ID' });
    }

    try {
        await MaintenanceService.deleteMaintenance(id);
        res.status(410).json({
            message: `Maintenance with ID ${id} has been successfully deleted.`,
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
};


