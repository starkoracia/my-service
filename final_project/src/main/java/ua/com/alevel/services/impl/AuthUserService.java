package ua.com.alevel.services.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.entities.auth.AuthUser;
import ua.com.alevel.repositories.AuthUserRepository;
import ua.com.alevel.services.ServiceAuthUser;

import java.util.List;
import java.util.Optional;

@Service
public class AuthUserService implements ServiceAuthUser {

    private AuthUserRepository userRepository;

    public AuthUserService(AuthUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Boolean create(AuthUser user) {
        AuthUser save = userRepository.saveAndFlush(user);
        if (save != null) {
            return true;
        }
        return false;
    }

    @Override
    public void update(AuthUser user) {
        userRepository.saveAndFlush(user);
    }

    @Override
    public void delete(AuthUser user) {
        userRepository.delete(user);
    }

    @Override
    public boolean existById(String username) {
        return userRepository.existsById(username);
    }

    @Override
    public Optional<AuthUser> findById(String username) {
        return userRepository.findById(username);
    }

    @Override
    public List<AuthUser> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Long count() {
        return userRepository.count();
    }

}
