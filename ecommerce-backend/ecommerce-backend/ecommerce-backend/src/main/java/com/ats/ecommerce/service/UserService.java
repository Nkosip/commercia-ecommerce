package com.ats.ecommerce.service;

import com.ats.ecommerce.dto.user.*;

import java.util.List;

public interface UserService {

    UserDto getCurrentUser(String email);

    UserDto updateProfile(String email, UpdateProfileRequestDto request);

    UserDto getUserById(Long id);

    List<UserDto> getAllUsers();

    UserDto updateUserStatus(Long id, UpdateUserStatusRequestDto request);

    UserDto updateUserRole(Long id, UpdateUserRoleRequestDto request);

    void updateMyPassword(UpdatePasswordRequestDto request);
}
