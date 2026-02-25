import { AppDataSource } from "../config/database";
import { Category } from "../entities/Category";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/category.dto"

export class CategoryRepository {
  private repo = AppDataSource.getRepository(Category);

  async findAll(): Promise<Category[]> {
    return this.repo.find({ order: { id: "ASC" } });
  }

  async findById(id: number): Promise<Category | null> {
    return this.repo.findOne({ where: { id }, relations: ["products"] });
  }

  async findByName(name: string): Promise<Category | null> {
    return this.repo.findOne({ where: { name } });
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    const category = this.repo.create(data);
    return this.repo.save(category);
  }

  async update(id: number, data: UpdateCategoryDto): Promise<Category | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
