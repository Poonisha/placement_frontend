package com.placeconnect.controller;

import com.placeconnect.model.User;
import com.placeconnect.service.UserService;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"})
public class AuthController {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        if (user.getName() == null || user.getName().isBlank()) {
            return bad("Name is required");
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return bad("Email is required");
        }
        if (!EMAIL_PATTERN.matcher(user.getEmail().trim()).matches()) {
            return bad("Invalid email format");
        }
        List<String> allowed = List.of("STUDENT", "EMPLOYER", "ADMIN", "PLACEMENT_OFFICER", "OFFICER");
        if (user.getRole() != null && !allowed.contains(user.getRole().trim().toUpperCase())) {
            return bad("Invalid role");
        }
        if (user.getRole() != null) {
            user.setRole(user.getRole().trim().toUpperCase());
        }
        Map<String, Object> res = userService.register(user);
        boolean ok = Boolean.TRUE.equals(res.get("success"));
        return ResponseEntity.status(ok ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(res);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        Map<String, Object> res = userService.login(email, password);
        boolean ok = Boolean.TRUE.equals(res.get("success"));
        return ResponseEntity.status(ok ? HttpStatus.OK : HttpStatus.UNAUTHORIZED).body(res);
    }

    private static ResponseEntity<Map<String, Object>> bad(String message) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", message));
    }
}
