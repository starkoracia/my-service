package ua.com.alevel.controllers;

import org.springframework.web.bind.annotation.*;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.*;
import ua.com.alevel.facade.impl.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:3000")
public class MainController {

    EmployeeFacade employeeFacade;
    ProductMaterialFacade productFacade;
    WarehousePostingFacade postingFacade;
    WarehouseWriteOffFacade writeOffFacade;

    public MainController(EmployeeFacade employeeFacade, ProductMaterialFacade productFacade,
                          WarehousePostingFacade postingFacade, WarehouseWriteOffFacade writeOffFacade) {
        this.employeeFacade = employeeFacade;
        this.productFacade = productFacade;
        this.postingFacade = postingFacade;
        this.writeOffFacade = writeOffFacade;
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


}
