package com.example.stepperlibrary.controller;

import com.example.stepperlibrary.model.Book;
import com.example.stepperlibrary.service.BookService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class BookController {

  private static final Logger log = LoggerFactory.getLogger(BookController.class);
  private final BookService bookService;

  public BookController(BookService bookService) {
    this.bookService = bookService;
  }

    // ----------------------
    // Local DB endpoints
    // ----------------------

    @GetMapping("/books/count/user")
    public int countBooksByUserId(@RequestParam int userId){
    log.info("countBooksByUserId controller called for user: {}", userId);
      return bookService.countAllByUserId(userId);
    }

    @GetMapping("/books/count/location")
    public int countBooksByLocationId(@RequestParam int locationId){
      return bookService.countAllByLocationId(locationId);
    }

  @GetMapping("/books/location")
  public List<Book> getBooksByLocation(
          @RequestParam Integer locationId,
          @RequestParam(required = false) String search) {
    return bookService.getBooksByLocationId(locationId, search);
  }


  @PostMapping("/books")
    public Book addBook(@RequestBody Book book) {
      return bookService.addBook(book);
    }


    // GOOGLE BOOKS APIS

  @GetMapping("/books/googlecover")
  public String getGoogleBookCover(@RequestParam String isbn) {
    String coverUrl = bookService.getGoogleBookCover(isbn);
    return coverUrl != null ? coverUrl : "";
  }

}

