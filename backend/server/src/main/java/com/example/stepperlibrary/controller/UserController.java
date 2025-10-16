package com.example.stepperlibrary.controller;

import com.example.stepperlibrary.model.User;
import com.example.stepperlibrary.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private static final Logger log = LoggerFactory.getLogger(UserController.class);
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/username")
  public String getUsername(@RequestParam int userId) {
    return userService.getUsername(userId);
  }

  @GetMapping
  public User getUser(@RequestParam int userId) {
    return userService.getUser(userId);
  }

  @GetMapping("/byUsername")
  public Optional<User> getUserByUsername(@RequestParam String username) {
    log.info("Getting user from username: {}", username);
    log.info("returned user:{}", userService.findByUserName(username).stream().toArray());
    return userService.findByUserName(username);
  }

  @GetMapping("/topFour")
  public List<String> getTopFour(@RequestParam Integer userId){
    return userService.getTopFour(userId);
  }
}
