package com.example.booky.dao;

import com.example.booky.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserDao extends JpaRepository<User, Integer> {

  // Fetch just the username for a given userId
  @Query("SELECT u.username FROM User u WHERE u.id = :userId")
  String findUsernameById(@Param("userId") int userId);

  @Query("SELECT u FROM User u WHERE u.id = :userId")
  User findUser(@Param("userId") int userId);

  Optional<User> findByUsername(String username);
}
