package ua.com.alevel.dao.impl;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ua.com.alevel.dao.DaoWarehouseWriteOff;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.entities.Order;
import ua.com.alevel.entities.*;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class WarehouseWriteOffDao implements DaoWarehouseWriteOff {

    EntityManager entityManager;

    public WarehouseWriteOffDao(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Boolean create(WarehouseWriteOff writeOff) {
        entityManager.persist(writeOff);
        if (writeOff.getId() != null) {
            return true;
        }
        return false;
    }

    @Override
    public void update(WarehouseWriteOff writeOff) {
        entityManager.merge(writeOff);
    }

    @Override
    public void delete(WarehouseWriteOff writeOff) {
        entityManager.remove(writeOff);
    }

    @Override
    public boolean existById(Long id) {
        Query query = entityManager
                .createQuery("select count(wo) from WarehouseWriteOff wo where wo.id = :id")
                .setParameter("id", id);
        return (Long) query.getSingleResult() == 1;
    }

    @Override
    public Optional<WarehouseWriteOff> findById(Long id) {
        Query query = entityManager
                .createQuery("select wo from WarehouseWriteOff wo where wo.id = :id")
                .setParameter("id", id);
        WarehouseWriteOff writeOff = (WarehouseWriteOff) query.getSingleResult();
        return Optional.ofNullable(writeOff);
    }

    @Override
    public List<WarehouseWriteOff> findAll() {
        List<WarehouseWriteOff> writeOffList = (List<WarehouseWriteOff>) entityManager
                .createQuery("select wo from WarehouseWriteOff wo")
                .getResultList();
        return writeOffList;
    }

    public List<WarehouseWriteOff> findAllFromRequest(PageDataRequest request) {
        int limitAmount = request.getNumberOfElementsOnPage();
        int limitFrom = (request.getPageNumber() - 1) * limitAmount;
        String sortBy = request.getSortBy();
        Boolean isSortAsc = request.getIsSortAsc();
        String search = "%" + request.getSearchString() + "%";

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<WarehouseWriteOff> writeOffCriteria = cb.createQuery(WarehouseWriteOff.class);
        Root<WarehouseWriteOff> writeOffRoot = writeOffCriteria.from(WarehouseWriteOff.class);

        Join<WarehouseWriteOff, Client> clientJoin = writeOffRoot.join(WarehouseWriteOff_.client, JoinType.LEFT);
        Join<WarehouseWriteOff, Employee> employeeJoin = writeOffRoot.join(WarehouseWriteOff_.employee, JoinType.LEFT);
        Join<WarehouseWriteOff, Order> orderJoin = writeOffRoot.join(WarehouseWriteOff_.order, JoinType.LEFT);
        Join<WarehouseWriteOff, Payment> paymentJoin = writeOffRoot.join(WarehouseWriteOff_.payment, JoinType.LEFT);

        Predicate searchPredicate = createSearchPredicate(search, cb, writeOffRoot, clientJoin, employeeJoin, orderJoin, paymentJoin);
        javax.persistence.criteria.Order order = cb.asc(writeOffRoot.get("id"));

        if (sortBy.equals(WarehouseWriteOff_.ID)
                || sortBy.equals(WarehouseWriteOff_.DATE_TIME) || sortBy.equals(WarehouseWriteOff_.DESCRIPTION)
                || sortBy.equals(WarehouseWriteOff_.PAYMENT)) {
            if (isSortAsc) {
                order = cb.asc(writeOffRoot.get(sortBy));
            } else {
                order = cb.desc(writeOffRoot.get(sortBy));
            }
        } else if (sortBy.equals(WarehouseWriteOff_.CLIENT)) {
            if (isSortAsc) {
                order = cb.asc(clientJoin.get(Client_.name));
            } else {
                order = cb.desc(clientJoin.get(Client_.name));
            }
        } else if (sortBy.equals(WarehouseWriteOff_.ORDER)) {
            if (isSortAsc) {
                order = cb.asc(orderJoin.get(Order_.id));
            } else {
                order = cb.desc(orderJoin.get(Order_.id));
            }
        }

        writeOffCriteria
                .select(writeOffRoot)
                .where(searchPredicate)
                .orderBy(order);

        List<WarehouseWriteOff> resultList = entityManager.createQuery(writeOffCriteria)
                .setFirstResult(limitFrom)
                .setMaxResults(limitAmount)
                .getResultList();

        return resultList;
    }

    public Long countNumberOfSearchMatches(PageDataRequest request) {
        String search = "%" + request.getSearchString() + "%";

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> longCriteria = cb.createQuery(Long.class);
        Root<WarehouseWriteOff> writeOffRoot = longCriteria.from(WarehouseWriteOff.class);

        Join<WarehouseWriteOff, Client> clientJoin = writeOffRoot.join(WarehouseWriteOff_.client, JoinType.LEFT);
        Join<WarehouseWriteOff, Employee> employeeJoin = writeOffRoot.join(WarehouseWriteOff_.employee);
        Join<WarehouseWriteOff, Order> orderJoin = writeOffRoot.join(WarehouseWriteOff_.order, JoinType.LEFT);
        Join<WarehouseWriteOff, Payment> paymentJoin = writeOffRoot.join(WarehouseWriteOff_.payment, JoinType.LEFT);

        Predicate searchPredicate = createSearchPredicate(search, cb, writeOffRoot, clientJoin, employeeJoin, orderJoin, paymentJoin);

        longCriteria
                .select(cb.count(writeOffRoot))
                .where(searchPredicate);

        Long count = entityManager.createQuery(longCriteria)
                .getSingleResult();

        return count;
    }

    private Predicate createSearchPredicate(String search, CriteriaBuilder cb, Root<WarehouseWriteOff> writeOffRoot,
                                            Join<WarehouseWriteOff, Client> clientJoin, Join<WarehouseWriteOff, Employee> employeeJoin,
                                            Join<WarehouseWriteOff, Order> orderJoin, Join<WarehouseWriteOff, Payment> paymentJoin
    ) {
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.like(writeOffRoot.get(WarehouseWriteOff_.id).as(String.class), search));
        predicates.add(cb.like(clientJoin.get(Client_.name).as(String.class), search));
        predicates.add(cb.like(employeeJoin.get(Employee_.name).as(String.class), search));
        predicates.add(cb.like(writeOffRoot.get(WarehouseWriteOff_.dateTime).as(String.class), search));
        predicates.add(cb.like(writeOffRoot.get(WarehouseWriteOff_.description).as(String.class), search));
        predicates.add(cb.like(orderJoin.get(Order_.id).as(String.class), search));
        predicates.add(cb.like(paymentJoin.get(Payment_.amount).as(String.class), search));
        return cb.or(predicates.toArray(Predicate[]::new));
    }

    @Override
    public Long count() {
        return (Long) entityManager
                .createQuery("select count(wo) from WarehouseWriteOff wo")
                .getSingleResult();
    }

    public List<RelocatableProduct> getRelocatableProductsFromWriteOff(WarehouseWriteOff writeOff) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<RelocatableProduct> relocatableProductCriteria = cb.createQuery(RelocatableProduct.class);
        Root<WarehouseWriteOff> writeOffRoot = relocatableProductCriteria.from(WarehouseWriteOff.class);
        SetJoin<WarehouseWriteOff, RelocatableProduct> relocatableProductsJoin =
                writeOffRoot.join(WarehouseWriteOff_.relocatableProducts);

        Predicate likeWriteOffId = cb.like(writeOffRoot.get(WarehouseWriteOff_.id).as(String.class), writeOff.getId().toString());

        relocatableProductCriteria
                .select(relocatableProductsJoin)
                .where(likeWriteOffId);

        List<RelocatableProduct> resultList = entityManager
                .createQuery(relocatableProductCriteria)
                .getResultList();

        return resultList;
    }

}
