package ua.com.alevel.controllers;

import org.springframework.web.bind.annotation.*;
import ua.com.alevel.dto.entities.*;
import ua.com.alevel.facade.impl.*;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:3000")
public class MainController {

    EmployeeFacade employeeFacade;
    ProductMaterialFacade productFacade;
    WarehousePostingFacade postingFacade;
    WarehouseWriteOffFacade writeOffFacade;
    ProductCategoryFacade productCategoryFacade;

    public MainController(EmployeeFacade employeeFacade, ProductMaterialFacade productFacade, WarehousePostingFacade postingFacade,
                          WarehouseWriteOffFacade writeOffFacade, ProductCategoryFacade productCategoryFacade) {
        this.employeeFacade = employeeFacade;
        this.productFacade = productFacade;
        this.postingFacade = postingFacade;
        this.writeOffFacade = writeOffFacade;
        this.productCategoryFacade = productCategoryFacade;
    }

    @GetMapping("/employees")
    public List<EmployeeDto> employees() {
        return employeeFacade.findAll();
    }

    @GetMapping("/products")
    public List<ProductMaterialDto> products() {
        return productFacade.findAll();
    }

    @GetMapping("/postings")
    public List<WarehousePostingDto> postings() {
        return postingFacade.findAll();
    }

    @GetMapping("/write_offs")
    public List<WarehouseWriteOffDto> writeOffs() {
        return writeOffFacade.findAll();
    }

    @PostMapping("/products/create")
    public Boolean createProduct(@RequestBody ProductMaterialDto productMaterialDto) {
        return productFacade.create(productMaterialDto);
    }

    @GetMapping("/products/categories")
    public List<ProductCategoryDto> productCategories() {
        return productCategoryFacade.findAll();
    }

    @PostMapping("/products/categories/create")
    public Boolean createCategory(@RequestBody ProductCategoryDto categoryDto) {
        return productCategoryFacade.create(categoryDto);
    }

    @GetMapping("/products/categories/last")
    public ProductCategoryDto getLastCategory() {
        return productCategoryFacade.getLastCreatedCategory();
    }

}
