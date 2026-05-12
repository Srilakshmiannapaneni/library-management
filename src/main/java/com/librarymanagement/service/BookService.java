package com.librarymanagement.service;

import com.librarymanagement.dto.BookRequestDTO;
import com.librarymanagement.dto.BookResponseDTO;

import java.util.List;

public interface BookService {
    BookResponseDTO addBook(BookRequestDTO bookRequestDTO);
    List<BookResponseDTO> getAllBooks();
    List<BookResponseDTO> getAvailableBooks();
    List<BookResponseDTO> searchByTitle(String title);
    List<BookResponseDTO> searchByAuthor(String author);
    BookResponseDTO updateBook(Long id, BookRequestDTO bookRequestDTO);
    void deleteBook(Long id);
}
