package ua.com.alevel.entities.auth;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import ua.com.alevel.entities.BaseEntity;

import javax.persistence.*;
import java.util.LinkedHashSet;
import java.util.Set;

@Table(name = "auth_users")
@Entity
@Getter
@Setter
@ToString
public class AuthUser extends BaseEntity {

    @Id
    private String email;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinTable(name = "auth_users_auth_roles",
            joinColumns = @JoinColumn(name = "auth_user_id"),
            inverseJoinColumns = @JoinColumn(name = "auth_roles_id"))
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<AuthRole> roles = new LinkedHashSet<>();

}
