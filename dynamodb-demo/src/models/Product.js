export class Product {
  constructor({ PK, SK, Name, Category, Price, Stock, Brand }) {
    this.PK = PK;
    this.SK = SK;
    this.Name = Name;
    this.Category = Category;
    this.Price = Price;
    this.Stock = Stock;
    this.Brand = Brand;
  }

  static fromDynamoItem(item) {
    return new Product(item);
  }

  toApiResponse() {
    return {
      id: this.PK.replace('PRODUCT#', ''),
      name: this.Name,
      category: this.Category,
      price: this.Price,
      stock: this.Stock,
      brand: this.Brand
    };
  }

  static createKeys(id) {
    return {
      PK: `PRODUCT#${id}`,
      SK: `METADATA#${id}`
    };
  }
}