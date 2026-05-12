package com.librarymanagement.service;

import com.librarymanagement.dto.AuthResponseDTO;
import com.librarymanagement.dto.LoginRequestDTO;
import com.librarymanagement.dto.SignupRequestDTO;

public interface AuthService {
    AuthResponseDTO signup(SignupRequestDTO signupRequestDTO);
    AuthResponseDTO login(LoginRequestDTO loginRequestDTO);
}
