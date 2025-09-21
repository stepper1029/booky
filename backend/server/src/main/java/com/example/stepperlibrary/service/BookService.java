package com.example.stepperlibrary.service;

import com.example.stepperlibrary.model.Book;
import com.example.stepperlibrary.dao.BookDao;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class BookService {
  private final BookDao dao;
  private final ObjectMapper objectMapper;
  private final RestTemplate restTemplate;

  public BookService(BookDao dao, ObjectMapper objectMapper) {
    this.dao = dao;
    this.objectMapper = objectMapper;
    this.restTemplate = new RestTemplate();
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


  /**
   * Adds a new book to the database.
   * @param book The book object to save
   * @return The saved Book entity with its generated ID
   */
  public Book addBook(Book book) {
    // Save the book using the DAO (JPA repository)
    return dao.save(book);
  }


  // GOOGLE BOOKS

  public String getGoogleBookCover(String isbn) {
    try {
      String url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
      String response = restTemplate.getForObject(url, String.class);

      JsonNode root = objectMapper.readTree(response);
      JsonNode items = root.path("items");

      if (items.isArray() && items.size() > 0) {
        JsonNode volumeInfo = items.get(0).path("volumeInfo");
        JsonNode imageLinks = volumeInfo.path("imageLinks");
        JsonNode thumbnail = imageLinks.path("thumbnail");

        if (!thumbnail.isMissingNode()) {
          return thumbnail.asText();
        }
      }
    } catch (Exception e) {
      System.err.println("Error fetching Google Books cover: " + e.getMessage());
    }
    return null; // fallback if no cover found
  }

}

