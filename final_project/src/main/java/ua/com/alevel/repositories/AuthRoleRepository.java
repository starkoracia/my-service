package ua.com.alevel.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import ua.com.alevel.entities.auth.AuthRole;

@Service
public interface AuthRoleRepository extends JpaRepository<AuthRole, Long> {
    AuthRole findByName(String name);
}
