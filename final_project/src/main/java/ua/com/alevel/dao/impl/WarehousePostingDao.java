package ua.com.alevel.dao.impl;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ua.com.alevel.dao.DaoWarehousePosting;
import ua.com.alevel.entities.RelocatableProduct;
import ua.com.alevel.entities.WarehousePosting;
import ua.com.alevel.entities.WarehousePosting_;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.criteria.*;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
@Transactional
public class WarehousePostingDao implements DaoWarehousePosting {

    EntityManager entityManager;

    public WarehousePostingDao(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Boolean create(WarehousePosting posting) {
        entityManager.persist(posting);
        if(posting.getId() != null) {
            return true;
        }
        return false;
    }

    @Override
    public void update(WarehousePosting posting) {
        entityManager.merge(posting);
    }

    @Override
    public void delete(WarehousePosting posting) {
        entityManager.remove(posting);
    }

    @Override
    public boolean existById(Long id) {
        Query query = entityManager
                .createQuery("select count(wp) from WarehousePosting wp where wp.id = :id")
                .setParameter("id", id);
        return (Long) query.getSingleResult() == 1;
    }

    @Override
    public Optional<WarehousePosting> findById(Long id) {
        Query query = entityManager
                .createQuery("select wp from WarehousePosting wp where wp.id = :id")
                .setParameter("id", id);
        WarehousePosting warehousePosting = (WarehousePosting) query.getSingleResult();
        return Optional.ofNullable(warehousePosting);
    }

    @Override
    public List<WarehousePosting> findAll() {
        List<WarehousePosting> warehousePostings = (List<WarehousePosting>) entityManager
                .createQuery("select wp from WarehousePosting wp")
                .getResultList();
        return warehousePostings;
    }

    @Override
    public Long count() {
        return (Long) entityManager
                .createQuery("select count(wp) from WarehousePosting wp")
                .getSingleResult();
    }

    public List<RelocatableProduct> getRelocatableProductsFromPosting(WarehousePosting posting) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<RelocatableProduct> relocatableProductCriteria = cb.createQuery(RelocatableProduct.class);
        Root<WarehousePosting> postingRoot = relocatableProductCriteria.from(WarehousePosting.class);
        SetJoin<WarehousePosting, RelocatableProduct> relocatableProductsJoin =
                postingRoot.join(WarehousePosting_.relocatableProducts);

        Predicate likePostingId =
                cb.like(postingRoot.get(WarehousePosting_.id).as(String.class), posting.getId().toString());

        relocatableProductCriteria
                .select(relocatableProductsJoin)
                .where(likePostingId);

        List<RelocatableProduct> resultList = entityManager
                .createQuery(relocatableProductCriteria)
                .getResultList();

        return resultList;
    }

}
