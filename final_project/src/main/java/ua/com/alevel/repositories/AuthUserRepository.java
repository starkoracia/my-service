package ua.com.alevel.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.alevel.entities.auth.AuthUser;

@Repository
public interface AuthUserRepository extends JpaRepository<AuthUser, String> {
}
