package com.example.stepperlibrary.controller;

import com.example.stepperlibrary.dto.BookDto;
import com.example.stepperlibrary.model.Book;
import com.example.stepperlibrary.service.BookService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {

  private static final Logger log = LoggerFactory.getLogger(BookController.class);
  private final BookService bookService;

  public BookController(BookService bookService) {
    this.bookService = bookService;
  }

    // ----------------------
    // Local DB endpoints
    // ----------------------

    @GetMapping("/count/user")
    public int countBooksByUserId(@RequestParam int userId){
    log.info("countBooksByUserId controller called for user: {}", userId);
      return bookService.countAllByUserId(userId);
    }

    @GetMapping("/count/location")
    public int countBooksByLocationId(@RequestParam int locationId){
      return bookService.countAllByLocationId(locationId);
    }

  @GetMapping("/location")
  public List<Book> getBooksByLocation(
          @RequestParam Integer locationId,
          @RequestParam(required = false) String search) {
    return bookService.getBooksByLocationId(locationId, search);
  }

  @GetMapping("/user")
  public List<Book> getBooksByUser(
          @RequestParam Integer userId,
          @RequestParam(required = false) String search) {
    return bookService.getBooksByUserId(userId, search);
  }


  @PostMapping
    public Book addBook(@RequestBody Book book) {
      return bookService.addBook(book);
    }

}

