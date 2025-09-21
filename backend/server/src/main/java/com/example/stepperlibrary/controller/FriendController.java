package com.example.stepperlibrary.controller;

import com.example.stepperlibrary.service.FriendService;
import org.springframework.web.bind.annotation.*;

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
}
