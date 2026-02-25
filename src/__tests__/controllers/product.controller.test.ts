import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { ProductController } from "../../controllers/product.controller";
import { ProductService } from "../../services/product.service";
import { Product } from "../../entities/Product";
import { Category } from "../../entities/Category";
import { AppError } from "../../middlewares/error.middleware";

jest.mock("../../services/product.service");

const MockedProductService = ProductService as jest.MockedClass<
  typeof ProductService
>;

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

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = (overrides: Partial<Request> = {}): Request =>
  ({ params: {}, body: {}, ...overrides }) as Request;
const mockNext = (): NextFunction => jest.fn();

describe("ProductController", () => {
  let controller: ProductController;
  let serviceMock: jest.Mocked<ProductService>;

  beforeEach(() => {
    MockedProductService.mockClear();
    controller = new ProductController();
    serviceMock = MockedProductService.mock
      .instances[0] as jest.Mocked<ProductService>;
  });

  describe("getAll", () => {
    it("should respond 200 with all products", async () => {
      const products = [makeProduct(), makeProduct({ id: 2, name: "Phone" })];
      serviceMock.getAll.mockResolvedValue(products);

      const res = mockRes();
      const next = mockNext();

      await controller.getAll(mockReq(), res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: products,
        total: 2,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should respond 500 when the service throws", async () => {
      const error = new AppError("DB error", 500);
      serviceMock.getAll.mockRejectedValue(error);

      const res = mockRes();
      const next = mockNext();

      await controller.getAll(mockReq(), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getById", () => {
    it("should respond 200 with the product", async () => {
      const product = makeProduct();
      serviceMock.getById.mockResolvedValue(product);

      const res = mockRes();
      const next = mockNext();

      await controller.getById(mockReq({ params: { id: "1" } }), res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: product });

      expect(next).not.toHaveBeenCalled();
    });

    it("should respond 404 when not found", async () => {
      const error = new AppError("El producto con ID 99 no existe", 404);
      serviceMock.getById.mockRejectedValue(error);

      const res = mockRes();
      const next = mockNext();

      await controller.getById(mockReq({ params: { id: "99" } }), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getByCategory", () => {
    it("should respond 200 with products filtered by category", async () => {
      const products = [makeProduct()];
      serviceMock.getByCategory.mockResolvedValue(products);

      const res = mockRes();
      const next = mockNext();

      await controller.getByCategory(
        mockReq({ params: { categoryId: "1" } }),
        res,
        next,
      );

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: products,
        total: 1,
      });
      expect(serviceMock.getByCategory).toHaveBeenCalledWith(1);

      expect(next).not.toHaveBeenCalled();
    });

    it("should respond 500 when the service throws", async () => {
      const error = new AppError("DB error", 500);
      serviceMock.getByCategory.mockRejectedValue(error);

      const res = mockRes();
      const next = mockNext();

      await controller.getByCategory(
        mockReq({ params: { categoryId: "1" } }),
        res,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("create", () => {
    it("should respond 201 with the created product", async () => {
      const product = makeProduct();
      serviceMock.create.mockResolvedValue(product);

      const res = mockRes();
      const next = mockNext();

      await controller.create(
        mockReq({ body: { name: "Laptop", price: 999.99, categoryId: 1 } }),
        res,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: product });

      expect(next).not.toHaveBeenCalled();
    });

    it("should respond 400 when validation fails", async () => {
      const error = new AppError("El nombre del producto es obligatorio", 400);
      serviceMock.create.mockRejectedValue(error);

      const res = mockRes();
      const next = mockNext();

      await controller.create(mockReq({ body: {} }), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should respond 400 when the category does not exist", async () => {
      const error = new AppError("La categoría con ID 99 no existe", 400);
      serviceMock.create.mockRejectedValue(error);

      const res = mockRes();
      const next = mockNext();

      await controller.create(
        mockReq({ body: { name: "X", price: 10, categoryId: 99 } }),
        res,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should respond 200 with the updated product", async () => {
      const updated = makeProduct({ name: "Updated Laptop" });
      serviceMock.update.mockResolvedValue(updated);

      const res = mockRes();
      const next = mockNext();

      await controller.update(
        mockReq({ params: { id: "1" }, body: { name: "Updated Laptop" } }),
        res,
        next,
      );

      expect(res.json).toHaveBeenCalledWith({ success: true, data: updated });
      expect(next).not.toHaveBeenCalled();
    });

    it("should respond 404 when not found", async () => {
      const error = new AppError("El producto con ID 99 no existe", 404);
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
    it("should respond 200 with a success message", async () => {
      serviceMock.delete.mockResolvedValue();

      const res = mockRes();
      const next = mockNext();

      await controller.delete(mockReq({ params: { id: "1" } }), res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "El producto ha sido eliminado exitosamente",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should respond 404 when not found", async () => {
      const error = new AppError("El producto con ID 99 no existe", 404);
      serviceMock.delete.mockRejectedValue(error);

      const res = mockRes();
      const next = mockNext();

      await controller.delete(mockReq({ params: { id: "99" } }), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
