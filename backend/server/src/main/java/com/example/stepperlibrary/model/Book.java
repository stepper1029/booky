package com.example.stepperlibrary.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "book")
public class Book {
  @Id
  @Column(length = 13)
  private String isbn;

  @Column(length = 10)
  private String isbn10;

  @Column(name = "location_id")
  private Integer locationId;

  private String title;

  @Column(name = "author_first_name")
  private String authorFirstName;

  @Column(name = "author_last_name")
  private String authorLastName;

  @Column(columnDefinition = "TEXT")
  private String blurb;

  @Column(name = "date_added")
  private LocalDate dateAdded;

  // Getters and setters
  public String getIsbn() { return isbn; }
  public void setIsbn(String isbn) { this.isbn = isbn; }
  public String getIsbn10() { return isbn10; }
  public void setIsbn10(String isbn10) { this.isbn10 = isbn10; }
  public Integer getLocationId() { return locationId; }
  public void setLocationId(Integer locationId) { this.locationId = locationId; }
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  public String getAuthorFirstName() { return authorFirstName; }
  public void setAuthorFirstName(String authorFirstName) { this.authorFirstName = authorFirstName; }
  public String getAuthorLastName() { return authorLastName; }
  public void setAuthorLastName(String authorLastName) { this.authorLastName = authorLastName; }
  public String getBlurb() { return blurb; }
  public void setBlurb(String blurb) { this.blurb = blurb; }
  public LocalDate getDateAdded() { return dateAdded; }
  public void setDateAdded(LocalDate dateAdded) { this.dateAdded = dateAdded; }
}

