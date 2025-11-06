import BookRepository from '../src/repositories/BookRepository.js';
import BookService from '../src/services/BookService.js';
import BookController from '../src/controllers/BookController.js';

const bookRepository = new BookRepository();
const bookService = new BookService(bookRepository);
const bookController = new BookController(bookService);

export const handler = async (event) => {
  return await bookController.getById(event);
};