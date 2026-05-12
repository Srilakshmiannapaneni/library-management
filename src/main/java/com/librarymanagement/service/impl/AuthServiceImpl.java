package com.librarymanagement.service.impl;

import com.librarymanagement.dto.AuthResponseDTO;
import com.librarymanagement.dto.LoginRequestDTO;
import com.librarymanagement.dto.SignupRequestDTO;
import com.librarymanagement.entity.AppUser;
import com.librarymanagement.entity.UserRole;
import com.librarymanagement.repository.AppUserRepository;
import com.librarymanagement.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    private String resolveRole(AppUser user) {
        return user.getRole() != null ? user.getRole().name() : UserRole.USER.name();
    }

    @Override
    @Transactional
    public AuthResponseDTO signup(SignupRequestDTO signupRequestDTO) {
        String normalizedEmail = signupRequestDTO.getEmail().trim().toLowerCase();

        if (appUserRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        AppUser savedUser = appUserRepository.save(
                AppUser.builder()
                        .name(signupRequestDTO.getName().trim())
                        .email(normalizedEmail)
                        .passwordHash(passwordEncoder.encode(signupRequestDTO.getPassword()))
                        .role(UserRole.USER)
                        .build()
        );

        return AuthResponseDTO.builder()
                .message("Signup successful")
                .userId(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(resolveRole(savedUser))
                .build();
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO loginRequestDTO) {
        String normalizedEmail = loginRequestDTO.getEmail().trim().toLowerCase();
        AppUser user = appUserRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return AuthResponseDTO.builder()
                .message("Login successful")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(resolveRole(user))
                .build();
    }
}
