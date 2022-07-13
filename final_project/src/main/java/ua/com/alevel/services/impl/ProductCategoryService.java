package ua.com.alevel.services.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.dao.impl.ProductCategoryDao;
import ua.com.alevel.entities.ProductCategory;
import ua.com.alevel.services.ServiceProductCategory;

import java.util.List;
import java.util.Optional;

@Service
public class ProductCategoryService implements ServiceProductCategory {

    ProductCategoryDao productCategoryDao;

    public ProductCategoryService(ProductCategoryDao productCategoryDao) {
        this.productCategoryDao = productCategoryDao;
    }

    @Override
    public Boolean create(ProductCategory category) {
        return productCategoryDao.create(category);
    }

    @Override
    public void update(ProductCategory category) {
        productCategoryDao.update(category);
    }

    @Override
    public void delete(ProductCategory category) {
        productCategoryDao.delete(category);
    }

    @Override
    public boolean existById(Long id) {
        return productCategoryDao.existById(id);
    }

    @Override
    public Optional<ProductCategory> findById(Long id) {
        return productCategoryDao.findById(id);
    }

    @Override
    public List<ProductCategory> findAll() {
        return productCategoryDao.findAll();
    }

    @Override
    public Long count() {
        return productCategoryDao.count();
    }

    public ProductCategory getLastCreatedCategory() {
        return productCategoryDao.getLastCreatedCategory();
    }
}
