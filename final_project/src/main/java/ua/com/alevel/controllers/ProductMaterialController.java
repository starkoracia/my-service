package ua.com.alevel.controllers;

import org.springframework.web.bind.annotation.*;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.ProductCategoryDto;
import ua.com.alevel.dto.entities.ProductMaterialDto;
import ua.com.alevel.facade.impl.ProductCategoryFacade;
import ua.com.alevel.facade.impl.ProductMaterialFacade;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductMaterialController {

    ProductMaterialFacade productFacade;
    ProductCategoryFacade productCategoryFacade;

    public ProductMaterialController(ProductMaterialFacade productFacade, ProductCategoryFacade productCategoryFacade) {
        this.productFacade = productFacade;
        this.productCategoryFacade = productCategoryFacade;
    }

    @GetMapping
    public List<ProductMaterialDto> productMaterials() {
        return productFacade.findAll();
    }

    @PostMapping
    public PageDataResponse<ProductMaterialDto> productMaterialsFromRequest(@RequestBody PageDataRequest request) {
        return productFacade.findAllFromRequest(request);
    }

    @PostMapping("/matches")
    public Long searchMatches(@RequestBody PageDataRequest request) {
        return productFacade.countNumberOfSearchMatches(request);
    }

    @PostMapping("/create")
    public Boolean createProduct(@RequestBody ProductMaterialDto productMaterialDto) {
        return productFacade.create(productMaterialDto);
    }

    @PostMapping("/edit")
    public Boolean editProduct(@RequestBody ProductMaterialDto productMaterialDto) {
        productFacade.update(productMaterialDto);
        return true;
    }

    @GetMapping("/categories")
    public List<ProductCategoryDto> productCategories() {
        return productCategoryFacade.findAll();
    }

    @PostMapping("/categories/create")
    public Boolean createCategory(@RequestBody ProductCategoryDto categoryDto) {
        return productCategoryFacade.create(categoryDto);
    }

    @GetMapping("/categories/last")
    public ProductCategoryDto getLastCategory() {
        return productCategoryFacade.getLastCreatedCategory();
    }

}
