package com.librarymanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueResponseDTO {
    private Long issueId;
    private LocalDate issueDate;
    private LocalDate returnDate;
    private Boolean activeStatus;
    private BookResponseDTO book;
    private MemberDTO member;
}
