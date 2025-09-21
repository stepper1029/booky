package com.example.stepperlibrary.dao;

import com.example.stepperlibrary.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationDao extends JpaRepository<Location, Integer> {

  List<Location> findByUserId(Integer userId);

  int countByUserId(Integer userId);
}
