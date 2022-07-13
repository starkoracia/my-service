package ua.com.alevel.services.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.dao.impl.ProductMaterialDao;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.ProductMaterialDto;
import ua.com.alevel.entities.ProductMaterial;
import ua.com.alevel.services.ServiceProductMaterial;

import java.util.List;
import java.util.Optional;

@Service
public class ProductMaterialService implements ServiceProductMaterial {

    ProductMaterialDao productDao;

    public ProductMaterialService(ProductMaterialDao productDao) {
        this.productDao = productDao;
    }

    @Override
    public Boolean create(ProductMaterial product) {
        return productDao.create(product);
    }

    @Override
    public void update(ProductMaterial product) {
        productDao.update(product);
    }

    @Override
    public void delete(ProductMaterial product) {
        productDao.delete(product);
    }

    @Override
    public boolean existById(Long id) {
        return productDao.existById(id);
    }

    @Override
    public Optional<ProductMaterial> findById(Long id) {
        return productDao.findById(id);
    }

    @Override
    public List<ProductMaterial> findAll() {
        return productDao.findAll();
    }

    public PageDataResponse<ProductMaterialDto> findAllFromRequest(PageDataRequest request) {
        List<ProductMaterial> productMaterials = productDao.findAllFromRequest(request);
        PageDataResponse<ProductMaterialDto> dataResponse = new PageDataResponse<>();
        dataResponse.setDtoEntities(ProductMaterialDto.toDtoList(productMaterials));
        if (request.getSearchString().equals("")) {
            dataResponse.setAmountOfElements(count().intValue());
        } else {
            dataResponse.setAmountOfElements(countNumberOfSearchMatches(request).intValue());
        }
        return dataResponse;
    }

    @Override
    public Long count() {
        return productDao.count();
    }

    public Long countNumberOfSearchMatches(PageDataRequest request) {
        return productDao.countNumberOfSearchMatches(request);
    }

    public ProductMaterialDto getLastCreatedProduct() {
        return ProductMaterialDto.toDto(productDao.getLastCreatedProduct());
    }

}
