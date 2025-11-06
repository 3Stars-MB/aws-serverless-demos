import Book from '../models/Book.js';

class BookService {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async createBook(bookData) {
    const book = new Book(bookData);
    return await this.bookRepository.create(book);
  }

  async getAllBooks() {
    return await this.bookRepository.findAll();
  }

  async getBookById(id) {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }

  async updateBook(id, bookData) {
    const existingBook = await this.bookRepository.findById(id);
    if (!existingBook) {
      throw new Error('Book not found');
    }
    
    const book = new Book(existingBook);
    book.update(bookData);
    return await this.bookRepository.update(id, book);
  }

  async deleteBook(id) {
    const existingBook = await this.bookRepository.findById(id);
    if (!existingBook) {
      throw new Error('Book not found');
    }
    
    await this.bookRepository.delete(id);
  }
}

export default BookService;