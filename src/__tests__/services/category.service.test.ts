import "reflect-metadata";
import { CategoryService } from "../../services/category.service";
import { CategoryRepository } from "../../repositories/category.repository";
import { Category } from "../../entities/Category";
import { Product } from "../../entities/Product";
import { AppError } from "../../middlewares/error.middleware";

jest.mock("../../repositories/category.repository");

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

describe("CategoryService", () => {
  let service: CategoryService;
  let repoMock: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    MockedCategoryRepository.mockClear();
    service = new CategoryService();
    repoMock = MockedCategoryRepository.mock
      .instances[0] as jest.Mocked<CategoryRepository>;
  });

  describe("getAll", () => {
    it("should return an array of categories", async () => {
      const categories = [
        makeCategory(),
        makeCategory({ id: 2, name: "Clothing" }),
      ];
      repoMock.findAll.mockResolvedValue(categories);

      const result = await service.getAll();

      expect(result).toEqual(categories);
      expect(repoMock.findAll).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when there are no categories", async () => {
      repoMock.findAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should return a category by id", async () => {
      const category = makeCategory();
      repoMock.findById.mockResolvedValue(category);

      const result = await service.getById(1);

      expect(result).toEqual(category);
      expect(repoMock.findById).toHaveBeenCalledWith(1);
    });

    it("should throw 404 when category not found", async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.getById(99)).rejects.toBeInstanceOf(AppError);

      await expect(service.getById(99)).rejects.toMatchObject({
        message: "La categoría con ID 99 no existe",
        statusCode: 404,
      });
    });
  });

  describe("create", () => {
    it("should create and return a new category", async () => {
      const dto = { name: "Electronics", description: "Electronic devices" };
      const category = makeCategory();

      repoMock.findByName.mockResolvedValue(null);
      repoMock.create.mockResolvedValue(category);

      const result = await service.create(dto);

      expect(result).toEqual(category);
      expect(repoMock.findByName).toHaveBeenCalledWith("Electronics");
      expect(repoMock.create).toHaveBeenCalledWith(dto);
    });

    it("should trim the name before creating", async () => {
      const category = makeCategory();
      repoMock.findByName.mockResolvedValue(null);
      repoMock.create.mockResolvedValue(category);

      await service.create({ name: "  Electronics  " });

      expect(repoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Electronics" }),
      );
    });

    it("should throw 400 if name is empty", async () => {
      await expect(service.create({ name: "" })).rejects.toMatchObject({
        message:
          "El nombre de la categoría es obligatorio y no puede estar vacío",
        statusCode: 400,
      });
    });

    it("should throw 400 if name already exists", async () => {
      repoMock.findByName.mockResolvedValue(makeCategory());

      await expect(
        service.create({ name: "Electronics" }),
      ).rejects.toMatchObject({
        message: 'Ya existe una categoría con el nombre "Electronics"',
        statusCode: 409,
      });

      expect(repoMock.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update and return the category", async () => {
      const updated = makeCategory({ name: "Updated" });
      repoMock.findById.mockResolvedValue(makeCategory());
      repoMock.findByName.mockResolvedValue(null);
      repoMock.update.mockResolvedValue(updated);

      const result = await service.update(1, { name: "Updated" });

      expect(result).toEqual(updated);
      expect(repoMock.update).toHaveBeenCalledWith(1, { name: "Updated" });
    });

    it("should throw 404 if category does not exist", async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.update(99, { name: "X" })).rejects.toMatchObject({
        message: "La categoría con ID 99 no existe",
        statusCode: 404,
      });
    });

    it("should throw if another category already uses the new name", async () => {
      repoMock.findById.mockResolvedValue(makeCategory({ id: 1 }));
      repoMock.findByName.mockResolvedValue(
        makeCategory({ id: 2, name: "Clothing" }),
      );

      await expect(
        service.update(1, { name: "Clothing" }),
      ).rejects.toMatchObject({
        message: 'Ya existe una categoría con el nombre "Clothing"',
        statusCode: 409,
      });
    });

    it("should allow updating with the same name (same id)", async () => {
      const category = makeCategory({ id: 1, name: "Electronics" });
      const updated = makeCategory({ id: 1, name: "Electronics" });
      repoMock.findById.mockResolvedValue(category);
      repoMock.findByName.mockResolvedValue(category);
      repoMock.update.mockResolvedValue(updated);

      const result = await service.update(1, { name: "Electronics" });

      expect(result).toEqual(updated);
    });
  });

  describe("delete", () => {
    it("should delete a category with no associated products", async () => {
      repoMock.findById.mockResolvedValue(makeCategory({ products: [] }));
      repoMock.delete.mockResolvedValue(true);

      await expect(service.delete(1)).resolves.not.toThrow();
      expect(repoMock.delete).toHaveBeenCalledWith(1);
    });

    it("should throw if the category is not found", async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toMatchObject({
        message: "La categoría con ID 99 no existe",
        statusCode: 404,
      });
      expect(repoMock.delete).not.toHaveBeenCalled();
    });

    it("should throw if the category has associated products", async () => {
      repoMock.findById.mockResolvedValue(
        makeCategory({ products: [{ id: 1 } as Product] }),
      );

      await expect(service.delete(1)).rejects.toMatchObject({
        message: "No se puede eliminar la categoría porque tiene productos asociados",
        statusCode: 400,
      });
      expect(repoMock.delete).not.toHaveBeenCalled();
    });
  });
});
