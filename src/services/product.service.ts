import { ProductRepository } from "../repositories/product.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";
import { Product } from "../entities/Product";
import { AppError } from "../middlewares/error.middleware";

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async getAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError(`El producto con ID ${id} no existe`, 404);
    }
    return product;
  }

  async getByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository.findByCategory(categoryId);
  }

  async create(data: CreateProductDto): Promise<Product> {
    if (!data.name?.trim())
      throw new AppError("El nombre del producto es obligatorio", 400);
    if (data.price == null || data.price < 0)
      throw new AppError(
        "El precio del producto debe ser un valor positivo",
        400,
      );

    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new AppError(
        `La categoría con ID ${data.categoryId} no existe`,
        404,
      );
    }

    return this.productRepository.create({ ...data, name: data.name.trim() });
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    await this.getById(id);

    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new AppError(
          `La categoría con ID ${data.categoryId} no existe`,
          404,
        );
      }
    }

    if (data.price !== undefined && data.price < 0) {
      throw new AppError(
        "El precio del producto debe ser un valor positivo",
        400,
      );
    }

    if (data.name) data.name = data.name.trim();

    const updated = await this.productRepository.update(id, data);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new AppError("Error al eliminar el producto", 500);
    }
  }
}
