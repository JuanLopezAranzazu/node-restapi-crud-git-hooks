import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import { AppDataSource } from "./config/database";
import { errorHandler } from "./middlewares/error.middleware";

import categoryRoutes from "./routes/category.route";
import productRoutes from "./routes/product.route";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get("/", (_req, res) => {
  res.send("Bievenido a mi API");
});

// Documentación de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Manejo de errores
app.use(errorHandler);

// Inicializar la conexión a la base de datos y luego iniciar el servidor
AppDataSource.initialize()
  .then(() => {
    console.log("Conexión a la base de datos establecida");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

