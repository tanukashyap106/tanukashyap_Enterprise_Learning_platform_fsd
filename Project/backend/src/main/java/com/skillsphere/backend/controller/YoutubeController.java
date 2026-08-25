package com.skillsphere.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/youtube")
public class YoutubeController {
    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, String> videoCache = new ConcurrentHashMap<>();

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchVideo(@RequestParam String query) {
        Map<String, Object> response = new HashMap<>();
        
        if (query == null || query.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Query parameter is required");
            return ResponseEntity.status(400).body(response);
        }

        String cacheKey = query.trim().toLowerCase();
        if (videoCache.containsKey(cacheKey)) {
            response.put("success", true);
            response.put("videoId", videoCache.get(cacheKey));
            return ResponseEntity.ok(response);
        }

        try {
            String encodedQuery = URLEncoder.encode(query.trim() + " tutorial", StandardCharsets.UTF_8.toString());
            String searchUrl = "https://www.youtube.com/results?search_query=" + encodedQuery;
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36");
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            
            ResponseEntity<String> searchResponse = restTemplate.exchange(
                searchUrl,
                org.springframework.http.HttpMethod.GET,
                entity,
                String.class
            );

            String html = searchResponse.getBody();
            String videoId = extractVideoId(html);
            
            if (videoId != null && !videoId.isEmpty()) {
                videoCache.put(cacheKey, videoId);
                response.put("success", true);
                response.put("videoId", videoId);
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            System.err.println("YouTube fetch error: " + e.getMessage());
        }

        // Fallback video ID (React JS Course)
        response.put("success", true);
        response.put("videoId", "Ke90Tje7VS0");
        return ResponseEntity.ok(response);
    }

    private String extractVideoId(String html) {
        if (html == null) return null;
        
        Pattern pattern = Pattern.compile("/watch\\?v=([A-Za-z0-9_-]{11})");
        Matcher matcher = pattern.matcher(html);
        if (matcher.find()) {
            return matcher.group(1);
        }
        
        Pattern patternJson = Pattern.compile("\"videoId\"\\s*:\\s*\"([A-Za-z0-9_-]{11})\"");
        Matcher matcherJson = patternJson.matcher(html);
        if (matcherJson.find()) {
            return matcherJson.group(1);
        }
        
        return null;
    }
}
