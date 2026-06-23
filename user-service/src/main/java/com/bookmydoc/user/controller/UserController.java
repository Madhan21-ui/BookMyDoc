package com.bookmydoc.user.controller;

import com.bookmydoc.user.entity.User;
import com.bookmydoc.user.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Create User
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // Get All Users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get User By ID
    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {

        return userRepository
                .findByEmail(email)
                .orElse(null);
    }

    // Update User
    @PostMapping("/login")
    public String login(@RequestBody User loginUser) {

        System.out.println("Email Received: " + loginUser.getEmail());
        System.out.println("Password Received: " + loginUser.getPassword());

        User user = userRepository
                .findByEmail(loginUser.getEmail())
                .orElse(null);

        if (user == null) {
            return "User Not Found";
        }

        if (!user.getPassword().equals(loginUser.getPassword())) {
            return "Invalid Password";
        }

        return "Login Success";
    }

    // Delete User
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        userRepository.deleteById(id);

        return "User Deleted Successfully";
    }
}