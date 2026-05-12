package com.librarymanagement.service.impl;

import com.librarymanagement.dto.BookResponseDTO;
import com.librarymanagement.dto.MemberDTO;
import com.librarymanagement.entity.IssueRecord;
import com.librarymanagement.entity.Member;
import com.librarymanagement.exception.ResourceNotFoundException;
import com.librarymanagement.repository.IssueRecordRepository;
import com.librarymanagement.repository.MemberRepository;
import com.librarymanagement.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final IssueRecordRepository issueRecordRepository;

    @Override
    @Transactional
    public MemberDTO registerMember(MemberDTO memberDTO) {
        log.info("Registering new member: {}", memberDTO.getEmail());
        Member member = Member.builder()
                .name(memberDTO.getName())
                .email(memberDTO.getEmail())
                .build();
        Member savedMember = memberRepository.save(member);
        return mapToDTO(savedMember);
    }

    @Override
    public List<MemberDTO> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MemberDTO getMemberById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
        return mapToDTO(member);
    }

    @Override
    public List<BookResponseDTO> getIssuedBooksOfMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));

        // Get all active issue records for this member
        List<IssueRecord> activeIssues = member.getIssueRecords().stream()
                .filter(IssueRecord::getActiveStatus)
                .collect(Collectors.toList());

        return activeIssues.stream()
                .map(issue -> BookResponseDTO.builder()
                        .id(issue.getBook().getId())
                        .title(issue.getBook().getTitle())
                        .author(issue.getBook().getAuthor())
                        .availabilityStatus(issue.getBook().getAvailabilityStatus())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteMember(Long id) {
        log.info("Deleting member with id: {}", id);
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
        memberRepository.delete(member);
    }

    private MemberDTO mapToDTO(Member member) {
        return MemberDTO.builder()
                .id(member.getId())
                .name(member.getName())
                .email(member.getEmail())
                .build();
    }
}
