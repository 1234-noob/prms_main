import { plainToInstance } from 'class-transformer';
import { AppDataSource } from "../database/data-source";
import { Maintenance } from "../entities/Maintenance";
import { validate } from 'class-validator';
import { error } from 'console';


import { CreateContactDto } from '../dtos/contact.dto';
import { Contact } from "../entities/Contact";

const contactRepo = AppDataSource.getRepository(Contact);


export const createContact = async (rawData: any) => {
    // Validate with DTO, not the Entity
    const dto = plainToInstance(CreateContactDto, rawData);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
        const formattedErrors = errors.map((err) => ({
            field: err.property,
            message: Object.values(err.constraints || {}).join(', '),
        }));

        throw {
            type: 'validation',
            errors: formattedErrors,
        };
    }


    const contact = contactRepo.create({
        unit: dto.unit,
        propertyId: dto.propertyId,
        tenantId: dto.tenantId,
        description: dto.description || '',
        reason: dto.reason,
        status: dto.status,
        externalId: dto.external_id,
    });




    return await contactRepo.save(contact);
};

export const getAllContacts = async () => {
    return await contactRepo.find();
}

export const updateContact = async (id: number, rawData: any) => {
    // Validate with DTO
    const dto = plainToInstance(CreateContactDto, rawData);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
        const formattedErrors = errors.map((err) => ({
            field: err.property,
            message: Object.values(err.constraints || {}).join(', '),
        }));

        throw {
            type: 'validation',
            errors: formattedErrors,
        };
    }

    // Check if maintenance exists
    const maintenance = await contactRepo.findOneBy({ id });
    if (!maintenance) {
        throw {
            type: 'not_found',
            message: `Contact with id ${id} not found.`,
        };
    }

    // Update and save
    contactRepo.merge(maintenance, dto);
    return await contactRepo.save(maintenance);
};

export const getContactById = async (id: number) => {
    const maintenance = await contactRepo.findOneBy({ id });
    if (!maintenance) {
        throw {
            type: 'not_found',
            message: `Contact with id ${id} not found.`,
        };
    }
    return maintenance;
}

export const deleteContact = async (id: number) => {
    const maintenance = await contactRepo.findOneBy({ id });
    if (!maintenance) {
        throw {
            type: 'not_found',
            message: `Contact with id ${id} not found.`,
        };
    }
    return await contactRepo.remove(maintenance);
}