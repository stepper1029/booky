package com.example.booky.dao;


import com.example.booky.model.Book;
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
    WHERE b.userId = :userId AND
          (LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')))
""")
  List<Book> findByUserId(@Param("userId") Integer userId, @Param("search") String search);

  @Query("""
    SELECT b FROM Book b 
    WHERE b.locationId = :locationId AND 
          (LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) 
           OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')))
""")
  List<Book> searchByLocationAndTitleOrAuthor(
          @Param("locationId") Integer locationId,
          @Param("search") String search
  );

  @Query("""
        SELECT u.username, l.name, u.id
        FROM Book b
        JOIN User u ON b.userId = u.id
        LEFT JOIN Location l ON b.locationId = l.id
        WHERE b.isbn = :isbn
    """
  )
  List<Object[]> findOwnersByIsbn(@Param("isbn") String isbn);
}
