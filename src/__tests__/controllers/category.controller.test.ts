import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { CategoryController } from "../../controllers/category.controller";
import { CategoryService } from "../../services/category.service";
import { Category } from "../../entities/Category";
import { AppError } from "../../middlewares/error.middleware";

jest.mock("../../services/category.service");

const MockedCategoryService = CategoryService as jest.MockedClass<
  typeof CategoryService
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

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = (overrides: Partial<Request> = {}): Request =>
  ({ params: {}, body: {}, ...overrides }) as Request;
const mockNext = (): NextFunction => jest.fn();

describe("CategoryController", () => {
  let controller: CategoryController;
  let serviceMock: jest.Mocked<CategoryService>;

  beforeEach(() => {
    MockedCategoryService.mockClear();
    controller = new CategoryController();
    serviceMock = MockedCategoryService.mock
      .instances[0] as jest.Mocked<CategoryService>;
  });

  describe("getAll", () => {
    it("should respond 200 with categories", async () => {
      const categories = [makeCategory()];
      serviceMock.getAll.mockResolvedValue(categories);

      const res = mockRes();
      const next = mockNext();

      await controller.getAll(mockReq(), res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: categories,
        total: 1,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should call next when service throws", async () => {
      const error = new AppError("DB error", 500);
      serviceMock.getAll.mockRejectedValue(error);

      const res = mockRes();
      const next = mockNext();

      await controller.getAll(mockReq(), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getById", () => {
    it("should return category", async () => {
      const category = makeCategory();
      serviceMock.getById.mockResolvedValue(category);

      const res = mockRes();
      const next = mockNext();

      await controller.getById(mockReq({ params: { id: "1" } }), res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: category,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with AppError if not found", async () => {
      const error = new AppError("La categoría con ID 99 no existe", 404);
      serviceMock.getById.mockRejectedValue(error);

      const res = mockRes();
      const next = mockNext();

      await controller.getById(mockReq({ params: { id: "99" } }), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("create", () => {
    it("should respond 201 when created", async () => {
      const category = makeCategory();
      serviceMock.create.mockResolvedValue(category);

      const res = mockRes();
      const next = mockNext();

      await controller.create(
        mockReq({ body: { name: "Electronics" } }),
        res,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: category,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should call next on validation error", async () => {
      const error = new AppError(
        "El nombre de la categoría es obligatorio y no puede estar vacío",
        400,
      );
      serviceMock.create.mockRejectedValue(error);

      const res = mockRes();
      const next = mockNext();

      await controller.create(mockReq({ body: {} }), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should respond 200 when updated", async () => {
      const updated = makeCategory({ name: "Updated" });
      serviceMock.update.mockResolvedValue(updated);

      const res = mockRes();
      const next = mockNext();

      await controller.update(
        mockReq({ params: { id: "1" }, body: { name: "Updated" } }),
        res,
        next,
      );

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updated,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should call next if not found", async () => {
      const error = new AppError("La categoría con ID 99 no existe", 404);
      serviceMock.update.mockRejectedValue(error);

      const res = mockRes();
      const next = mockNext();

      await controller.update(
        mockReq({ params: { id: "99" }, body: {} }),
        res,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("should respond 200 when deleted", async () => {
      serviceMock.delete.mockResolvedValue();

      const res = mockRes();
      const next = mockNext();

      await controller.delete(mockReq({ params: { id: "1" } }), res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "La categoría ha sido eliminada exitosamente",
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should call next if deletion fails", async () => {
      const error = new AppError("La categoría con ID 99 no existe", 404);
      serviceMock.delete.mockRejectedValue(error);

      const res = mockRes();
      const next = mockNext();

      await controller.delete(mockReq({ params: { id: "99" } }), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
