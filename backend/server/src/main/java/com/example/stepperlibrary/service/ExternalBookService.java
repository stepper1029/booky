package com.example.stepperlibrary.service;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.Map;

@Service
public class ExternalBookService {

  private final RestTemplate restTemplate = new RestTemplate();
  private final String GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

  public Map searchBooksByTitle(String title) {
    String url = UriComponentsBuilder.fromHttpUrl(GOOGLE_BOOKS_API)
            .queryParam("q", "intitle:" + title)
            .build()
            .toUriString();
    return restTemplate.getForObject(url, Map.class);
  }

  public Map searchBooksByAuthor(String author) {
    String url = UriComponentsBuilder.fromHttpUrl(GOOGLE_BOOKS_API)
            .queryParam("q", "inauthor:" + author)
            .build()
            .toUriString();
    return restTemplate.getForObject(url, Map.class);
  }
}

