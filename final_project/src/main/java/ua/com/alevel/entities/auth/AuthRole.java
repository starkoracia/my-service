package ua.com.alevel.entities.auth;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import ua.com.alevel.entities.BaseEntity;

import javax.persistence.*;

@Entity
@Table(name = "auth_role")
@Getter
@Setter
@ToString
public class AuthRole extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", unique = true)
    private String name;

}