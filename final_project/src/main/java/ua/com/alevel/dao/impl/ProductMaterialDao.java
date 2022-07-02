package ua.com.alevel.dao.impl;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ua.com.alevel.dao.DaoProductMaterial;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.entities.ProductMaterial;
import ua.com.alevel.entities.ProductMaterial_;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class ProductMaterialDao implements DaoProductMaterial {

    EntityManager entityManager;

    public ProductMaterialDao(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Boolean create(ProductMaterial productMaterial) {
        entityManager.persist(productMaterial);
        if (productMaterial.getId() != null) {
            return true;
        }
        return false;
    }

    @Override
    public void update(ProductMaterial productMaterial) {
        System.out.println(productMaterial);
        entityManager.merge(productMaterial);
    }

    @Override
    public void delete(ProductMaterial productMaterial) {
        entityManager.remove(productMaterial);
    }

    @Override
    public boolean existById(Long id) {
        Query query = entityManager
                .createQuery("select count(pm) from ProductMaterial pm where pm.id = :id")
                .setParameter("id", id);
        return (Long) query.getSingleResult() == 1;
    }

    @Override
    public Optional<ProductMaterial> findById(Long id) {
        Query query = entityManager
                .createQuery("select pm from ProductMaterial pm where pm.id = :id")
                .setParameter("id", id);
        ProductMaterial productMaterial = (ProductMaterial) query.getSingleResult();
        return Optional.ofNullable(productMaterial);
    }

    @Override
    public List<ProductMaterial> findAll() {
        List<ProductMaterial> productMaterialList = (List<ProductMaterial>) entityManager
                .createQuery("select pm from ProductMaterial pm")
                .getResultList();
        return productMaterialList;
    }

    public List<ProductMaterial> findAllFromRequest(PageDataRequest request) {
        int limitAmount = request.getNumberOfElementsOnPage();
        int limitFrom = (request.getPageNumber() - 1) * limitAmount;
        String sortBy = request.getSortBy();
        Boolean isSortAsc = request.getIsSortAsc();
        String search = "%" + request.getSearchString() + "%";

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<ProductMaterial> productCriteria = cb.createQuery(ProductMaterial.class);
        Root<ProductMaterial> productRoot = productCriteria.from(ProductMaterial.class);

        Predicate searchPredicate = createSearchPredicate(search, cb, productRoot);
        Order order = cb.asc(productRoot.get("id"));

        if (sortBy.equals(ProductMaterial_.ID) || sortBy.equals(ProductMaterial_.NAME)
                || sortBy.equals(ProductMaterial_.DESCRIPTION) || sortBy.equals(ProductMaterial_.CODE)
                || sortBy.equals(ProductMaterial_.TRADE_COST) || sortBy.equals(ProductMaterial_.WARRANTY_DAYS)
                || sortBy.equals(ProductMaterial_.NUMBER_OF)) {
            if (isSortAsc) {
                order = cb.asc(productRoot.get(sortBy));
            } else {
                order = cb.desc(productRoot.get(sortBy));
            }
        }

        productCriteria
                .select(productRoot)
                .where(searchPredicate)
                .orderBy(order);

        List<ProductMaterial> productMaterialList = entityManager.createQuery(productCriteria)
                .setFirstResult(limitFrom)
                .setMaxResults(limitAmount)
                .getResultList();

        return productMaterialList;
    }

    private Predicate createSearchPredicate(String search, CriteriaBuilder cb, Root<ProductMaterial> productRoot) {
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.like(productRoot.get(ProductMaterial_.id).as(String.class), search));
        predicates.add(cb.like(productRoot.get(ProductMaterial_.name).as(String.class), search));
        predicates.add(cb.like(productRoot.get(ProductMaterial_.description).as(String.class), search));
        predicates.add(cb.like(productRoot.get(ProductMaterial_.code).as(String.class), search));
        predicates.add(cb.like(productRoot.get(ProductMaterial_.vendorCode).as(String.class), search));
        predicates.add(cb.like(productRoot.get(ProductMaterial_.warrantyDays).as(String.class), search));
        predicates.add(cb.like(productRoot.get(ProductMaterial_.tradeCost).as(String.class), search));
        predicates.add(cb.like(productRoot.get(ProductMaterial_.numberOf).as(String.class), search));
        return cb.or(predicates.toArray(Predicate[]::new));
    }

    public Long countNumberOfSearchMatches(PageDataRequest request) {
        String search = "%" + request.getSearchString() + "%";

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> productCriteria = cb.createQuery(Long.class);
        Root<ProductMaterial> productRoot = productCriteria.from(ProductMaterial.class);

        Predicate searchPredicate = createSearchPredicate(search, cb, productRoot);

        productCriteria
                .select(cb.count(productRoot))
                .where(searchPredicate);

        Long count = entityManager.createQuery(productCriteria)
                .getSingleResult();

        return count;
    }

    @Override
    public Long count() {
        return (Long) entityManager
                .createQuery("select count(pm) from ProductMaterial pm")
                .getSingleResult();
    }

}
