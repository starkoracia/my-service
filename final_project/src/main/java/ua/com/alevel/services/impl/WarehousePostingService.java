package ua.com.alevel.services.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.dao.impl.WarehousePostingDao;
import ua.com.alevel.entities.WarehousePosting;
import ua.com.alevel.services.ServiceWarehousePosting;

import java.util.List;
import java.util.Optional;

@Service
public class WarehousePostingService implements ServiceWarehousePosting {

    WarehousePostingDao postingDao;

    public WarehousePostingService(WarehousePostingDao postingDao) {
        this.postingDao = postingDao;
    }

    @Override
    public Boolean create(WarehousePosting posting) {
        return postingDao.create(posting);
    }

    @Override
    public void update(WarehousePosting posting) {
        postingDao.update(posting);
    }

    @Override
    public void delete(WarehousePosting posting) {
        postingDao.delete(posting);
    }

    @Override
    public boolean existById(Long id) {
        return postingDao.existById(id);
    }

    @Override
    public Optional<WarehousePosting> findById(Long id) {
        return postingDao.findById(id);
    }

    @Override
    public List<WarehousePosting> findAll() {
        return postingDao.findAll();
    }

    @Override
    public Long count() {
        return postingDao.count();
    }

}
