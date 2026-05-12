package com.librarymanagement.config;

import com.librarymanagement.entity.AvailabilityStatus;
import com.librarymanagement.entity.Book;
import com.librarymanagement.entity.AppUser;
import com.librarymanagement.entity.UserRole;
import com.librarymanagement.repository.AppUserRepository;
import com.librarymanagement.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedDefaultAdmin();

        if (bookRepository.count() > 0) {
            return;
        }

        List<Book> defaultBooks = List.of(
                buildBook("Atomic Habits", "James Clear", "0605ebc9-e289-41e8-a0fe-02ea1c3f8619.jpg"),
                buildBook("The Alchemist", "Paulo Coelho", "5c23889f-393d-48dc-925e-027845d437ed.jpg"),
                buildBook("Deep Work", "Cal Newport", "7561cc6d-383d-4925-a19a-cb8652f6c236.jpg"),
                buildBook("The Psychology of Money", "Morgan Housel", "c3566c23-e828-47cd-a474-1e62e4830d8d.jpg"),
                buildBook("Rich Dad Poor Dad", "Robert T. Kiyosaki", "cd57ea1c-0ccc-4672-bb83-9711629f2b39.jpg"),
                buildBook("Ikigai", "Hector Garcia", "d264997d-0e4c-4822-b024-8fd3fced752e.jpg"),
                buildBook("Start With Why", "Simon Sinek", "d9e2bc4d-38c1-49f9-9c70-3b08817d6672.jpg"),
                buildBook("The 5 AM Club", "Robin Sharma", "df4bbb6a-066e-4233-ac74-c2b5a5190340.jpg"),
                buildBook("Think and Grow Rich", "Napoleon Hill", "edebd11e-28f6-483d-a408-0e60b2f8acf3.jpg")
        );

        bookRepository.saveAll(defaultBooks);
    }

    private void seedDefaultAdmin() {
        String adminEmail = "admin@library.com";
        AppUser adminUser = appUserRepository.findByEmail(adminEmail)
                .orElseGet(() -> AppUser.builder().email(adminEmail).build());

        adminUser.setName("Library Admin");
        adminUser.setPasswordHash(passwordEncoder.encode("Admin@123"));
        adminUser.setRole(UserRole.ADMIN);

        appUserRepository.save(adminUser);
    }

    private Book buildBook(String title, String author, String coverImage) {
        return Book.builder()
                .title(title)
                .author(author)
                .coverImage(coverImage)
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .build();
    }
}
