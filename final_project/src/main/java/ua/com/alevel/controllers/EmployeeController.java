package ua.com.alevel.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.alevel.dto.entities.EmployeeDto;
import ua.com.alevel.facade.impl.EmployeeFacade;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins = "${cross.origin.url}")
public class EmployeeController {

    EmployeeFacade employeeFacade;

    public EmployeeController(EmployeeFacade employeeFacade) {
        this.employeeFacade = employeeFacade;
    }

    @GetMapping("/employees")
    public List<EmployeeDto> employees() {
        return employeeFacade.findAll();
    }

}
