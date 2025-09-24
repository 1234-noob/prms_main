import { Repository } from "typeorm";
import { TdsDeduction } from "../entities/tds.entity";
import { CreateTdsDto } from "../dtos/create-tds.dto";
import { UpdateTdsDto } from "../dtos/update-tds.dto";
import { AppDataSource } from "../config/AppDataSource";

export class TdsService {
  private readonly repo: Repository<TdsDeduction>;

  constructor() {
    this.repo = AppDataSource.getRepository(TdsDeduction);
  }

  async createTds(data: CreateTdsDto): Promise<TdsDeduction> {
    const rec = this.repo.create(data);
    return this.repo.save(rec);
  }

  async getAllTds(): Promise<TdsDeduction[]> {
    return this.repo.find();
  }

  async getTdsById(id: number): Promise<TdsDeduction | null> {
    return this.repo.findOneBy({ id });
  }

  async updateTds(id: number, data: UpdateTdsDto): Promise<TdsDeduction | null> {
    await this.repo.update(id, data);
    return this.repo.findOneBy({ id });
  }

  async deleteTds(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
