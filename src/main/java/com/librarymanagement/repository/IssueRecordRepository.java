package com.librarymanagement.repository;

import com.librarymanagement.entity.Book;
import com.librarymanagement.entity.IssueRecord;
import com.librarymanagement.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRecordRepository extends JpaRepository<IssueRecord, Long> {
    long countByMemberAndActiveStatus(Member member, Boolean activeStatus);
    List<IssueRecord> findByBookAndActiveStatus(Book book, Boolean activeStatus);
    List<IssueRecord> findByActiveStatus(Boolean activeStatus);
}
