package com.example.stepperlibrary.dao;

import com.example.stepperlibrary.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationDao extends JpaRepository<Location, Integer> {

  List<Location> findByUserId(Integer userId);

  @Query("""
    SELECT name
    FROM Location
    WHERE id = :locationId
""")
  String getLocationName(Integer locationId);

  int countByUserId(Integer userId);

}
