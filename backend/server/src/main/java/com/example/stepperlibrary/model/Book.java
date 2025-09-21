package com.example.stepperlibrary.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "book")
public class Book {
  @Id
  @Column(name = "isbn")
  private String isbn;

  @Column(name = "isbn10")
  private String isbn10;

  @Column(name = "locationid")
  private Integer locationId;

  @Column(name = "userid", nullable = false)
  private Integer userId;

  private String title;

  @Column(name = "authorfirstname")
  private String authorFirstName;

  @Column(name = "authorlastname")
  private String authorLastName;

  @Column(columnDefinition = "TEXT")
  private String blurb;

  @Column(name = "dateadded")
  private LocalDate dateAdded;

  public String getIsbn() { return isbn; }
  public void setIsbn(String isbn) { this.isbn = isbn; }
  public String getIsbn10() { return isbn10; }
  public void setIsbn10(String isbn10) { this.isbn10 = isbn10; }
  public Integer getLocationId() { return locationId; }
  public void setLocationId(Integer locationId) { this.locationId = locationId; }
  public Integer getUserId() { return userId; }
  public void setUserId(Integer userId) { this.userId = userId; }
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

