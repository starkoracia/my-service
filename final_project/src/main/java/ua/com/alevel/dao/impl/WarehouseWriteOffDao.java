package ua.com.alevel.dao.impl;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ua.com.alevel.dao.DaoWarehouseWriteOff;
import ua.com.alevel.entities.RelocatableProduct;
import ua.com.alevel.entities.WarehouseWriteOff;
import ua.com.alevel.entities.WarehouseWriteOff_;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.criteria.*;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class WarehouseWriteOffDao  implements DaoWarehouseWriteOff {

    EntityManager entityManager;

    public WarehouseWriteOffDao(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Boolean create(WarehouseWriteOff writeOff) {
        entityManager.persist(writeOff);
        if(writeOff.getId() != null) {
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
