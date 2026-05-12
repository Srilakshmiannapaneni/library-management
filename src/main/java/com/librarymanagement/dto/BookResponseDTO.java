package com.librarymanagement.dto;

import com.librarymanagement.entity.AvailabilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponseDTO {
    private Long id;
    private String title;
    private String author;
    private String coverImage;
    private AvailabilityStatus availabilityStatus;
}
