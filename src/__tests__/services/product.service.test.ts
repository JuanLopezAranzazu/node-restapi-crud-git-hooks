import "reflect-metadata";
import { ProductService } from "../../services/product.service";
import { ProductRepository } from "../../repositories/product.repository";
import { CategoryRepository } from "../../repositories/category.repository";
import { Product } from "../../entities/Product";
import { Category } from "../../entities/Category";
import { AppError } from "../../middlewares/error.middleware";

jest.mock("../../repositories/product.repository");
jest.mock("../../repositories/category.repository");

const MockedProductRepository = ProductRepository as jest.MockedClass<
  typeof ProductRepository
>;
const MockedCategoryRepository = CategoryRepository as jest.MockedClass<
  typeof CategoryRepository
>;

const makeCategory = (overrides: Partial<Category> = {}): Category => ({
  id: 1,
  name: "Electronics",
  description: "Electronic devices",
  products: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: "Laptop",
  description: "A laptop",
  price: 999.99,
  stock: 10,
  active: true,
  categoryId: 1,
  category: makeCategory(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("ProductService", () => {
  let service: ProductService;
  let productRepoMock: jest.Mocked<ProductRepository>;
  let categoryRepoMock: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    MockedProductRepository.mockClear();
    MockedCategoryRepository.mockClear();
    service = new ProductService();
    productRepoMock = MockedProductRepository.mock
      .instances[0] as jest.Mocked<ProductRepository>;
    categoryRepoMock = MockedCategoryRepository.mock
      .instances[0] as jest.Mocked<CategoryRepository>;
  });

  describe("getAll", () => {
    it("should return an array of products", async () => {
      const products = [makeProduct(), makeProduct({ id: 2, name: "Phone" })];
      productRepoMock.findAll.mockResolvedValue(products);

      const result = await service.getAll();

      expect(result).toEqual(products);
      expect(productRepoMock.findAll).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when there are no products", async () => {
      productRepoMock.findAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should return a product by id", async () => {
      const product = makeProduct();
      productRepoMock.findById.mockResolvedValue(product);

      const result = await service.getById(1);

      expect(result).toEqual(product);
      expect(productRepoMock.findById).toHaveBeenCalledWith(1);
    });

    it("should throw when the product is not found", async () => {
      productRepoMock.findById.mockResolvedValue(null);

      await expect(service.getById(99)).rejects.toBeInstanceOf(AppError);

      await expect(service.getById(99)).rejects.toMatchObject({
        message: "El producto con ID 99 no existe",
        statusCode: 404,
      });
    });
  });

  describe("getByCategory", () => {
    it("should return products filtered by category", async () => {
      const products = [makeProduct(), makeProduct({ id: 2, name: "Phone" })];
      productRepoMock.findByCategory.mockResolvedValue(products);

      const result = await service.getByCategory(1);

      expect(result).toEqual(products);
      expect(productRepoMock.findByCategory).toHaveBeenCalledWith(1);
    });
  });

  describe("create", () => {
    it("should create and return a new product", async () => {
      const dto = { name: "Laptop", price: 999.99, categoryId: 1 };
      const product = makeProduct();

      categoryRepoMock.findById.mockResolvedValue(makeCategory());
      productRepoMock.create.mockResolvedValue(product);

      const result = await service.create(dto);

      expect(result).toEqual(product);
      expect(categoryRepoMock.findById).toHaveBeenCalledWith(1);
      expect(productRepoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Laptop", price: 999.99 }),
      );
    });

    it("should trim the product name before creating", async () => {
      const product = makeProduct();
      categoryRepoMock.findById.mockResolvedValue(makeCategory());
      productRepoMock.create.mockResolvedValue(product);

      await service.create({ name: "  Laptop  ", price: 100, categoryId: 1 });

      expect(productRepoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Laptop" }),
      );
    });

    it("should throw if name is empty", async () => {
      await expect(
        service.create({ name: "", price: 100, categoryId: 1 }),
      ).rejects.toMatchObject({
        message: "El nombre del producto es obligatorio",
        statusCode: 400,
      });
    });

    it("should throw if price is negative", async () => {
      await expect(
        service.create({ name: "Laptop", price: -5, categoryId: 1 }),
      ).rejects.toMatchObject({
        message: "El precio del producto debe ser un valor positivo",
        statusCode: 400,
      });
    });

    it("should throw if the category does not exist", async () => {
      categoryRepoMock.findById.mockResolvedValue(null);

      await expect(
        service.create({ name: "Laptop", price: 100, categoryId: 99 }),
      ).rejects.toMatchObject({
        message: "La categoría con ID 99 no existe",
        statusCode: 404,
      });
      expect(productRepoMock.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update and return the product", async () => {
      const updated = makeProduct({ name: "Updated Laptop", price: 1199.99 });
      productRepoMock.findById.mockResolvedValue(makeProduct());
      productRepoMock.update.mockResolvedValue(updated);

      const result = await service.update(1, {
        name: "Updated Laptop",
        price: 1199.99,
      });

      expect(result).toEqual(updated);
      expect(productRepoMock.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ name: "Updated Laptop", price: 1199.99 }),
      );
    });

    it("should throw if the product does not exist", async () => {
      productRepoMock.findById.mockResolvedValue(null);

      await expect(service.update(99, { name: "X" })).rejects.toMatchObject({
        message: "El producto con ID 99 no existe",
        statusCode: 404,
      });
    });

    it("should validate the new category when categoryId is provided", async () => {
      productRepoMock.findById.mockResolvedValue(makeProduct());
      categoryRepoMock.findById.mockResolvedValue(null);

      await expect(service.update(1, { categoryId: 99 })).rejects.toMatchObject(
        {
          message: "La categoría con ID 99 no existe",
          statusCode: 404,
        },
      );

      expect(categoryRepoMock.findById).toHaveBeenCalledWith(99);
    });

    it("should throw if the new price is negative", async () => {
      productRepoMock.findById.mockResolvedValue(makeProduct());

      await expect(service.update(1, { price: -10 })).rejects.toMatchObject({
        message: "El precio del producto debe ser un valor positivo",
        statusCode: 400,
      });

      expect(productRepoMock.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete an existing product", async () => {
      productRepoMock.findById.mockResolvedValue(makeProduct());
      productRepoMock.delete.mockResolvedValue(true);

      await expect(service.delete(1)).resolves.not.toThrow();
      expect(productRepoMock.delete).toHaveBeenCalledWith(1);
    });

    it("should throw if the product is not found", async () => {
      productRepoMock.findById.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toMatchObject({
        message: "El producto con ID 99 no existe",
        statusCode: 404,
      });
      expect(productRepoMock.delete).not.toHaveBeenCalled();
    });

    it("should throw if the repository fails to delete", async () => {
      productRepoMock.findById.mockResolvedValue(makeProduct());
      productRepoMock.delete.mockResolvedValue(false);

      await expect(service.delete(1)).rejects.toMatchObject({
        message: "Error al eliminar el producto",
        statusCode: 500,
      });
      expect(productRepoMock.delete).toHaveBeenCalledWith(1);
    });
  });
});
