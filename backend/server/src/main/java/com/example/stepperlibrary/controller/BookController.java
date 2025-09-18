package com.example.stepperlibrary.controller;

import com.example.stepperlibrary.model.Book;
import com.example.stepperlibrary.service.BookService;
import com.example.stepperlibrary.service.ExternalBookService;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BookController {
  private final BookService bookService;
  private final ExternalBookService externalBookService;

  public BookController(BookService bookService, ExternalBookService externalBookService) {
    this.bookService = bookService;
    this.externalBookService = externalBookService;
  }

    // ----------------------
    // Local DB endpoints
    // ----------------------

    @GetMapping("/books")
    public List<Book> getAllBooks() {
      return bookService.getAllBooksSortedByAuthor();
    }

    @GetMapping("/books/search/title")
    public List<Book> searchByTitle(@RequestParam String title) {
      return bookService.searchByTitleSortedByAuthor(title);
    }

    @GetMapping("/books/search/author")
    public List<Book> searchByAuthor(@RequestParam String author) {
      return bookService.searchByAuthor(author);
    }

    @GetMapping("/books/search/location")
    public List<Book> searchByLocation(@RequestParam Integer locationId) {
      return bookService.searchByLocationSortedByAuthor(locationId);
    }

    @PostMapping("/books")
    public Book addBook(@RequestBody Book book) {
      return bookService.addBook(book);
    }

    // ----------------------
    // External API endpoints
    // ----------------------

    @GetMapping("/external-books/search/title")
    public Map searchExternalByTitle(@RequestParam String title) {
      return externalBookService.searchBooksByTitle(title);
    }

    @GetMapping("/external-books/search/author")
    public Map searchExternalByAuthor(@RequestParam String author) {
      return externalBookService.searchBooksByAuthor(author);
    }
}

