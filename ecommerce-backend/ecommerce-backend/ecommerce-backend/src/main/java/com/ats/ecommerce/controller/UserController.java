package com.ats.ecommerce.controller;

import com.ats.ecommerce.dto.user.*;
import com.ats.ecommerce.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        String email = authentication.getName(); // extracted from JWT
        return ResponseEntity.ok(userService.getCurrentUser(email));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(
            @Valid @RequestBody UpdateProfileRequestDto request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.updateProfile(email, request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequestDto request
    ) {
        return ResponseEntity.ok(userService.updateUserStatus(id, request));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequestDto request
    ) {
        return ResponseEntity.ok(userService.updateUserRole(id, request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> updateMyPassword(
            @Valid @RequestBody UpdatePasswordRequestDto request
    ) {
        userService.updateMyPassword(request);
        return ResponseEntity.noContent().build();
    }

}
