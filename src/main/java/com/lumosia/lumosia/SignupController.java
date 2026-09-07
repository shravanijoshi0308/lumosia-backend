package com.lumosia.lumosia;
/*
@author Shravani Joshi
* */
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class SignupController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Controller injection
    public SignupController(UserRepository userRepository, PasswordEncoder passwordEncoder)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    /*GetMapping
    * Signup form renders template/signup.html*/
    @GetMapping("/signup")
    public String signupForm()
    {
        return "signup";
    }
    /*@PostMapping
    * Handles submission form*/
    @PostMapping("/signup")
    public String doSignup(@RequestParam  String username,
                           @RequestParam String email,
                           @RequestParam String password)
    {
        //checks if the username is already taken//
        if(userRepository.existsByUsername(username))
        {
            return "redirect:/signup?error=taken";
        }
        String hash = passwordEncoder.encode(password);
        userRepository.save(new User(username, email, hash));
        return "redirect:/login?registered";
    }
    @GetMapping("/login")
    public String loginForm() {
        return "login";
    }
}

