package com.librarymanagement.controller;

import com.librarymanagement.dto.IssueRequestDTO;
import com.librarymanagement.dto.IssueResponseDTO;
import com.librarymanagement.service.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@Tag(name = "Issue Management", description = "APIs for issuing and returning books")
public class IssueController {

    private final IssueService issueService;

    @PostMapping("/issue")
    @Operation(summary = "Issue a book", description = "Issues an available book to a member")
    public ResponseEntity<IssueResponseDTO> issueBook(@Valid @RequestBody IssueRequestDTO issueRequestDTO) {
        return new ResponseEntity<>(issueService.issueBook(issueRequestDTO), HttpStatus.CREATED);
    }

    @PutMapping("/return/{issueId}")
    @Operation(summary = "Return a book", description = "Returns an issued book based on issue ID")
    public ResponseEntity<IssueResponseDTO> returnBook(@PathVariable Long issueId) {
        return ResponseEntity.ok(issueService.returnBook(issueId));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active issues", description = "Retrieves a list of all currently active book issues")
    public ResponseEntity<List<IssueResponseDTO>> getAllActiveIssues() {
        return ResponseEntity.ok(issueService.getAllActiveIssues());
    }
}
