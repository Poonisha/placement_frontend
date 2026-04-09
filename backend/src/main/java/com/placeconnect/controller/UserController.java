package com.placeconnect.controller;

import com.placeconnect.dto.UserUpdateRequest;
import com.placeconnect.model.User;
import com.placeconnect.service.UserService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UserUpdateRequest body) {
        try {
            User updated = userService.updateUser(id, body);
            User safe = new User();
            safe.setId(updated.getId());
            safe.setName(updated.getName());
            safe.setEmail(updated.getEmail());
            safe.setRole(updated.getRole());
            return ResponseEntity.ok(safe);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
