package com.example.stepperlibrary.dao;

import com.example.stepperlibrary.model.Friend;
import com.example.stepperlibrary.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FriendDao extends JpaRepository<Friend, Integer> {

  // Count how many friends a given user has
  @Query("SELECT COUNT(f) FROM Friend f WHERE f.user1Id = :userid OR f.user2Id = :userid")
  int countFriendsByUserId(@Param("userid") int userid);

  @Query("""
        SELECT u 
        FROM User u
        JOIN Friend f ON (u.id = f.user1Id OR u.id = f.user2Id)
        WHERE (:userId = f.user1Id OR :userId = f.user2Id)
          AND u.id <> :userId
          AND f.status = :status
        """)
  List<User> findFriendsByUserIdAndStatus(@Param("userId") Integer userId,
                                          @Param("status") String status);
}
