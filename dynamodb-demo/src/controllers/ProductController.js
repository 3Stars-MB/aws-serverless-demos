import { ResponseHelper } from '../utils/ResponseHelper.js';

export class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  async listProducts(event) {
    try {
      const result = await this.productService.getAllProducts();
      return ResponseHelper.success(result);
    } catch (error) {
      console.error('Error listing products:', error);
      return ResponseHelper.error('Internal server error');
    }
  }

  async getProduct(event) {
    try {
      const { id } = event.pathParameters || {};
      const product = await this.productService.getProductById(id);
      return ResponseHelper.success({ product });
    } catch (error) {
      console.error('Error getting product:', error);
      
      if (error.message === 'Product ID is required') {
        return ResponseHelper.error(error.message, 400);
      }
      
      if (error.message === 'Product not found') {
        return ResponseHelper.error(error.message, 404);
      }
      
      return ResponseHelper.error('Internal server error');
    }
  }
}