package com.example.booky.service;

import com.example.booky.model.User;
import com.example.booky.dao.UserDao;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

  private final UserDao UserDao;

  public UserDetailsServiceImpl(UserDao UserDao) {
    this.UserDao = UserDao;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = UserDao.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    // Return Spring Security UserDetails object
    return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword()) // must be hashed
            .build();
  }
}

