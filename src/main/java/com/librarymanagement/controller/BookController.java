package com.librarymanagement.controller;

import com.librarymanagement.dto.BookRequestDTO;
import com.librarymanagement.dto.BookResponseDTO;
import com.librarymanagement.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import static com.librarymanagement.util.AuthRoleUtils.ensureAdmin;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Book Management", description = "APIs for managing books in the library")
public class BookController {

    private final BookService bookService;

    @PostMapping
    @Operation(summary = "Add a new book", description = "Adds a new book to the library")
    public ResponseEntity<BookResponseDTO> addBook(
            @RequestHeader(value = "X-User-Role", required = false) String userRole,
            @Valid @RequestBody BookRequestDTO bookRequestDTO) {
        ensureAdmin(userRole);
        return new ResponseEntity<>(bookService.addBook(bookRequestDTO), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all books", description = "Retrieves a list of all books")
    public ResponseEntity<List<BookResponseDTO>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/available")
    @Operation(summary = "Get available books", description = "Retrieves a list of books that are currently available")
    public ResponseEntity<List<BookResponseDTO>> getAvailableBooks() {
        return ResponseEntity.ok(bookService.getAvailableBooks());
    }

    @GetMapping("/title/{title}")
    @Operation(summary = "Search books by title", description = "Searches for books containing the given title")
    public ResponseEntity<List<BookResponseDTO>> searchByTitle(@PathVariable String title) {
        return ResponseEntity.ok(bookService.searchByTitle(title));
    }

    @GetMapping("/author/{author}")
    @Operation(summary = "Search books by author", description = "Searches for books written by the given author")
    public ResponseEntity<List<BookResponseDTO>> searchByAuthor(@PathVariable String author) {
        return ResponseEntity.ok(bookService.searchByAuthor(author));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update book details", description = "Updates the title and author of an existing book")
    public ResponseEntity<BookResponseDTO> updateBook(
            @RequestHeader(value = "X-User-Role", required = false) String userRole,
            @PathVariable Long id,
            @Valid @RequestBody BookRequestDTO bookRequestDTO) {
        ensureAdmin(userRole);
        return ResponseEntity.ok(bookService.updateBook(id, bookRequestDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete book", description = "Deletes a book from the library")
    public ResponseEntity<Void> deleteBook(
            @RequestHeader(value = "X-User-Role", required = false) String userRole,
            @PathVariable Long id) {
        ensureAdmin(userRole);
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
