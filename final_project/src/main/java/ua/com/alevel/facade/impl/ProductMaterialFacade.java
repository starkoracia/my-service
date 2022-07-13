package ua.com.alevel.facade.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.ProductMaterialDto;
import ua.com.alevel.entities.ProductMaterial;
import ua.com.alevel.facade.FacadeProductMaterial;
import ua.com.alevel.services.impl.ProductMaterialService;

import java.util.List;
import java.util.Optional;

@Service
public class ProductMaterialFacade implements FacadeProductMaterial {

    ProductMaterialService productService;

    public ProductMaterialFacade(ProductMaterialService productService) {
        this.productService = productService;
    }

    @Override
    public Boolean create(ProductMaterialDto dto) {
        dto.setNumberOf(0);
        dto.setInStock(false);
        return productService.create(dto.toProductMaterial());
    }

    @Override
    public void update(ProductMaterialDto dto) {
        productService.update(dto.toProductMaterial());
    }

    @Override
    public void delete(ProductMaterialDto dto) {
        productService.delete(dto.toProductMaterial());
    }

    @Override
    public boolean existById(Long id) {
        return productService.existById(id);
    }

    @Override
    public Optional<ProductMaterialDto> findById(Long id) {
        ProductMaterial product = productService.findById(id).get();
        return Optional.ofNullable(ProductMaterialDto.toDto(product));
    }

    @Override
    public List<ProductMaterialDto> findAll() {
        return ProductMaterialDto.toDtoList(productService.findAll());
    }

    @Override
    public PageDataResponse<ProductMaterialDto> findAllFromRequest(PageDataRequest request) {
        return productService.findAllFromRequest(request);
    }

    @Override
    public Long countNumberOfSearchMatches(PageDataRequest request) {
        return productService.countNumberOfSearchMatches(request);
    }

    @Override
    public Long count() {
        return productService.count();
    }

    public ProductMaterialDto getLastCreatedProduct() {
        return productService.getLastCreatedProduct();
    }

}
