import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router();
const controller = new ProductController();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API para gestión de productos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Laptop Lenovo
 *         description:
 *           type: string
 *           example: Laptop Ryzen 7 16GB RAM
 *         price:
 *           type: number
 *           format: float
 *           example: 3500000
 *         stock:
 *           type: integer
 *           example: 10
 *         active:
 *           type: boolean
 *           example: true
 *         categoryId:
 *           type: integer
 *           example: 1
 *       required:
 *         - id
 *         - name
 *         - price
 *         - categoryId
 *
 *     CreateProductDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Mouse Gamer
 *         description:
 *           type: string
 *           example: Mouse RGB 7200 DPI
 *         price:
 *           type: number
 *           format: float
 *           example: 120000
 *         stock:
 *           type: integer
 *           example: 50
 *         active:
 *           type: boolean
 *           example: true
 *         categoryId:
 *           type: integer
 *           example: 1
 *       required:
 *         - name
 *         - price
 *         - categoryId
 *
 *     UpdateProductDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Mouse Gamer Pro
 *         description:
 *           type: string
 *           example: Nueva versión mejorada
 *         price:
 *           type: number
 *           format: float
 *           example: 150000
 *         stock:
 *           type: integer
 *           example: 40
 *         active:
 *           type: boolean
 *           example: false
 *         categoryId:
 *           type: integer
 *           example: 2
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /products/category/{categoryId}:
 *   get:
 *     summary: Obtener productos por categoría
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de productos de la categoría
 *       404:
 *         description: Categoría no encontrada
 */
router.get("/category/:categoryId", controller.getByCategory);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDto'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Categoría no existe
 */
router.post("/", controller.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductDto'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/:id", controller.delete);

export default router;
