package com.librarymanagement.service.impl;

import com.librarymanagement.dto.BookResponseDTO;
import com.librarymanagement.dto.IssueRequestDTO;
import com.librarymanagement.dto.IssueResponseDTO;
import com.librarymanagement.dto.MemberDTO;
import com.librarymanagement.entity.AvailabilityStatus;
import com.librarymanagement.entity.Book;
import com.librarymanagement.entity.IssueRecord;
import com.librarymanagement.entity.Member;
import com.librarymanagement.exception.BookNotAvailableException;
import com.librarymanagement.exception.MemberLimitExceededException;
import com.librarymanagement.exception.ResourceNotFoundException;
import com.librarymanagement.repository.BookRepository;
import com.librarymanagement.repository.IssueRecordRepository;
import com.librarymanagement.repository.MemberRepository;
import com.librarymanagement.service.IssueService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class IssueServiceImpl implements IssueService {

    private final IssueRecordRepository issueRecordRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    private static final int MAX_ACTIVE_ISSUES = 3;

    @Override
    @Transactional
    public IssueResponseDTO issueBook(IssueRequestDTO issueRequestDTO) {
        log.info("Issuing book {} to member {}", issueRequestDTO.getBookId(), issueRequestDTO.getMemberId());

        Book book = bookRepository.findById(issueRequestDTO.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + issueRequestDTO.getBookId()));

        Member member = memberRepository.findById(issueRequestDTO.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + issueRequestDTO.getMemberId()));

        // Validate Book Availability
        if (book.getAvailabilityStatus() == AvailabilityStatus.ISSUED) {
            throw new BookNotAvailableException("Book is currently issued and not available");
        }

        // Validate Member limit
        long activeIssuesCount = issueRecordRepository.countByMemberAndActiveStatus(member, true);
        if (activeIssuesCount >= MAX_ACTIVE_ISSUES) {
            throw new MemberLimitExceededException("Member has reached the maximum limit of " + MAX_ACTIVE_ISSUES + " active issues");
        }

        // Process Issue
        book.setAvailabilityStatus(AvailabilityStatus.ISSUED);
        bookRepository.save(book);

        IssueRecord issueRecord = IssueRecord.builder()
                .issueDate(LocalDate.now())
                .activeStatus(true)
                .book(book)
                .member(member)
                .build();

        IssueRecord savedIssue = issueRecordRepository.save(issueRecord);

        return mapToResponseDTO(savedIssue);
    }

    @Override
    @Transactional
    public IssueResponseDTO returnBook(Long issueId) {
        log.info("Returning book for issue record: {}", issueId);

        IssueRecord issueRecord = issueRecordRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue Record not found with id: " + issueId));

        if (!issueRecord.getActiveStatus()) {
            throw new IllegalArgumentException("Book is already returned for this issue record");
        }

        // Process Return
        issueRecord.setReturnDate(LocalDate.now());
        issueRecord.setActiveStatus(false);

        Book book = issueRecord.getBook();
        book.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);

        bookRepository.save(book);
        IssueRecord updatedIssue = issueRecordRepository.save(issueRecord);

        return mapToResponseDTO(updatedIssue);
    }

    @Override
    public List<IssueResponseDTO> getAllActiveIssues() {
        return issueRecordRepository.findByActiveStatus(true).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private IssueResponseDTO mapToResponseDTO(IssueRecord issueRecord) {
        BookResponseDTO bookDTO = BookResponseDTO.builder()
                .id(issueRecord.getBook().getId())
                .title(issueRecord.getBook().getTitle())
                .author(issueRecord.getBook().getAuthor())
                .coverImage(issueRecord.getBook().getCoverImage())
                .availabilityStatus(issueRecord.getBook().getAvailabilityStatus())
                .build();

        MemberDTO memberDTO = MemberDTO.builder()
                .id(issueRecord.getMember().getId())
                .name(issueRecord.getMember().getName())
                .email(issueRecord.getMember().getEmail())
                .build();

        return IssueResponseDTO.builder()
                .issueId(issueRecord.getIssueId())
                .issueDate(issueRecord.getIssueDate())
                .returnDate(issueRecord.getReturnDate())
                .activeStatus(issueRecord.getActiveStatus())
                .book(bookDTO)
                .member(memberDTO)
                .build();
    }
}
