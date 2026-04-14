package com.javnic.econe.util;

import java.security.SecureRandom;

public class HashGenerationUtil {

    private static final String LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String DIGITS = "0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateHash() {
        StringBuilder sb = new StringBuilder(6);

        // 2 Uppercase letters
        for (int i = 0; i < 2; i++) {
            sb.append(LETTERS.charAt(RANDOM.nextInt(LETTERS.length())));
        }

        // 4 Digits
        for (int i = 0; i < 4; i++) {
            sb.append(DIGITS.charAt(RANDOM.nextInt(DIGITS.length())));
        }

        return sb.toString();
    }
}
