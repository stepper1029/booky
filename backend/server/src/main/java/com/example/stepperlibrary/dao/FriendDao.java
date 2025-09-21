package com.example.stepperlibrary.dao;

import com.example.stepperlibrary.model.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FriendDao extends JpaRepository<Friend, Integer> {

  // Count how many friends a given user has
  @Query("SELECT COUNT(f) FROM Friend f WHERE f.user1Id = :userid OR f.user2Id = :userid")
  int countFriendsByUserId(@Param("userid") int userid);
}
