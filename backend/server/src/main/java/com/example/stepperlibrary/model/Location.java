package com.example.stepperlibrary.model;

import jakarta.persistence.*;

@Entity
@Table(name = "location")
public class Location {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(nullable = false)
  private String name;

  @Column(name = "userid", nullable = false)
  private int userId;

  // Constructors
  public Location() {}

  public Location(String name, int userId) {
    this.name = name;
    this.userId = userId;
  }

  // Getters and setters
  public int getId() { return id; }
  public void setId(int id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public int getUserId() { return userId; }
  public void setUserId(int userId) { this.userId = userId; }
}
