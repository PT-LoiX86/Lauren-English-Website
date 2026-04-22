package com.laurenenglish.platform.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WordMasteryCountDTO {
    private String level;
    private Long words;
}