package com.javnic.econe.config;

import com.javnic.econe.entity.GovernmentProfile;
import com.javnic.econe.entity.User;
import com.javnic.econe.enums.UserRole;
import com.javnic.econe.enums.UserStatus;
import com.javnic.econe.repository.GovernmentProfileRepository;
import com.javnic.econe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final GovernmentProfileRepository governmentProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if government user already exists
        if (!userRepository.existsByEmail("government@agriculture.gov.in")) {
            log.info("Creating default government user");

            // Create government user
            User governmentUser = User.builder()
                    .email("government@agriculture.gov.in")
                    .password(passwordEncoder.encode("Government@123"))
                    .role(UserRole.GOVERNMENT)
                    .status(UserStatus.ACTIVE)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            governmentUser = userRepository.save(governmentUser);

            // Create government profile
            GovernmentProfile profile = GovernmentProfile.builder()
                    .userId(governmentUser.getId())
                    .departmentName("Department of Agriculture")
                    .officerName("System Administrator")
                    .designation("Agriculture Officer")
                    .phoneNumber("1800123456")
                    .officeAddress("State Agriculture Office, Vallabh Bhavan, Bhopal, Madhya Pradesh")
                    .employeeId("GOV001")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            profile = governmentProfileRepository.save(profile);

            // Update user with profile ID
            governmentUser.setProfileId(profile.getId());
            userRepository.save(governmentUser);

            log.info("Default government user created successfully");
            log.info("Email: government@agriculture.gov.in");
            log.info("Password: Government@123");
        }
    }
}
