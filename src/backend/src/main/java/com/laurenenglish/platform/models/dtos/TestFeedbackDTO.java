package com.laurenenglish.platform.models.dtos;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class TestFeedbackDTO {
    private String testTitle;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;
}