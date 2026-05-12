package com.librarymanagement.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public final class AuthRoleUtils {

    private AuthRoleUtils() {
    }

    public static void ensureAdmin(String roleHeader) {
        if (roleHeader == null || !"ADMIN".equalsIgnoreCase(roleHeader.trim())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
    }
}
