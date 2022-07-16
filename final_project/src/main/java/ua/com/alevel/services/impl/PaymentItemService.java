package ua.com.alevel.services.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ua.com.alevel.dao.impl.PaymentItemDao;
import ua.com.alevel.entities.PaymentItem;
import ua.com.alevel.services.ServicePaymentItem;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentItemService implements ServicePaymentItem {

    PaymentItemDao itemDao;
    private Logger infoLogger = LoggerFactory.getLogger("info");

    public PaymentItemService(PaymentItemDao itemDao) {
        this.itemDao = itemDao;
    }

    @Override
    public Boolean create(PaymentItem item) {
        Boolean isCreated = itemDao.create(item);
        infoLogger.info("PaymentItem is created: {}", item);
        return isCreated;
    }

    @Override
    public void update(PaymentItem item) {
        itemDao.update(item);
        infoLogger.info("PaymentItem is updated: {}", item);
    }

    @Override
    public void delete(PaymentItem item) {
        itemDao.delete(item);
        infoLogger.info("PaymentItem is deleted: {}", item);
    }

    @Override
    public boolean existById(Long id) {
        return itemDao.existById(id);
    }

    @Override
    public Optional<PaymentItem> findById(Long id) {
        return itemDao.findById(id);
    }

    @Override
    public List<PaymentItem> findAll() {
        return itemDao.findAll();
    }

    @Override
    public Long count() {
        return itemDao.count();
    }

    public PaymentItem getLastCreatedItem() {
        return itemDao.getLastCreatedItem();
    }

}
