import { AppDataSource } from "../config/database";
import { Product } from "../entities/Product";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";

export class ProductRepository {
  private repo = AppDataSource.getRepository(Product);

  async findAll(): Promise<Product[]> {
    return this.repo.find({ order: { id: "ASC" } });
  }

  async findById(id: number): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.repo.find({ where: { categoryId }, order: { id: "ASC" } });
  }

  async create(data: CreateProductDto): Promise<Product> {
    const product = this.repo.create(data);
    return this.repo.save(product);
  }

  async update(id: number, data: UpdateProductDto): Promise<Product | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
