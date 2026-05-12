package com.librarymanagement.controller;

import com.librarymanagement.dto.BookResponseDTO;
import com.librarymanagement.dto.MemberDTO;
import com.librarymanagement.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@Tag(name = "Member Management", description = "APIs for managing library members")
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    @Operation(summary = "Register a new member", description = "Registers a new member to the library")
    public ResponseEntity<MemberDTO> registerMember(@Valid @RequestBody MemberDTO memberDTO) {
        return new ResponseEntity<>(memberService.registerMember(memberDTO), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all members", description = "Retrieves a list of all registered members")
    public ResponseEntity<List<MemberDTO>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get member by ID", description = "Retrieves details of a specific member by their ID")
    public ResponseEntity<MemberDTO> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    @GetMapping("/{id}/books")
    @Operation(summary = "Get issued books of member", description = "Retrieves a list of books currently issued to the member")
    public ResponseEntity<List<BookResponseDTO>> getIssuedBooksOfMember(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getIssuedBooksOfMember(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete member", description = "Deletes a member from the library")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }
}
