package com.javnic.econe.service;

import com.javnic.econe.dto.user.request.CreateNGORequestDto;
import com.javnic.econe.dto.user.response.UserResponseDto;

public interface UserService {
    UserResponseDto createNGO(CreateNGORequestDto request, String createdByUserId);
}
