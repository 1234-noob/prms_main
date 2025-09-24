import { plainToInstance } from 'class-transformer';
import { AppDataSource } from "../database/data-source";
import { Maintenance } from "../entities/Maintenance";
import { validate } from 'class-validator';
import { error } from 'console';
import { CreateMaintenanceDto } from '../dtos/maintenance.dto';
import { UpdateMaintenanceDto } from '../dtos/maintenance.dto';

const maintenanceRepo = AppDataSource.getRepository(Maintenance);


export const createMaintenance = async (rawData: any) => {
    // Validate with DTO, not the Entity
    const dto = plainToInstance(CreateMaintenanceDto, rawData);
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

    // Create and save using the validated data
    const maintenance = maintenanceRepo.create({
        unit: dto.unit,
        propertyId: dto.propertyId,
        TenantId: dto.TenantId,
        description: dto.description || '',
        issueType: dto.issueType,
    });

    return await maintenanceRepo.save(maintenance);
};

export const getAllMaintenance = async () => {
    return await maintenanceRepo.find();
}

export const updateMaintenance = async (id: number, rawData: any) => {
    // Validate with DTO
    const dto = plainToInstance(UpdateMaintenanceDto, rawData);
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
    const maintenance = await maintenanceRepo.findOneBy({ id });
    if (!maintenance) {
        throw {
            type: 'not_found',
            message: `Maintenance with id ${id} not found.`,
        };
    }

    // Update and save
    maintenanceRepo.merge(maintenance, dto);
    return await maintenanceRepo.save(maintenance);
};

export const getMaintanceById = async (id: number) => {
    const maintenance = await maintenanceRepo.findOneBy({ id });
    if (!maintenance) {
        throw {
            type: 'not_found',
            message: `Maintenance with id ${id} not found.`,
        };
    }
    return maintenance;
}

export const deleteMaintenance = async (id: number) => {
    const maintenance = await maintenanceRepo.findOneBy({ id });
    if (!maintenance) {
        throw {
            type: 'not_found',
            message: `Maintenance with id ${id} not found.`,
        };
    }
    return await maintenanceRepo.remove(maintenance);
}