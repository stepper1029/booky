package com.example.stepperlibrary.service;

import com.example.stepperlibrary.model.Book;
import com.example.stepperlibrary.dao.BookDao;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookService {
  private final BookDao dao;

  public BookService(BookDao dao) {
    this.dao = dao;
  }

  public List<Book> getAllBooksSortedByAuthor() {
    return dao.findAllByOrderByAuthorLastNameAsc();
  }

  public List<Book> searchByTitleSortedByAuthor(String title) {
    return dao.findByTitleContainingIgnoreCaseOrderByAuthorLastNameAsc(title);
  }

  public List<Book> searchByAuthor(String author) {
    return dao.findByAuthorFirstNameContainingIgnoreCaseOrAuthorLastNameContainingIgnoreCaseOrderByAuthorLastNameAsc(author, author);
  }

  public List<Book> searchByLocationSortedByAuthor(Integer locationId) {
    return dao.findByLocationIdOrderByAuthorLastNameAsc(locationId);
  }

  /**
   * Adds a new book to the database.
   * @param book The book object to save
   * @return The saved Book entity with its generated ID
   */
  public Book addBook(Book book) {
    // Save the book using the DAO (JPA repository)
    return dao.save(book);
  }
}

