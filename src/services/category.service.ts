import { CategoryRepository } from "../repositories/category.repository";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/category.dto";
import { Category } from "../entities/Category";
import { AppError } from "../middlewares/error.middleware";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError(`La categoría con ID ${id} no existe`, 404);
    }
    return category;
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    if (!data.name?.trim()) {
      throw new AppError(
        "El nombre de la categoría es obligatorio y no puede estar vacío",
        400,
      );
    }

    const existing = await this.categoryRepository.findByName(data.name.trim());
    if (existing) {
      throw new AppError(
        `Ya existe una categoría con el nombre "${data.name.trim()}"`,
        409,
      );
    }

    return this.categoryRepository.create({ ...data, name: data.name.trim() });
  }

  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    await this.getById(id);

    if (data.name) {
      const existing = await this.categoryRepository.findByName(
        data.name.trim(),
      );
      if (existing && existing.id !== id) {
        throw new AppError(
          `Ya existe una categoría con el nombre "${data.name.trim()}"`,
          409,
        );
      }
      data.name = data.name.trim();
    }

    const updated = await this.categoryRepository.update(id, data);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    const category = await this.getById(id);

    if (category.products && category.products.length > 0) {
      throw new AppError(
        "No se puede eliminar la categoría porque tiene productos asociados",
        400,
      );
    }

    const deleted = await this.categoryRepository.delete(id);
    if (!deleted) {
      throw new AppError("Error al eliminar la categoría", 500);
    }
  }
}
