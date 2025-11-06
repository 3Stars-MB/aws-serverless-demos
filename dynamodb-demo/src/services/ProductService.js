export class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts() {
    const products = await this.productRepository.findAll();
    return {
      products: products.map(product => product.toApiResponse()),
      count: products.length
    };
  }

  async getProductById(id) {
    if (!id) {
      throw new Error('Product ID is required');
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    return product.toApiResponse();
  }
}