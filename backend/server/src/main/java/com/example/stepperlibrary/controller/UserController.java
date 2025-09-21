package com.example.stepperlibrary.controller;

import com.example.stepperlibrary.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/username")
  public String getUsername(@RequestParam int userId) {
    return userService.getUsername(userId);
  }
}
