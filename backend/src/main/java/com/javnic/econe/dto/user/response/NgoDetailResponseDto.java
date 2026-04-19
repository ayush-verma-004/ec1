package com.javnic.econe.dto.user.response;

import com.javnic.econe.dto.profile.NGOProfileDto;
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
public class NgoDetailResponseDto {
    private String userId;
    private String email;
    private UserRole role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private NGOProfileDto profile;
}
