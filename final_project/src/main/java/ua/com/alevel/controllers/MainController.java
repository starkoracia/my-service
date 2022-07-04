package ua.com.alevel.controllers;

import org.springframework.web.bind.annotation.*;
import ua.com.alevel.dao.impl.RelocatableProductDao;
import ua.com.alevel.dao.impl.WarehouseWriteOffDao;
import ua.com.alevel.dto.entities.*;
import ua.com.alevel.entities.ProductMaterial;
import ua.com.alevel.entities.RelocatableProduct;
import ua.com.alevel.facade.impl.*;

import java.util.Calendar;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:3000")
public class MainController {

    EmployeeFacade employeeFacade;
    WarehousePostingFacade postingFacade;
    WarehouseWriteOffFacade writeOffFacade;
    WarehouseWriteOffDao warehouseWriteOffDao;
    RelocatableProductDao relocatableProductDao;
    ProductMaterialFacade productMaterialFacade;

    public MainController(EmployeeFacade employeeFacade, WarehousePostingFacade postingFacade, WarehouseWriteOffFacade writeOffFacade, WarehouseWriteOffDao warehouseWriteOffDao, RelocatableProductDao relocatableProductDao, ProductMaterialFacade productMaterialFacade) {
        this.employeeFacade = employeeFacade;
        this.postingFacade = postingFacade;
        this.writeOffFacade = writeOffFacade;
        this.warehouseWriteOffDao = warehouseWriteOffDao;
        this.relocatableProductDao = relocatableProductDao;
        this.productMaterialFacade = productMaterialFacade;
    }

    @GetMapping("/relocatable")
    public String relocatableProductsTest() {
        ProductMaterial productMaterial = productMaterialFacade.findById(1L).get().toProductMaterial();
        ProductMaterial productMaterial2 = productMaterialFacade.findById(2L).get().toProductMaterial();

        RelocatableProduct relocatableProduct = new RelocatableProduct();
        relocatableProduct.setProductMaterial(productMaterial);
        relocatableProduct.setNumberOf(11);

        RelocatableProduct relocatableProduct2 = new RelocatableProduct();
        relocatableProduct2.setProductMaterial(productMaterial2);
        relocatableProduct2.setNumberOf(22);

        relocatableProductDao.create(relocatableProduct);
        relocatableProductDao.create(relocatableProduct2);
        Set<RelocatableProductDto> relocatableProducts = Set.of(
                RelocatableProductDto.toDto(relocatableProduct),
                RelocatableProductDto.toDto(relocatableProduct2));

        WarehouseWriteOffDto writeOffDto = new WarehouseWriteOffDto();
        writeOffDto.setRelocatableProducts(relocatableProducts);
        writeOffDto.setDateTime(Calendar.getInstance());
        writeOffDto.setDescription("");
        writeOffDto.setEmployee(employeeFacade.findById(1L).get());

        Boolean isWrOffCreated = writeOffFacade.create(writeOffDto);
        List<RelocatableProduct> relocatableProductsFromWriteOff =
                warehouseWriteOffDao.getRelocatableProductsFromWriteOff(writeOffDto.toWriteOff());

        return relocatableProductsFromWriteOff.toString();
    }

    @GetMapping("/employees")
    public List<EmployeeDto> employees() {
        return employeeFacade.findAll();
    }

    @GetMapping("/postings")
    public List<WarehousePostingDto> postings() {
        return postingFacade.findAll();
    }

    @GetMapping("/write_offs")
    public List<WarehouseWriteOffDto> writeOffs() {
        return writeOffFacade.findAll();
    }


}
