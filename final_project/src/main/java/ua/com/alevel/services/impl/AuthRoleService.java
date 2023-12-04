package ua.com.alevel.services.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.entities.auth.AuthRole;
import ua.com.alevel.entities.auth.AuthUser;
import ua.com.alevel.repositories.AuthRoleRepository;
import ua.com.alevel.repositories.AuthUserRepository;
import ua.com.alevel.services.ServiceAuthRole;

import java.util.List;
import java.util.Optional;

@Service
public class AuthRoleService implements ServiceAuthRole {

    AuthRoleRepository roleRepository;
    AuthUserRepository userRepository;

    public AuthRoleService(AuthRoleRepository roleRepository, AuthUserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Boolean create(AuthRole role) {
        Optional<AuthRole> findByNameRole = findByName(role.getName());
        if(findByNameRole.isPresent()) {
            role.setId(findByNameRole.get().getId());
            return true;
        }
        AuthRole authRole = roleRepository.saveAndFlush(role);
        if (authRole.getId() != null) {
            return true;
        }
        return false;
    }

    @Override
    public void update(AuthRole role) {
        roleRepository.saveAndFlush(role);
    }

    @Override
    public void delete(AuthRole role) {
        List<AuthUser> users = userRepository.findAll();
        users.stream()
                .filter((user -> user.getRoles().contains(role)))
                .forEach(user -> {
                    user.getRoles().remove(role);
                    userRepository.saveAndFlush(user);
                });
        roleRepository.delete(role);
    }

    @Override
    public boolean existById(Long id) {
        return roleRepository.existsById(id);
    }

    @Override
    public Optional<AuthRole> findById(Long id) {
        return roleRepository.findById(id);
    }

    public Optional<AuthRole> findByName(String name) {
        return Optional.ofNullable(roleRepository.findByName(name));
    }

    @Override
    public List<AuthRole> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public Long count() {
        return roleRepository.count();
    }
}
