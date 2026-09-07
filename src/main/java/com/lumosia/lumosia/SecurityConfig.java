package com.lumosia.lumosia;
/**
 * Security configuration for Lumosia.
 *
 * @author Shravani Joshi
 */
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // This is BCrypt — the tool that hashes passwords. Same idea as your Node app.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // This decides which pages are public and which need a login.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/signup").permitAll()   // anyone can see home + signup
                        .anyRequest().authenticated()                  // everything else needs login
                )
                .formLogin(form -> form.permitAll())               // Spring gives us a login form
                .logout(logout -> logout.permitAll());
        return http.build();
    }

}
