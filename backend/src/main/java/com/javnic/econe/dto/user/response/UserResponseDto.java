package com.javnic.econe.dto.user.response;

import com.javnic.econe.enums.UserRole;
import com.javnic.econe.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private String id;
    private String email;
    private UserRole role;
    private UserStatus status;
    private String profileId;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}