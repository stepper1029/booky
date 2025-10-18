package com.example.booky.dto;

import java.util.ArrayList;
import java.util.List;

public class BookDto {
  private String isbn;
  private String title;
  private String author;
  private String blurb;
  private List<OwnerDTO> owners = new ArrayList<>();

  public BookDto() {}

  public BookDto(String isbn, String title, String author, String blurb) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.blurb = blurb;
  }

  // Add an owner
  public void addOwner(String username, String location) {
    this.owners.add(new OwnerDTO(username, location));
  }

  // Getters and setters
  public String getIsbn() {
    return isbn;
  }
  public void setIsbn(String isbn) {
    this.isbn = isbn;
  }

  public String getTitle() {
    return title;
  }
  public void setTitle(String title) {
    this.title = title;
  }

  public String getAuthor() {
    return author;
  }
  public void setAuthor(String author) {
    this.author = author;
  }

  public String getBlurb() {
    return blurb;
  }
  public void setBlurb(String blurb) {
    this.blurb = blurb;
  }

  public List<OwnerDTO> getOwners() {
    return owners;
  }
  public void setOwners(List<OwnerDTO> owners) {
    this.owners = owners;
  }

  // Inner static class to represent an owner
  public static class OwnerDTO {
    private String username;
    private String location;

    public OwnerDTO() {}

    public OwnerDTO(String username, String location) {
      this.username = username;
      this.location = location;
    }

    // Getters and setters
    public String getUsername() {
      return username;
    }
    public void setUsername(String username) {
      this.username = username;
    }

    public String getLocation() {
      return location;
    }
    public void setLocation(String location) {
      this.location = location;
    }
  }
}
