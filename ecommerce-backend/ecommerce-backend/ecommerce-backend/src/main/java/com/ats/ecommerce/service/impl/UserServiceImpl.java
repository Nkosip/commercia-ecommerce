package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.user.*;
import com.ats.ecommerce.entity.Role;
import com.ats.ecommerce.entity.User;
import com.ats.ecommerce.exception.ResourceNotFoundException;
import com.ats.ecommerce.mapper.UserMapper;
import com.ats.ecommerce.repository.RoleRepository;
import com.ats.ecommerce.repository.UserRepository;
import com.ats.ecommerce.service.UserService;
import com.ats.ecommerce.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtil securityUtil;

    @Override
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return userMapper.toDto(user);
    }

    @Override
    public UserDto updateProfile(String email, UpdateProfileRequestDto request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        userRepository.save(user);

        return userMapper.toDto(user);
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        return userMapper.toDto(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto updateUserStatus(Long id, UpdateUserStatusRequestDto request) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        user.setEnabled(request.getEnabled());
        user.setLocked(request.getLocked());

        userRepository.save(user);
        return userMapper.toDto(user);
    }

    @Override
    public UserDto updateUserRole(Long userId, UpdateUserRoleRequestDto request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found: " + request.getRole()));

        // Replace existing roles
        user.setRoles(Set.of(role));

        userRepository.save(user);
        return userMapper.toDto(user);
    }

    @Override
    public void updateMyPassword(UpdatePasswordRequestDto request) {

        User user = securityUtil.getCurrentUser();
        // however you currently fetch the logged-in user

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

}
