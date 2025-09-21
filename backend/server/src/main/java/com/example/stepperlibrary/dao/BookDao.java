package com.example.stepperlibrary.dao;


import com.example.stepperlibrary.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookDao extends JpaRepository<Book, Long> {

  @Query("SELECT COUNT(b) FROM Book b WHERE b.userId = :userId")
  int countAllByUserId(@Param("userId") Integer userId);

  int countAllByLocationId(Integer locationId);

  List<Book> findAllByOrderByAuthorLastNameAsc();

  List<Book> findByTitleContainingIgnoreCaseOrderByAuthorLastNameAsc(String title);

  List<Book> findByAuthorFirstNameContainingIgnoreCaseOrAuthorLastNameContainingIgnoreCaseOrderByAuthorLastNameAsc(
          String firstName, String lastName);

  List<Book> findByLocationIdOrderByAuthorLastNameAsc(Integer locationId);
}


