import { plainToInstance } from 'class-transformer';
import { AppDataSource } from '../database/data-source';
import { Dispute } from '../entities/Dispute';
import { CreateDisputeDto, UpdateDisputeDto } from '../dtos/dispute.dto';
import { validate } from 'class-validator';

const disputeRepo = AppDataSource.getRepository(Dispute);

export const createDispute = async (rawData: CreateDisputeDto & { filePath: string }) => {
    const dto = plainToInstance(CreateDisputeDto, rawData);  // Convert raw data to DTO class instance
    const errors = await validate(dto);  // Validate the DTO

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

    const dispute = disputeRepo.create({
        tenantId: dto.tenantId,
        invoiceId: dto.invoiceId,
        reason: dto.reason,
        status: dto.status,
        filePath: rawData.filePath || '',
        exeternal_id: dto.external_id,
        submissionDate: dto.submissionDate,
    });

    return await disputeRepo.save(dispute);
};

export const updateDispute = async (rawData: UpdateDisputeDto & { filePath?: string }, id: number) => {

    const dto = plainToInstance(UpdateDisputeDto, rawData);
    const errors = await validate(dto);  // Validate the DTO


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

    // Get the filePath from the raw data, defaulting to an empty string if no file is provided
    const filePath = rawData.filePath || '';


    const dispute = await disputeRepo.update(id, {
        invoiceId: dto.invoiceId,
        tenantId: dto.tenantId,
        status: dto.status,
        filePath: filePath,
        reason: dto.reason,
        external_id: dto.external_id,
        submissionDate: dto.submissionDate,
    });

    // Return the updated dispute
    return await disputeRepo.findOne({ where: { id } });
};
export const getDisputesByTenant = async (tenantId: number) => {
    return await disputeRepo.find({ where: { tenantId } });
};

export const updateDisputeStatus = async (id: number, status: string) => {
    await disputeRepo.update(id, { status });
    return await disputeRepo.findOne({ where: { id } });
};

export const getAllDisputes = async () => {
    return await disputeRepo.find();
}

export const getDisputeById = async (id: number) => {
    try {
        const dispute = await disputeRepo.findOne({ where: { id } });
        return dispute;
    } catch (err) {
        console.error('Error fetching dispute by ID:', err);
        throw err;
    }
};

export const deleteDispute = async (id: number) => {
    const dispute = await disputeRepo.findOne({ where: { id } });
    try {
        if (!dispute) {
            throw {
                type: 'not_found',
                message: `Dispute with id ${id} not found.`,
            };
        }

    } catch (err) {
        console.error('Error deleting dispute:', err);
        throw err;
    }
    return await disputeRepo.remove(dispute);
}
