package com.lumosia.lumosia;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

import java.security.Principal;

@Controller
public class pageContoller {

    @GetMapping("/charms")
    public String charms(Principal principal, Model model){
        model.addAttribute("username", principal.getName());
        return "charms";
    }
}
