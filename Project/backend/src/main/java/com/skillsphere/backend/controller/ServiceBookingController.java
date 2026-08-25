package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.ServiceBooking;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.ServiceBookingRepository;
import com.skillsphere.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/bookings")
public class ServiceBookingController {

    private final ServiceBookingRepository serviceBookingRepository;
    private final UserRepository userRepository;

    public ServiceBookingController(ServiceBookingRepository serviceBookingRepository, UserRepository userRepository) {
        this.serviceBookingRepository = serviceBookingRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof Claims)) {
            return null;
        }
        Claims claims = (Claims) principal;
        Long userId = Long.parseLong(claims.getSubject());
        return userRepository.findById(userId).orElse(null);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getMyBookings() {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<ServiceBooking> bookings = serviceBookingRepository.findByUserEmailOrderByCreatedAtDesc(user.getEmail());
        response.put("success", true);
        response.put("bookings", bookings);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String serviceId = body.get("serviceId");
        String serviceTitle = body.get("serviceTitle");
        String date = body.get("date");
        String time = body.get("time");

        if (serviceId == null || serviceTitle == null || date == null || time == null) {
            response.put("success", false);
            response.put("message", "Missing booking fields");
            return ResponseEntity.badRequest().body(response);
        }

        ServiceBooking booking = new ServiceBooking();
        booking.setServiceId(serviceId);
        booking.setServiceTitle(serviceTitle);
        booking.setDate(date);
        booking.setTime(time);
        booking.setStatus("scheduled");
        booking.setUserEmail(user.getEmail());

        serviceBookingRepository.save(booking);

        response.put("success", true);
        response.put("booking", booking);
        return ResponseEntity.ok(response);
    }
}
