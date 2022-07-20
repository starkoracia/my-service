package ua.com.alevel.controllers;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ua.com.alevel.entities.auth.AuthUser;
import ua.com.alevel.services.impl.AuthUserService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping
@CrossOrigin(origins = "${cross.origin.url}")
public class AuthController {

    AuthUserService userService;
    PasswordEncoder passwordEncoder;

    public AuthController(AuthUserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public AuthUser login(@RequestBody Map<String, String> postBody, HttpServletResponse response) throws IOException {
        String email = postBody.get("email");
        String password = postBody.get("password");
        AuthUser authUser = userService.findById(email).orElse(null);
        if(authUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().println("Email not found!");
            return null;
        }
        if(!passwordEncoder.matches(password, authUser.getPassword())) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
        authUser.setPassword("");
        return authUser;
    }

    @PostMapping("/register")
    public AuthUser register(@RequestBody AuthUser newUser, HttpServletResponse response) {
        AuthUser authUser = userService.findById(newUser.getEmail()).orElse(null);
        if(authUser != null) {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            return null;
        }
        userService.create(newUser);
        return newUser;
    }

}
