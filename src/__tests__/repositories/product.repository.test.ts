import "reflect-metadata";
import { ProductRepository } from "../../repositories/product.repository";
import { AppDataSource } from "../../config/database";
import { Product } from "../../entities/Product";
import { Category } from "../../entities/Category";

jest.mock("../../config/database", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: "Laptop",
  description: "A laptop",
  price: 999.99,
  stock: 10,
  active: true,
  categoryId: 1,
  category: {} as Category,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("ProductRepository", () => {
  let repository: ProductRepository;
  let repoMock: Record<string, jest.Mock>;

  beforeEach(() => {
    repoMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(repoMock);
    repository = new ProductRepository();
  });

  describe("findAll", () => {
    it("should return all products ordered by id ASC", async () => {
      const products = [makeProduct(), makeProduct({ id: 2, name: "Phone" })];
      repoMock.find.mockResolvedValue(products);

      const result = await repository.findAll();

      expect(result).toEqual(products);
      expect(repoMock.find).toHaveBeenCalledWith({ order: { id: "ASC" } });
    });
  });

  describe("findById", () => {
    it("should return a product by id", async () => {
      const product = makeProduct();
      repoMock.findOne.mockResolvedValue(product);

      const result = await repository.findById(1);

      expect(result).toEqual(product);
      expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("should return null when not found", async () => {
      repoMock.findOne.mockResolvedValue(null);

      const result = await repository.findById(99);

      expect(result).toBeNull();
    });
  });

  describe("findByCategory", () => {
    it("should return products filtered by categoryId", async () => {
      const products = [makeProduct(), makeProduct({ id: 2 })];
      repoMock.find.mockResolvedValue(products);

      const result = await repository.findByCategory(1);

      expect(result).toEqual(products);
      expect(repoMock.find).toHaveBeenCalledWith({
        where: { categoryId: 1 },
        order: { id: "ASC" },
      });
    });
  });

  describe("create", () => {
    it("should create and save a new product", async () => {
      const dto = { name: "Laptop", price: 999.99, categoryId: 1 };
      const product = makeProduct();

      repoMock.create.mockReturnValue(product);
      repoMock.save.mockResolvedValue(product);

      const result = await repository.create(dto);

      expect(result).toEqual(product);
      expect(repoMock.create).toHaveBeenCalledWith(dto);
      expect(repoMock.save).toHaveBeenCalledWith(product);
    });
  });

  describe("update", () => {
    it("should update and return the updated product", async () => {
      const updated = makeProduct({ name: "Updated Laptop" });
      repoMock.update.mockResolvedValue({ affected: 1 });
      repoMock.findOne.mockResolvedValue(updated);

      const result = await repository.update(1, { name: "Updated Laptop" });

      expect(result).toEqual(updated);
      expect(repoMock.update).toHaveBeenCalledWith(1, {
        name: "Updated Laptop",
      });
    });
  });

  describe("delete", () => {
    it("should return true when a row is deleted", async () => {
      repoMock.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.delete(1);

      expect(result).toBe(true);
    });

    it("should return false when no row is deleted", async () => {
      repoMock.delete.mockResolvedValue({ affected: 0 });

      const result = await repository.delete(99);

      expect(result).toBe(false);
    });
  });
});
