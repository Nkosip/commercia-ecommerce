package com.ats.ecommerce.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;

    private String email;
    private String firstName;
    private String lastName;

    private boolean enabled;
    private boolean locked;

    private Set<String> roles;
}

