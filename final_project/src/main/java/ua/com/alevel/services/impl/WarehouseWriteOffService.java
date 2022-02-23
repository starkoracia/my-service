package ua.com.alevel.services.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.dao.impl.WarehouseWriteOffDao;
import ua.com.alevel.entities.WarehouseWriteOff;
import ua.com.alevel.services.ServiceWarehouseWriteOff;

import java.util.List;
import java.util.Optional;

@Service
public class WarehouseWriteOffService implements ServiceWarehouseWriteOff {

    WarehouseWriteOffDao writeOffDao;

    public WarehouseWriteOffService(WarehouseWriteOffDao writeOffDao) {
        this.writeOffDao = writeOffDao;
    }

    @Override
    public Boolean create(WarehouseWriteOff writeOff) {
        return writeOffDao.create(writeOff);
    }

    @Override
    public void update(WarehouseWriteOff writeOff) {
        writeOffDao.update(writeOff);
    }

    @Override
    public void delete(WarehouseWriteOff writeOff) {
        writeOffDao.delete(writeOff);
    }

    @Override
    public boolean existById(Long id) {
        return writeOffDao.existById(id);
    }

    @Override
    public Optional<WarehouseWriteOff> findById(Long id) {
        return writeOffDao.findById(id);
    }

    @Override
    public List<WarehouseWriteOff> findAll() {
        return writeOffDao.findAll();
    }

    @Override
    public Long count() {
        return writeOffDao.count();
    }

}
