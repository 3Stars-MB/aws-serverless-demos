import { v4 as uuidv4 } from 'uuid';

class Book {
  constructor({ id, title, author, year, createdAt, updatedAt }) {
    this.id = id || uuidv4();
    this.PK = `BOOK#${this.id}`;
    this.SK = `METADATA`;
    this.title = title;
    this.author = author;
    this.year = year;
    this.entityType = 'Book';
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt;
  }

  update({ title, author, year }) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.updatedAt = new Date().toISOString();
  }
}

export default Book;