package com.example.stepperlibrary.service;

import com.example.stepperlibrary.dto.BookOwnersDto;
import com.example.stepperlibrary.model.Book;
import com.example.stepperlibrary.dao.BookDao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

  private static final Logger log = LoggerFactory.getLogger(LocationService.class);
  private final BookDao dao;

  public BookService(BookDao dao) {
    this.dao = dao;
  }

  public int countAllByUserId(int userId) {
    return dao.countAllByUserId(userId);
  }

  public int countAllByLocationId(int locationId) {
    return dao.countAllByLocationId(locationId);
  }

  public List<Book> getBooksByLocationId(Integer locationId, String search) {
    if (search == null || search.isEmpty()) {
      return dao.findByLocationId(locationId);
    }
    return dao.searchByLocationAndTitleOrAuthor(locationId, search);
  }

  public List<Book> getBooksByUserId(Integer userId, String search) {
    log.info("Fetching books for user: {}", userId);
    List<Book> list = dao.findByUserId(userId, search);
    for(Book b : list){
      log.info(b.getTitle() + " by " + b.getAuthor() + " at " + b.getLocationId());
    }
    return dao.findByUserId(userId, search);
  }

  public BookOwnersDto getOwnersByIsbn(String isbn) {
    List<Object[]> results = dao.findOwnersByIsbn(isbn);
    BookOwnersDto dto = new BookOwnersDto(isbn);

    log.info("Fetching owners for isbn: {}", isbn);

    for (Object[] row : results) {
      String username = (String) row[0];
      String location = (String) row[1];
      if (username != null && location != null) {
        dto.addOwner(username, location);
        log.info("Username: {}, location: {}", username, location);
      }
    }

    return dto;
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

