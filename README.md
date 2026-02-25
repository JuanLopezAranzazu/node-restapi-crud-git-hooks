# REST API CRUD con Git Hooks

En este proyecto se implementa una API RESTful utilizando Node.js, Express y TypeORM para realizar operaciones CRUD para Productos y Categorías. Además, se han configurado Git Hooks para asegurar la calidad del código antes de cada commit y push.

## Tecnologías Utilizadas
- Node.js (con TypeScript para mejorar la calidad del código)
- Express (framework para construir la API)
- TypeORM (ORM para interactuar con la base de datos)
- PostgreSQL (como base de datos)
- Husky (para Git Hooks)
- Lint-Staged (para ejecutar tareas de linting y formateo en los archivos modificados)
- ESLint (para linting)
- Jest (para pruebas unitarias)
- Swagger (para documentación de la API)

## Configuración de Git Hooks

Se han configurado los siguientes Git Hooks utilizando Husky:
- **pre-commit**: Ejecuta ESLint para asegurar que el código cumpla con las reglas de estilo antes de cada commit.
- **pre-push**: Ejecuta las pruebas unitarias con Jest para asegurar que el código no rompa la funcionalidad antes de cada push.

## API Endpoints

### Productos
- `GET /api/products`: Obtener todos los productos.
- `GET /api/products/:id`: Obtener un producto por ID.
- `GET /api/products/category/:categoryId`: Obtener productos por categoría.
- `POST /api/products`: Crear un nuevo producto.
- `PUT /api/products/:id`: Actualizar un producto existente.
- `DELETE /api/products/:id`: Eliminar un producto.

### Categorías
- `GET /api/categories`: Obtener todas las categorías.
- `GET /api/categories/:id`: Obtener una categoría por ID.
- `POST /api/categories`: Crear una nueva categoría.
- `PUT /api/categories/:id`: Actualizar una categoría existente.
- `DELETE /api/categories/:id`: Eliminar una categoría.
