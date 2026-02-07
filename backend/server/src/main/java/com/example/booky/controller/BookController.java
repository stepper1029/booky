package com.example.booky.controller;

import com.example.booky.dto.BookOwnersDto;
import com.example.booky.model.Book;
import com.example.booky.service.BookService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;


@RestController
@RequestMapping("/api/books")
public class BookController {

  private static final Logger log = LoggerFactory.getLogger(BookController.class);
  private final BookService bookService;
  private final FriendController friendController;
  private final UserController userController;

  @Value("${API_KEY}")
  private String apiKey;

  public BookController(BookService bookService, FriendController friendController, UserController userController) {
    this.bookService = bookService;
    this.friendController = friendController;
    this.userController = userController;
  }

  @GetMapping("/search")
  public ResponseEntity<String> searchBooks(@RequestParam String query) {
    try {
      String url = "https://www.googleapis.com/books/v1/volumes?q="
              + query
              + "&orderBy=relevance"
              + "&key=" + apiKey;
      RestTemplate restTemplate = new RestTemplate();
      String result = restTemplate.getForObject(url, String.class);
      log.info("searching google books for {}", query);
      log.info("results: {}", result);
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }

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
  public ResponseEntity<?> getBooksByUser(
          @RequestParam Integer userId,
          @RequestParam(required = false) String search,
          Authentication authentication) {

    // Extract logged-in username from JWT
    String loggedInUsername = (String) authentication.getPrincipal();

    // Lookup logged-in user ID
    Integer loggedInUserId = userController.getUserByUsername(loggedInUsername).get().getId();
    if (loggedInUserId == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
              .body("Invalid JWT user");
    }

    // Check if logged-in user is allowed to view requested user's books
    boolean allowed = loggedInUserId.equals(userId) ||
            friendController.areFriends(loggedInUserId, userId);

    if (!allowed) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
              .body("You are not allowed to view this user's books");
    }

    // Fetch books (with optional search filter)
    List<Book> books = bookService.getBooksByUserId(userId, search);
    return ResponseEntity.ok(books);
  }

  @GetMapping("/owners")
  public BookOwnersDto getBookOwners(@RequestParam String isbn) {
    return bookService.getOwnersByIsbn(isbn);
  }


  @PostMapping
    public Book addBook(@RequestBody Book book) {
      return bookService.addBook(book);
    }

}

