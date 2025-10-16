package com.example.stepperlibrary.controller;

import com.example.stepperlibrary.dao.UserDao;
import com.example.stepperlibrary.model.User;
import com.example.stepperlibrary.util.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final UserDao userDao;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authManager;
  private final JwtUtil jwtUtil;
  private static final Logger log = LoggerFactory.getLogger(AuthController.class);

  public AuthController(UserDao userDao, PasswordEncoder passwordEncoder,
                        AuthenticationManager authManager, JwtUtil jwtUtil) {
    this.userDao = userDao;
    this.passwordEncoder = passwordEncoder;
    this.authManager = authManager;
    this.jwtUtil = jwtUtil;
  }

  @PostMapping("/signup")
  public String signUp(@RequestBody User user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    userDao.save(user);
    return "User registered successfully";
  }

  @PostMapping("/signin")
  public String signIn(@RequestBody User user) {
    try {
      authManager.authenticate(
              new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
      );
      log.info("User: {}", user.getUsername());
    } catch (Exception e) {
      log.info("password: {}", user.getPassword());
      e.printStackTrace();
      throw e;
    }
    return jwtUtil.generateToken(user.getUsername());
  }

}
