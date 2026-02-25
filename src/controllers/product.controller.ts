import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const products = await this.productService.getAll();
      res.json({
        success: true,
        data: products,
        total: products.length,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const product = await this.productService.getById(id);

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  getByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const categoryId = Number(req.params.categoryId);
      const products = await this.productService.getByCategory(categoryId);

      res.json({
        success: true,
        data: products,
        total: products.length,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const product = await this.productService.create(req.body);

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const product = await this.productService.update(id, req.body);

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.productService.delete(id);

      res.json({
        success: true,
        message: "El producto ha sido eliminado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };
}
