package com.example.stepperlibrary.controller;

import com.example.stepperlibrary.model.Location;
import com.example.stepperlibrary.service.LocationService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/locations")
public class LocationController {

  private static final Logger log = LoggerFactory.getLogger(LocationController.class);
  private final LocationService locationService;


  @Autowired
  public LocationController(LocationService locationService) {
    this.locationService = locationService;
  }

  /**
   * Get number of libraries for a hardcoded user
   */
  @GetMapping("/count")
  public int getLocationCountForUser(@RequestParam int userId) {
    log.info("getLocationCountByUserId controller called for user: {}", userId);
    return locationService.countLocationsByUserId(userId);
  }

  /**
   * Get locations for a specific user
   */
  @GetMapping("/user/locations")
  public List<Location> getLocationsByUser(@RequestParam int userId) {
    return locationService.getLocationsByUserId(userId);
  }

  /**
   * Add a new location for a user
   */
  @PostMapping
  public Location addLocation(@RequestBody Location location) {
    return locationService.addLocation(location);
  }
}
