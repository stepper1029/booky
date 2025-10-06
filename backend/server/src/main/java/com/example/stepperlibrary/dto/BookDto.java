package com.example.stepperlibrary.dto;

import java.util.List;

// BookDto.java
public record BookDto(
        String title,
        List<String> authors,
        String publisher,
        String publishedDate,
        String description,
        String thumbnail,
        String isbn13
) {}

