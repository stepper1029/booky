package com.example.stepperlibrary.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(unique = true, nullable = false)
  private String username;

  @Column(nullable = false)
  private String fullname;

  @Column(columnDefinition = "TEXT")
  private String bio;

  @Column(name = "joindate", nullable = false)
  private LocalDate joinDate;

  @Column(name = "topone")
  private String topOne;

  @Column(name = "toptwo")
  private String topTwo;

  @Column(name = "topthree")
  private String topThree;

  @Column(name = "topfour")
  private String topFour;



  // Constructors
  public User() {}

  public User(String username, String fullname, LocalDate joinDate) {
    this.username = username;
    this.fullname = fullname;
    this.joinDate = joinDate;
  }

  // Getters and setters
  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getFullname() {
    return fullname;
  }

  public void setFullname(String fullname) {
    this.fullname = fullname;
  }

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  public LocalDate getJoinDate() {
    return joinDate;
  }

  public void setJoinDate(LocalDate joinDate) {
    this.joinDate = joinDate;
  }

  public String getTopOne() {
    return topOne;
  }

  public void setTopOne(String topOne) {
    this.topOne = topOne;
  }

  public String getTopTwo() {
    return topTwo;
  }

  public void setTopTwo(String topTwo) {
    this.topTwo = topTwo;
  }

  public String getTopThree() {
    return topThree;
  }

  public void setTopThree(String topThree) {
    this.topThree = topThree;
  }

  public String getTopFour() {
    return topFour;
  }

  public void setTopFour(String topFour) {
    this.topFour = topFour;
  }
}
