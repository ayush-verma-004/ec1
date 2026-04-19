package com.javnic.econe.service;

import com.javnic.econe.dto.user.request.CreateNGORequestDto;
import com.javnic.econe.dto.user.response.NgoDetailResponseDto;
import com.javnic.econe.dto.user.response.UserResponseDto;
import java.util.List;

public interface UserService {
    UserResponseDto createNGO(CreateNGORequestDto request, String createdByUserId);
    List<NgoDetailResponseDto> findAllNgos();
    void deleteNgo(String userId);
    void deleteUnverifiedUsersOlderThan(int minutes);
}
