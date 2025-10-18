package com.example.booky.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "friend")
public class Friend {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id; // surrogate primary key

  @Column(name = "user1id", nullable = false)
  private int user1Id;

  @Column(name = "user2id", nullable = false)
  private int user2Id;

  @Column(nullable = false)
  private LocalDate startdate;

  @Column(nullable = false)
  private String status;

  // Constructors
  public Friend() {}

  public Friend(int user1Id, int user2Id, LocalDate startdate, String status) {
    this.user1Id = user1Id;
    this.user2Id = user2Id;
    this.startdate = startdate;
    this.status = status;
  }

  // Getters and setters
  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public int getUser1Id() {
    return user1Id;
  }

  public void setUser1Id(int user1Id) {
    this.user1Id = user1Id;
  }

  public int getUser2Id() {
    return user2Id;
  }

  public void setUser2Id(int user2Id) {
    this.user2Id = user2Id;
  }

  public LocalDate getStartdate() {
    return startdate;
  }

  public void setStartdate(LocalDate startdate) {
    this.startdate = startdate;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }
}
