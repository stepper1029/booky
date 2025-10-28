package com.example.booky.controller;

import com.example.booky.model.User;
import com.example.booky.service.FriendService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "https://book-y.netlify.app"})
@RestController
@RequestMapping("/api/friends")
public class FriendController {

  private final FriendService friendService;

  public FriendController(FriendService friendService) {
    this.friendService = friendService;
  }

  // Endpoint: GET /api/friends/count?userId=1
  @GetMapping("/count")
  public int countFriends(@RequestParam int userId) {
    return friendService.countFriends(userId);
  }

  @GetMapping
  public List<User> getFriends(@RequestParam Integer userId,
                               @RequestParam String status) {
    return friendService.getFriends(userId, status);
  }

  @GetMapping("/checkFriendship")
  public boolean areFriends(@RequestParam Integer user1Id, @RequestParam Integer user2Id) {
    return friendService.areFriends(user1Id, user2Id);
  }
}
