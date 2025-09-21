package com.example.stepperlibrary.service;

import com.example.stepperlibrary.dao.UserDao;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserDao dao;

  public UserService(UserDao dao) {
    this.dao = dao;
  }

  public String getUsername(int userId) {
    return dao.findUsernameById(userId);
  }
}
