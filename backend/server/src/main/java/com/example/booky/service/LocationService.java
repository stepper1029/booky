package com.example.booky.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.booky.dao.LocationDao;
import com.example.booky.model.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

  private static final Logger log = LoggerFactory.getLogger(LocationService.class);
  private final LocationDao locationDao;

  @Autowired
  public LocationService(LocationDao locationDao) {
    this.locationDao = locationDao;
  }


  /**
   * Get locations for a specific user
   */
  public List<Location> getLocationsByUserId(Integer userId) {
    log.info("getLocationByUserId for user: {}", userId);
    return locationDao.findByUserId(userId);
  }

  /**
   * Count the number of libraries for a user
   */
  public int countLocationsByUserId(Integer userId) {
    log.info("countLocationsByUserId service for user: {}", userId);
    return locationDao.countByUserId(userId);
  }

  public String getLocationName(Integer locationId){
    log.info("getting location name for locationid: {}", locationId);
    return locationDao.getLocationName(locationId);
  }

  /**
   * Add a new location
   */
  public Location addLocation(Location location) {
    return locationDao.save(location);
  }
}
