package com.skillsphere.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        loadEnv();

        // Force mock profile/env when starting the dev server or test runner
        if ("test".equalsIgnoreCase(System.getenv("NODE_ENV"))) {
            System.setProperty("spring.profiles.active", "test");
        }
        
        SpringApplication.run(BackendApplication.class, args);
    }

    private static void loadEnv() {
        File envFile = new File(".env");
        if (!envFile.exists()) {
            envFile = new File("../.env");
        }
        if (envFile.exists()) {
            try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }
                    int eqIdx = line.indexOf('=');
                    if (eqIdx > 0) {
                        String key = line.substring(0, eqIdx).trim();
                        String val = line.substring(eqIdx + 1).trim();
                        if (val.startsWith("\"") && val.endsWith("\"")) {
                            val = val.substring(1, val.length() - 1);
                        } else if (val.startsWith("'") && val.endsWith("'")) {
                            val = val.substring(1, val.length() - 1);
                        }
                        if (System.getProperty(key) == null && System.getenv(key) == null) {
                            System.setProperty(key, val);
                        }
                    }
                }
                System.out.println("✅ BackendApplication: Loaded environment variables from " + envFile.getAbsolutePath());
            } catch (Exception e) {
                System.err.println("❌ BackendApplication: Failed to load .env file: " + e.getMessage());
            }
        } else {
            System.out.println("⚠️ BackendApplication: No .env file found at .env or ../.env");
        }
    }
}
