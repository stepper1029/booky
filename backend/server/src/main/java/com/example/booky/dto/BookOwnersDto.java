package com.example.booky.dto;

import java.util.ArrayList;
import java.util.List;

public class BookOwnersDto {
  private String isbn;
  private List<OwnerDTO> owners = new ArrayList<>();

  public BookOwnersDto() {}

  public BookOwnersDto(String isbn) {
    this.isbn = isbn;
  }

  public void addOwner(String username, String location, Integer userId) {
    owners.add(new OwnerDTO(username, location, userId));
  }

  public String getIsbn() {
    return isbn;
  }
  public void setIsbn(String isbn) {
    this.isbn = isbn;
  }

  public List<OwnerDTO> getOwners() {
    return owners;
  }
  public void setOwners(List<OwnerDTO> owners) {
    this.owners = owners;
  }

  public static class OwnerDTO {
    private String username;
    private String location;
    private Integer userId;

    public OwnerDTO() {}

    public OwnerDTO(String username, String location, Integer userId) {
      this.username = username;
      this.location = location;
      this.userId = userId;
    }

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

    public Integer getUserId() { return userId;}
    public void setUserId(Integer userId) { this.userId = userId; };
  }
}
