package ua.com.alevel.services;

import ua.com.alevel.entities.BaseEntity;

import java.util.List;
import java.util.Optional;

public interface BaseService<ENTITY extends BaseEntity, ID> {
    Boolean create(ENTITY entity);

    void update(ENTITY entity);

    void delete(ENTITY entity);

    boolean existById(ID id);

    Optional<ENTITY> findById(ID id);

    List<ENTITY> findAll();

    Long count();
}
