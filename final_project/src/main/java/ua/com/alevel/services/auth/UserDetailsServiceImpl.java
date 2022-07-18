package ua.com.alevel.services.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ua.com.alevel.entities.auth.AuthUser;
import ua.com.alevel.repositories.AuthUserRepository;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    AuthUserRepository userRepository;

    public UserDetailsServiceImpl(AuthUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AuthUser user = userRepository.findById(email).orElseThrow(() -> {
            throw new UsernameNotFoundException("Email " + email + " not found!");
        });
        return new User(user.getUsername(), user.getPassword(), getGrantedAuthority(user));
    }

    private Collection<GrantedAuthority> getGrantedAuthority(AuthUser user) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        if (user.getRoles().stream().anyMatch(authRole -> authRole.getName().equals("admin"))) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        return authorities;
    }

}
