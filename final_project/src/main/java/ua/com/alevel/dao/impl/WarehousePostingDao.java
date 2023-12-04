package ua.com.alevel.dao.impl;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ua.com.alevel.dao.DaoWarehousePosting;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.entities.*;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.criteria.*;
import javax.persistence.criteria.Order;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        if (posting.getId() != null) {
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

    public List<WarehousePosting> findAllFromRequest(PageDataRequest request) {
        int limitAmount = request.getNumberOfElementsOnPage();
        int limitFrom = (request.getPageNumber() - 1) * limitAmount;
        String sortBy = request.getSortBy();
        Boolean isSortAsc = request.getIsSortAsc();
        String search = "%" + request.getSearchString() + "%";

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<WarehousePosting> postingCriteria = cb.createQuery(WarehousePosting.class);
        Root<WarehousePosting> postingRoot = postingCriteria.from(WarehousePosting.class);

        Join<WarehousePosting, Client> supplierJoin = postingRoot.join(WarehousePosting_.supplier, JoinType.LEFT);
        Join<WarehousePosting, Employee> employeeJoin = postingRoot.join(WarehousePosting_.employee, JoinType.LEFT);
        Join<WarehousePosting, Payment> paymentJoin = postingRoot.join(WarehousePosting_.payment, JoinType.LEFT);

        Predicate searchPredicate = createSearchPredicate(search, cb, postingRoot, supplierJoin, employeeJoin, paymentJoin);
        Order order = cb.asc(postingRoot.get("id"));

        if (sortBy.equals(WarehousePosting_.ID)
                || sortBy.equals(WarehousePosting_.DATE_TIME) || sortBy.equals(WarehousePosting_.DESCRIPTION)
                || sortBy.equals(WarehousePosting_.PAYMENT)) {
            if (isSortAsc) {
                order = cb.asc(postingRoot.get(sortBy));
            } else {
                order = cb.desc(postingRoot.get(sortBy));
            }
        } else if (sortBy.equals(WarehousePosting_.SUPPLIER)) {
            if (isSortAsc) {
                order = cb.asc(supplierJoin.get(Client_.name));
            } else {
                order = cb.desc(supplierJoin.get(Client_.name));
            }
        }

        postingCriteria
                .select(postingRoot)
                .where(searchPredicate)
                .orderBy(order);

        List<WarehousePosting> resultList = entityManager.createQuery(postingCriteria)
                .setFirstResult(limitFrom)
                .setMaxResults(limitAmount)
                .getResultList();

        return resultList;
    }

    public Long countNumberOfSearchMatches(PageDataRequest request) {
        String search = "%" + request.getSearchString() + "%";

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> longCriteria = cb.createQuery(Long.class);
        Root<WarehousePosting> postingRoot = longCriteria.from(WarehousePosting.class);

        Join<WarehousePosting, Client> supplierJoin = postingRoot.join(WarehousePosting_.supplier, JoinType.LEFT);
        Join<WarehousePosting, Employee> employeeJoin = postingRoot.join(WarehousePosting_.employee, JoinType.LEFT);
        Join<WarehousePosting, Payment> paymentJoin = postingRoot.join(WarehousePosting_.payment, JoinType.LEFT);

        Predicate searchPredicate = createSearchPredicate(search, cb, postingRoot, supplierJoin, employeeJoin, paymentJoin);

        longCriteria
                .select(cb.count(postingRoot))
                .where(searchPredicate);

        Long count = entityManager.createQuery(longCriteria)
                .getSingleResult();

        return count;
    }

    private Predicate createSearchPredicate(String search, CriteriaBuilder cb, Root<WarehousePosting> postingRoot,
                                            Join<WarehousePosting, Client> clientJoin, Join<WarehousePosting, Employee> employeeJoin,
                                            Join<WarehousePosting, Payment> paymentJoin
    ) {
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.like(postingRoot.get(WarehousePosting_.id).as(String.class), search));
        predicates.add(cb.like(clientJoin.get(Client_.name).as(String.class), search));
        predicates.add(cb.like(employeeJoin.get(Employee_.name).as(String.class), search));
        predicates.add(cb.like(postingRoot.get(WarehousePosting_.dateTime).as(String.class), search));
        predicates.add(cb.like(postingRoot.get(WarehousePosting_.description).as(String.class), search));
        predicates.add(cb.like(paymentJoin.get(Payment_.amount).as(String.class), search));
        return cb.or(predicates.toArray(Predicate[]::new));
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
