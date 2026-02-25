import "reflect-metadata";
import { CategoryRepository } from "../../repositories/category.repository";
import { AppDataSource } from "../../config/database";
import { Category } from "../../entities/Category";

jest.mock("../../config/database", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const makeCategory = (overrides: Partial<Category> = {}): Category => ({
  id: 1,
  name: "Electronics",
  description: "Electronic devices",
  products: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("CategoryRepository", () => {
  let repository: CategoryRepository;
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
    repository = new CategoryRepository();
  });

  describe("findAll", () => {
    it("should return all categories ordered by id ASC", async () => {
      const categories = [
        makeCategory(),
        makeCategory({ id: 2, name: "Clothing" }),
      ];
      repoMock.find.mockResolvedValue(categories);

      const result = await repository.findAll();

      expect(result).toEqual(categories);
      expect(repoMock.find).toHaveBeenCalledWith({ order: { id: "ASC" } });
    });
  });

  describe("findById", () => {
    it("should return a category with its products", async () => {
      const category = makeCategory();
      repoMock.findOne.mockResolvedValue(category);

      const result = await repository.findById(1);

      expect(result).toEqual(category);
      expect(repoMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["products"],
      });
    });

    it("should return null when not found", async () => {
      repoMock.findOne.mockResolvedValue(null);

      const result = await repository.findById(99);

      expect(result).toBeNull();
    });
  });

  describe("findByName", () => {
    it("should return a category by name", async () => {
      const category = makeCategory();
      repoMock.findOne.mockResolvedValue(category);

      const result = await repository.findByName("Electronics");

      expect(result).toEqual(category);
      expect(repoMock.findOne).toHaveBeenCalledWith({
        where: { name: "Electronics" },
      });
    });

    it("should return null when not found", async () => {
      repoMock.findOne.mockResolvedValue(null);

      const result = await repository.findByName("Unknown");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create and save a new category", async () => {
      const dto = { name: "Electronics", description: "Electronic devices" };
      const category = makeCategory();

      repoMock.create.mockReturnValue(category);
      repoMock.save.mockResolvedValue(category);

      const result = await repository.create(dto);

      expect(result).toEqual(category);
      expect(repoMock.create).toHaveBeenCalledWith(dto);
      expect(repoMock.save).toHaveBeenCalledWith(category);
    });
  });

  describe("update", () => {
    it("should update and return the updated category", async () => {
      const updated = makeCategory({ name: "Updated" });
      repoMock.update.mockResolvedValue({ affected: 1 });
      repoMock.findOne.mockResolvedValue(updated);

      const result = await repository.update(1, { name: "Updated" });

      expect(result).toEqual(updated);
      expect(repoMock.update).toHaveBeenCalledWith(1, { name: "Updated" });
    });
  });

  describe("delete", () => {
    it("should return true when a row is deleted", async () => {
      repoMock.delete.mockResolvedValue({ affected: 1 });

      const result = await repository.delete(1);

      expect(result).toBe(true);
      expect(repoMock.delete).toHaveBeenCalledWith(1);
    });

    it("should return false when no row is deleted", async () => {
      repoMock.delete.mockResolvedValue({ affected: 0 });

      const result = await repository.delete(99);

      expect(result).toBe(false);
    });
  });
});
