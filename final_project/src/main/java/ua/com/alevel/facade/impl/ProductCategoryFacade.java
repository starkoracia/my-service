package ua.com.alevel.facade.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.ProductCategoryDto;
import ua.com.alevel.entities.ProductCategory;
import ua.com.alevel.facade.FacadeProductCategory;
import ua.com.alevel.services.impl.ProductCategoryService;

import java.util.List;
import java.util.Optional;

@Service
public class ProductCategoryFacade implements FacadeProductCategory {

    ProductCategoryService productCategoryService;

    public ProductCategoryFacade(ProductCategoryService productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    @Override
    public Boolean create(ProductCategoryDto dto) {
        return productCategoryService.create(dto.toProductCategory());
    }

    @Override
    public void update(ProductCategoryDto dto) {
        productCategoryService.update(dto.toProductCategory());
    }

    @Override
    public void delete(ProductCategoryDto dto) {
        productCategoryService.delete(dto.toProductCategory());
    }

    @Override
    public boolean existById(Long id) {
        return productCategoryService.existById(id);
    }

    @Override
    public Optional<ProductCategoryDto> findById(Long id) {
        ProductCategory category = productCategoryService.findById(id).get();
        return Optional.ofNullable(ProductCategoryDto.toDto(category));
    }

    @Override
    public List<ProductCategoryDto> findAll() {
        return ProductCategoryDto.toDtoList(productCategoryService.findAll());
    }

    @Override
    public PageDataResponse<ProductCategoryDto> findAllFromRequest(PageDataRequest request) {
        return null;
    }

    @Override
    public Long countNumberOfSearchMatches(PageDataRequest request) {
        return null;
    }

    @Override
    public Long count() {
        return productCategoryService.count();
    }

    public ProductCategoryDto getLastCreatedCategory() {
        return ProductCategoryDto.toDto(productCategoryService.getLastCreatedCategory());
    }

}
