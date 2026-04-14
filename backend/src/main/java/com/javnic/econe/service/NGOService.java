package com.javnic.econe.service;

import com.javnic.econe.dto.profile.NGOProfileDto;

public interface NGOService {
    NGOProfileDto getNGOProfile(String userId);

    NGOProfileDto updateNGOProfile(String userId, NGOProfileDto profileDto);
}
