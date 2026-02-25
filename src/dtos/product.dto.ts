export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  active?: boolean;
  categoryId: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  active?: boolean;
  categoryId?: number;
}
