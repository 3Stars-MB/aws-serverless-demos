import { httpResponse } from '../utils/httpResponse.js';

class BookController {
  constructor(bookService) {
    this.bookService = bookService;
  }

  async create(event) {
    try {
      const bookData = JSON.parse(event.body);
      const book = await this.bookService.createBook(bookData);
      return httpResponse(201, book);
    } catch (error) {
      return httpResponse(500, { error: error.message });
    }
  }

  async getAll() {
    try {
      const books = await this.bookService.getAllBooks();
      return httpResponse(200, books);
    } catch (error) {
      return httpResponse(500, { error: error.message });
    }
  }

  async getById(event) {
    try {
      const { id } = event.pathParameters;
      const book = await this.bookService.getBookById(id);
      return httpResponse(200, book);
    } catch (error) {
      const statusCode = error.message === 'Book not found' ? 404 : 500;
      return httpResponse(statusCode, { error: error.message });
    }
  }

  async update(event) {
    try {
      const { id } = event.pathParameters;
      const bookData = JSON.parse(event.body);
      const book = await this.bookService.updateBook(id, bookData);
      return httpResponse(200, book);
    } catch (error) {
      const statusCode = error.message === 'Book not found' ? 404 : 500;
      return httpResponse(statusCode, { error: error.message });
    }
  }

  async delete(event) {
    try {
      const { id } = event.pathParameters;
      await this.bookService.deleteBook(id);
      return httpResponse(200, { message: 'Book deleted successfully' });
    } catch (error) {
      const statusCode = error.message === 'Book not found' ? 404 : 500;
      return httpResponse(statusCode, { error: error.message });
    }
  }
}

export default BookController;