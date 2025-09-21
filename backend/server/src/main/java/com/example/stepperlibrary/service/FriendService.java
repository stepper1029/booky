package com.example.stepperlibrary.service;

import com.example.stepperlibrary.dao.FriendDao;
import org.springframework.stereotype.Service;

@Service
public class FriendService {

  private final FriendDao dao;

  public FriendService(FriendDao dao) {
    this.dao = dao;
  }

  public int countFriends(int userId) {
    return dao.countFriendsByUserId(userId);
  }
}
