package com.ats.ecommerce.service;

import com.ats.ecommerce.dto.auth.AuthResponseDto;
import com.ats.ecommerce.dto.auth.LoginRequestDto;
import com.ats.ecommerce.dto.auth.RegisterRequestDto;
import com.ats.ecommerce.dto.user.UserDto;

public interface AuthService {
    UserDto register(RegisterRequestDto request);

    AuthResponseDto login(LoginRequestDto request);

    void logout(String token);

}

