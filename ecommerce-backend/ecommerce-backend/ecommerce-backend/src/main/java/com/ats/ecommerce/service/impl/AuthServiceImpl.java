package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.auth.AuthResponseDto;
import com.ats.ecommerce.dto.auth.LoginRequestDto;
import com.ats.ecommerce.dto.auth.RegisterRequestDto;
import com.ats.ecommerce.dto.user.UserDto;
import com.ats.ecommerce.entity.BlacklistedToken;
import com.ats.ecommerce.entity.Role;
import com.ats.ecommerce.entity.User;
import com.ats.ecommerce.mapper.UserMapper;
import com.ats.ecommerce.repository.BlacklistedTokenRepository;
import com.ats.ecommerce.repository.RoleRepository;
import com.ats.ecommerce.repository.UserRepository;
import com.ats.ecommerce.security.JwtService;
import com.ats.ecommerce.security.UserDetailsImpl;
import com.ats.ecommerce.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BlacklistedTokenRepository blacklistedTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public UserDto register(RegisterRequestDto request) {

        // 1. Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // 2. Fetch default role
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

        // 3. Create user entity
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .enabled(true)
                .locked(false)
                .roles(Set.of(userRole))
                .build();

        // 4. Save user
        User savedUser = userRepository.save(user);

        // 5. Return DTO
        return userMapper.toDto(savedUser);
    }

    @Override
    public AuthResponseDto login(LoginRequestDto request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String token = jwtService.generateToken(
                userDetails.getUsername(),
                Map.of(
                        "roles", userDetails.getAuthorities()
                                .stream()
                                .map(GrantedAuthority::getAuthority)
                                .toList()
                )
        );

        return new AuthResponseDto(token);
    }

    @Override
    public void logout(String token) {

        if (blacklistedTokenRepository.existsByToken(token)) {
            return; // already logged out
        }

        BlacklistedToken blacklistedToken = new BlacklistedToken();
        blacklistedToken.setToken(token);
        blacklistedToken.setBlacklistedAt(LocalDateTime.now());

        blacklistedTokenRepository.save(blacklistedToken);
    }

}


