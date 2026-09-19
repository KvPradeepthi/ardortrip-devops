package com.ardortrip;

import com.ardortrip.model.Role;
import com.ardortrip.model.User;
import com.ardortrip.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@SpringBootApplication
public class ArdorTripApplication {

    public static void main(String[] args) {
        SpringApplication.run(ArdorTripApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@ardortrip.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("System Administrator");
                admin.setRole(Role.ROLE_ADMIN);
                admin.setCreatedAt(LocalDateTime.now());
                userRepository.save(admin);
            }
            if (userRepository.findByUsername("demo_user").isEmpty()) {
                User user = new User();
                user.setUsername("demo_user");
                user.setEmail("user@ardortrip.com");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setFullName("Demo Passenger");
                user.setRole(Role.ROLE_USER);
                user.setCreatedAt(LocalDateTime.now());
                userRepository.save(user);
            }
        };
    }
}
