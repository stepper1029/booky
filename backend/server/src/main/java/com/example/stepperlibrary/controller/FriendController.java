package com.example.stepperlibrary.controller;

import com.example.stepperlibrary.model.Friend;
import com.example.stepperlibrary.model.User;
import com.example.stepperlibrary.service.FriendService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
