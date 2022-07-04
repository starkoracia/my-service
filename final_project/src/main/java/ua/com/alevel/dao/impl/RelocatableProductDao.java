package ua.com.alevel.dao.impl;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ua.com.alevel.dao.DaoRelocatableProduct;
import ua.com.alevel.entities.RelocatableProduct;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class RelocatableProductDao implements DaoRelocatableProduct {

    EntityManager entityManager;

    public RelocatableProductDao(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Boolean create(RelocatableProduct relocatableProduct) {
        entityManager.persist(relocatableProduct);
        if (relocatableProduct.getId() != null) {
            return true;
        }
        return false;
    }

    @Override
    public void update(RelocatableProduct relocatableProduct) {
        entityManager.merge(relocatableProduct);
    }

    @Override
    public void delete(RelocatableProduct relocatableProduct) {
        entityManager.remove(relocatableProduct);
    }

    @Override
    public boolean existById(Long id) {
        Query query = entityManager
                .createQuery("select count(rp) from RelocatableProduct rp where rp.id = :id")
                .setParameter("id", id);
        return ((Long) query.getSingleResult()) == 1;
    }

    @Override
    public Optional<RelocatableProduct> findById(Long id) {
        Query query = entityManager
                .createQuery("select rp from RelocatableProduct rp where rp.id = :id")
                .setParameter("id", id);
        RelocatableProduct relocatableProduct = (RelocatableProduct) query.getSingleResult();
        return Optional.ofNullable(relocatableProduct);
    }

    @Override
    public List<RelocatableProduct> findAll() {
        List<RelocatableProduct> relocatableProducts = entityManager.
                createQuery("select rp from RelocatableProduct rp")
                .getResultList();
        return relocatableProducts;
    }

    @Override
    public Long count() {
        return (Long) entityManager
                .createQuery("select count(rp) from RelocatableProduct rp")
                .getSingleResult();
    }

}
