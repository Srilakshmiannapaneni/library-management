package com.librarymanagement.service;

import com.librarymanagement.dto.BookResponseDTO;
import com.librarymanagement.dto.MemberDTO;

import java.util.List;

public interface MemberService {
    MemberDTO registerMember(MemberDTO memberDTO);
    List<MemberDTO> getAllMembers();
    MemberDTO getMemberById(Long id);
    List<BookResponseDTO> getIssuedBooksOfMember(Long id);
    void deleteMember(Long id);
}
