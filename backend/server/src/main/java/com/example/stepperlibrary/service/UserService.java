package com.example.stepperlibrary.service;

import com.example.stepperlibrary.dao.UserDao;
import com.example.stepperlibrary.model.User;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

  private final UserDao dao;

  public UserService(UserDao dao) {
    this.dao = dao;
  }

  public String getUsername(int userId) {
    return dao.findUsernameById(userId);
  }

  public User getUser(int userId) {return dao.findUser(userId);}

  public Optional<User> findByUserName(String username) { return dao.findByUsername(username); }

  public List<String> getTopFour(Integer userId) {
    User user = dao.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    List<String> topFour = new ArrayList<>();
    if (user.getTopOne() != null) topFour.add(user.getTopOne());
    if (user.getTopTwo() != null) topFour.add(user.getTopTwo());
    if (user.getTopThree() != null) topFour.add(user.getTopThree());
    if (user.getTopFour() != null) topFour.add(user.getTopFour());

    return topFour;
  }
}
