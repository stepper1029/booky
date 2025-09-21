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

  List<Book> findByLocationId(Integer locationId);

  @Query("""
    SELECT b FROM Book b 
    WHERE b.locationId = :locationId AND 
          (LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) 
           OR LOWER(b.authorFirstName) LIKE LOWER(CONCAT('%', :search, '%')) 
           OR LOWER(b.authorLastName) LIKE LOWER(CONCAT('%', :search, '%')))
""")
  List<Book> searchByLocationAndTitleOrAuthor(
          @Param("locationId") Integer locationId,
          @Param("search") String search
  );
}


