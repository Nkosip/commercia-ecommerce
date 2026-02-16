package com.ats.ecommerce.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserRoleRequestDto {
    @NotBlank
    private String role; // ROLE_USER or ROLE_ADMIN
}

