package ua.com.alevel.services.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ua.com.alevel.dao.impl.RelocatableProductDao;
import ua.com.alevel.entities.RelocatableProduct;
import ua.com.alevel.services.ServiceRelocatableProduct;

import java.util.List;
import java.util.Optional;

@Service
public class RelocatableProductService implements ServiceRelocatableProduct {

    RelocatableProductDao relocatableProductDao;
    Logger infoLogger = LoggerFactory.getLogger("info");

    public RelocatableProductService(RelocatableProductDao relocatableProductDao) {
        this.relocatableProductDao = relocatableProductDao;
    }

    @Override
    public Boolean create(RelocatableProduct relocatableProduct) {
        Boolean isCreated = relocatableProductDao.create(relocatableProduct);
        infoLogger.info("RelocatableProduct is created: {}", relocatableProduct);
        return isCreated;
    }

    @Override
    public void update(RelocatableProduct relocatableProduct) {
        relocatableProductDao.update(relocatableProduct);
        infoLogger.info("RelocatableProduct is updated: {}", relocatableProduct);
    }

    @Override
    public void delete(RelocatableProduct relocatableProduct) {
        relocatableProductDao.delete(relocatableProduct);
        infoLogger.info("RelocatableProduct is deleted: {}", relocatableProduct);
    }

    @Override
    public boolean existById(Long id) {
        return relocatableProductDao.existById(id);
    }

    @Override
    public Optional<RelocatableProduct> findById(Long id) {
        return relocatableProductDao.findById(id);
    }

    @Override
    public List<RelocatableProduct> findAll() {
        return relocatableProductDao.findAll();
    }

    @Override
    public Long count() {
        return relocatableProductDao.count();
    }

}
