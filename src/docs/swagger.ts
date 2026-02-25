import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Products & Categories API",
      version: "1.0.0",
      description: "API para el manejo de productos y categorías",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      schemas: {
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Electrónica" },
            description: {
              type: "string",
              example: "Productos electrónicos y tecnología",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "name"],
        },

        CreateCategoryDto: {
          type: "object",
          properties: {
            name: { type: "string", example: "Ropa" },
            description: {
              type: "string",
              example: "Prendas de vestir",
            },
          },
          required: ["name"],
        },

        UpdateCategoryDto: {
          type: "object",
          properties: {
            name: { type: "string", example: "Hogar" },
            description: {
              type: "string",
              example: "Artículos del hogar",
            },
          },
        },

        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Laptop Lenovo" },
            description: {
              type: "string",
              example: "Laptop Ryzen 7 16GB RAM",
            },
            price: { type: "number", format: "float", example: 3500000 },
            stock: { type: "integer", example: 10 },
            active: { type: "boolean", example: true },
            categoryId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "name", "price", "categoryId"],
        },

        CreateProductDto: {
          type: "object",
          properties: {
            name: { type: "string", example: "Mouse Gamer" },
            description: {
              type: "string",
              example: "Mouse RGB 7200 DPI",
            },
            price: { type: "number", format: "float", example: 120000 },
            stock: { type: "integer", example: 50 },
            active: { type: "boolean", example: true },
            categoryId: { type: "integer", example: 1 },
          },
          required: ["name", "price", "categoryId"],
        },

        UpdateProductDto: {
          type: "object",
          properties: {
            name: { type: "string", example: "Mouse Gamer Pro" },
            description: {
              type: "string",
              example: "Nueva versión mejorada",
            },
            price: { type: "number", format: "float", example: 150000 },
            stock: { type: "integer", example: 40 },
            active: { type: "boolean", example: false },
            categoryId: { type: "integer", example: 2 },
          },
        },

        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: {
              type: "string",
              example: "La categoría no existe",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
});
