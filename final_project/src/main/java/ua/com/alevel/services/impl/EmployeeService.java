package ua.com.alevel.services.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ua.com.alevel.dao.impl.EmployeeDao;
import ua.com.alevel.entities.Employee;
import ua.com.alevel.services.ServiceEmployee;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService implements ServiceEmployee {

    EmployeeDao employeeDao;
    private Logger infoLogger = LoggerFactory.getLogger("info");

    public EmployeeService(EmployeeDao employeeDao) {
        this.employeeDao = employeeDao;
    }

    @Override
    public Boolean create(Employee employee) {
        Boolean isCreated = employeeDao.create(employee);
        infoLogger.info("Employee is created: {}", employee);
        return isCreated;
    }

    @Override
    public void update(Employee employee) {
        employeeDao.update(employee);
        infoLogger.info("Employee is updated: {}", employee);
    }

    @Override
    public void delete(Employee employee) {
        employeeDao.delete(employee);
        infoLogger.info("Employee is deleted: {}", employee);
    }

    @Override
    public boolean existById(Long id) {
        return employeeDao.existById(id);
    }

    @Override
    public Optional<Employee> findById(Long id) {
        return employeeDao.findById(id);
    }

    @Override
    public List<Employee> findAll() {
        return employeeDao.findAll();
    }

    @Override
    public Long count() {
        return employeeDao.count();
    }

}
