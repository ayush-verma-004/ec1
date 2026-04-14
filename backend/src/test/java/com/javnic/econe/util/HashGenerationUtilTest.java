package com.javnic.econe.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class HashGenerationUtilTest {

    @Test
    public void testHashFormat() {
        for (int i = 0; i < 100; i++) {
            String hash = HashGenerationUtil.generateHash();
            assertNotNull(hash);
            assertEquals(6, hash.length());
            assertTrue(hash.matches("^[A-Z]{2}\\d{4}$"), "Hash " + hash + " does not match format");
        }
    }
}
