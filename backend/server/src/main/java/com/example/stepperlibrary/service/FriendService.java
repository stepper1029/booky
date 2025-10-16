package com.example.stepperlibrary.service;

import com.example.stepperlibrary.dao.FriendDao;
import com.example.stepperlibrary.model.Friend;
import com.example.stepperlibrary.model.User;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendService {

  private final FriendDao dao;

  public FriendService(FriendDao dao) {
    this.dao = dao;
  }

  public int countFriends(int userId) {
    return dao.countFriendsByUserId(userId);
  }

  public List<User> getFriends(Integer userId, String status) {
    return dao.findFriendsByUserIdAndStatus(userId, status);
  }

  public boolean areFriends(Integer user1Id, Integer user2Id) {
    return dao.areFriends(user1Id, user2Id);
  }
}
