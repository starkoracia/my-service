package ua.com.alevel.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.alevel.dto.entities.EmployeeDto;
import ua.com.alevel.facade.impl.*;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins = "${cross.origin.url}")
public class MainController {

    EmployeeFacade employeeFacade;
    WarehousePostingFacade postingFacade;
    WarehouseWriteOffFacade writeOffFacade;
    ProductMaterialFacade productMaterialFacade;
    RelocatableProductFacade relocatableProductFacade;
    PaymentFacade paymentFacade;

    public MainController(EmployeeFacade employeeFacade, WarehousePostingFacade postingFacade, WarehouseWriteOffFacade writeOffFacade, ProductMaterialFacade productMaterialFacade, RelocatableProductFacade relocatableProductFacade, PaymentFacade paymentFacade) {
        this.employeeFacade = employeeFacade;
        this.postingFacade = postingFacade;
        this.writeOffFacade = writeOffFacade;
        this.productMaterialFacade = productMaterialFacade;
        this.relocatableProductFacade = relocatableProductFacade;
        this.paymentFacade = paymentFacade;
    }

    @GetMapping("/relocatable")
    public String relocatableProductsTest() {
        return "www";
    }

    @GetMapping("/employees")
    public List<EmployeeDto> employees() {
        return employeeFacade.findAll();
    }


}
