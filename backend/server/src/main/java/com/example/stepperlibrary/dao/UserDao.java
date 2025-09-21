package com.example.stepperlibrary.dao;

import com.example.stepperlibrary.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserDao extends JpaRepository<User, Integer> {

  // Fetch just the username for a given userId
  @Query("SELECT u.username FROM User u WHERE u.id = :userId")
  String findUsernameById(@Param("userId") int userId);
}
