package com.usermanagement.dto;

import com.usermanagement.entity.Role;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class LoginResponse {
    private String token;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
} 