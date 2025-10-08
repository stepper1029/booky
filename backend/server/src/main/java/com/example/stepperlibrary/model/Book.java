package com.example.stepperlibrary.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "book")
public class Book {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String isbn;

  private String isbn10;

  @Column(name = "userid", nullable = false)
  private Integer userId;

  @Column(name = "locationid")
  private Integer locationId;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private String author;

  @Column(name = "dateadded")
  private LocalDate dateAdded;

  // Getters and setters
  public Integer getId() { return id; }
  public void setId(Integer id) { this.id = id; }

  public String getIsbn() { return isbn; }
  public void setIsbn(String isbn) { this.isbn = isbn; }

  public String getIsbn10() { return isbn10; }
  public void setIsbn10(String isbn10) { this.isbn10 = isbn10; }

  public Integer getUserId() { return userId; }
  public void setUser(Integer userId) { this.userId = userId; }

  public Integer getLocationId() { return locationId; }
  public void setLocation(Integer locationId) { this.locationId = locationId; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getAuthor() { return author; }
  public void setAuthor(String author) { this.author = author; }

  public LocalDate getDateAdded() { return dateAdded; }
  public void setDateAdded(LocalDate dateAdded) { this.dateAdded = dateAdded; }
}
