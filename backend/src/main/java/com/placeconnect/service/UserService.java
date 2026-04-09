package com.placeconnect.service;

import com.placeconnect.dto.UserUpdateRequest;
import com.placeconnect.model.User;
import com.placeconnect.repository.UserRepository;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> register(User user) {
        Map<String, Object> res = new HashMap<>();
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            res.put("success", false);
            res.put("message", "Password is required");
            return res;
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            res.put("success", false);
            res.put("message", "Email is required");
            return res;
        }
        if (userRepository.existsByEmail(user.getEmail().trim())) {
            res.put("success", false);
            res.put("message", "Email already registered");
            return res;
        }
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("STUDENT");
        }
        user.setEmail(user.getEmail().trim());
        User saved = userRepository.save(user);
        res.put("success", true);
        res.put("user", sanitizeForResponse(saved));
        res.put("message", "Registered successfully");
        return res;
    }

    public Map<String, Object> login(String email, String password) {
        Map<String, Object> res = new HashMap<>();
        Optional<User> opt = userRepository.findByEmail(email == null ? "" : email.trim());
        if (opt.isEmpty()) {
            res.put("success", false);
            res.put("message", "User not found");
            return res;
        }
        User existing = opt.get();
        if (existing.getPassword() == null
                || password == null
                || !existing.getPassword().equals(password)) {
            res.put("success", false);
            res.put("message", "Invalid password");
            return res;
        }
        res.put("success", true);
        res.put("user", sanitizeForResponse(existing));
        res.put("token", "dummy-token-" + existing.getId());
        return res;
    }

    @Transactional
    public User updateUser(Long id, UserUpdateRequest body) {
        User u = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (body.getName() != null && !body.getName().isBlank()) {
            u.setName(body.getName().trim());
        }
        if (body.getEmail() != null && !body.getEmail().isBlank()) {
            String newEmail = body.getEmail().trim();
            if (!newEmail.equalsIgnoreCase(u.getEmail()) && userRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("Email already in use");
            }
            u.setEmail(newEmail);
        }
        if (body.getPassword() != null && !body.getPassword().isBlank()) {
            u.setPassword(body.getPassword());
        }
        return userRepository.save(u);
    }

    private static User sanitizeForResponse(User u) {
        User out = new User();
        out.setId(u.getId());
        out.setName(u.getName());
        out.setEmail(u.getEmail());
        out.setRole(u.getRole());
        return out;
    }
}
