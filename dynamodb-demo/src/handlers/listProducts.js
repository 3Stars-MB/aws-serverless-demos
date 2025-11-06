import { DatabaseConfig } from '../config/database.js';
import { DynamoProductRepository } from '../repositories/DynamoProductRepository.js';
import { ProductService } from '../services/ProductService.js';
import { ProductController } from '../controllers/ProductController.js';

const docClient = DatabaseConfig.createClient();
const tableName = process.env.TABLE_NAME || 'Products';
const productRepository = new DynamoProductRepository(docClient, tableName);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

export const handler = async (event) => {
  return await productController.listProducts(event);
};