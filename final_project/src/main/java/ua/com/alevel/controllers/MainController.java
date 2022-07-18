package ua.com.alevel.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.alevel.dto.entities.EmployeeDto;
import ua.com.alevel.facade.impl.EmployeeFacade;
import ua.com.alevel.services.impl.AuthRoleService;
import ua.com.alevel.services.impl.AuthUserService;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins = "${cross.origin.url}")
public class MainController {

    EmployeeFacade employeeFacade;

    public MainController(EmployeeFacade employeeFacade, AuthRoleService roleService, AuthUserService userService) {
        this.employeeFacade = employeeFacade;
    }

    @GetMapping("/test")
    public String test() {
        return "test";
    }

    @GetMapping("/employees")
    public List<EmployeeDto> employees() {
        return employeeFacade.findAll();
    }

}
