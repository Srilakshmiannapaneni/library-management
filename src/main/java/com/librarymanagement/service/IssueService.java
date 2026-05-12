package com.librarymanagement.service;

import com.librarymanagement.dto.IssueRequestDTO;
import com.librarymanagement.dto.IssueResponseDTO;

import java.util.List;

public interface IssueService {
    IssueResponseDTO issueBook(IssueRequestDTO issueRequestDTO);
    IssueResponseDTO returnBook(Long issueId);
    List<IssueResponseDTO> getAllActiveIssues();
}
