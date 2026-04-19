package com.javnic.econe.task;

import com.javnic.econe.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserCleanupTask {

    private final UserService userService;

    /**
     * Cleans up unverified users older than 10 minutes.
     * Runs every 5 minutes.
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void cleanupUnverifiedUsers() {
        log.info("Starting scheduled cleanup for unverified users...");
        userService.deleteUnverifiedUsersOlderThan(10);
    }
}
