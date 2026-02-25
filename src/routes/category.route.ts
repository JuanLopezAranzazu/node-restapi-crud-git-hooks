import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

const router = Router();
const controller = new CategoryController();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API para gestión de categorías
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Electrónica
 *         description:
 *           type: string
 *           example: Productos electrónicos y tecnología
 *         products:
 *           type: array
 *           items:
 *             type: object
 *       required:
 *         - id
 *         - name
 *
 *     CreateCategoryDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Ropa
 *         description:
 *           type: string
 *           example: Prendas de vestir para hombre y mujer
 *       required:
 *         - name
 *
 *     UpdateCategoryDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Hogar
 *         description:
 *           type: string
 *           example: Artículos para el hogar
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Obtener categoría por ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryDto'
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Categoría ya existe
 */
router.post("/", controller.create);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryDto'
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       404:
 *         description: Categoría no encontrada
 *       409:
 *         description: Nombre duplicado
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *       400:
 *         description: Tiene productos asociados
 *       404:
 *         description: Categoría no encontrada
 */
router.delete("/:id", controller.delete);

export default router;
