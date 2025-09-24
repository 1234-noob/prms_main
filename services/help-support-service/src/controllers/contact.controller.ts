import { Request, Response } from 'express';
import * as ContactService from '../services/contact.service';

export const getAllContacts = async (req: Request, res: Response) => {
    try {
        const Contact = await ContactService.getAllContacts();
        res.status(200).json({
            message: 'Contact requests retrieved successfully',
            data: Contact,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving maintenance requests',
            error: err,
        });
    }
};


export const createContacteHandler = async (req: Request, res: Response) => {
    try {
        const Contact = await ContactService.createContact(req.body);
        res.status(201).json({
            message: 'Contact request created successfully',
            data: Contact,
        });
    } catch (err: any) {
        res.status(500).json({
            message: 'Failed to create Contact request',
            error: err.message || err,
        });
    }
};


export const updateContactHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid Contact ID' });
    }

    try {
        const updatedContact = await ContactService.updateContact(id, req.body);
        res.status(200).json({
            message: 'Contact request updated successfully',
            data: updatedContact,
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


export const getContactById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid Contact ID' });
    }

    try {
        const Contact = await ContactService.getContactById(id);
        if (!Contact) {
            return res.status(404).json({ message: 'Contact request not found' });
        }
        res.status(200).json({
            message: 'Contact request retrieved successfully',
            data: Contact,
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

export const deleteContactHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid Contact ID' });
    }

    try {
        await ContactService.deleteContact(id);
        res.status(410).json({
            message: `Contact with ID ${id} has been successfully deleted.`,
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


