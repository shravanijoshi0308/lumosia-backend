package com.lumosia.lumosia;
/**
 * HomePage Controller  for Lumosia.
 *
 * @author Shravani Joshi
 */
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class HomePageController {

    @GetMapping("/")
    public String home() {
        return "<h1>Lumosia ✨</h1><p>Your Mac deserves a charm too.</p>";
    }
}

