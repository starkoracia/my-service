package ua.com.alevel.services.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.dao.impl.ProductMaterialDao;
import ua.com.alevel.dao.impl.RelocatableProductDao;
import ua.com.alevel.dao.impl.WarehouseWriteOffDao;
import ua.com.alevel.entities.ProductMaterial;
import ua.com.alevel.entities.RelocatableProduct;
import ua.com.alevel.entities.WarehouseWriteOff;
import ua.com.alevel.services.ServiceWarehouseWriteOff;

import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class WarehouseWriteOffService implements ServiceWarehouseWriteOff {

    WarehouseWriteOffDao writeOffDao;
    RelocatableProductDao relocatableProductDao;
    ProductMaterialDao productMaterialDao;

    public WarehouseWriteOffService(WarehouseWriteOffDao writeOffDao, RelocatableProductDao relocatableProductDao, ProductMaterialDao productMaterialDao) {
        this.writeOffDao = writeOffDao;
        this.relocatableProductDao = relocatableProductDao;
        this.productMaterialDao = productMaterialDao;
    }

    @Override
    public Boolean create(WarehouseWriteOff writeOff) {
        Set<RelocatableProduct> relocatableProducts = writeOff.getRelocatableProducts();
        relocatableProducts.forEach(relocatableProduct -> {
            relocatableProductDao.create(relocatableProduct);
            setNewNumberOfProduct(relocatableProduct);
        });
        writeOff.setDateTime(Calendar.getInstance());

        return writeOffDao.create(writeOff);
    }

    private void setNewNumberOfProduct(RelocatableProduct relocatableProduct) {
        ProductMaterial productMaterial = relocatableProduct.getProductMaterial();
        int newNumberOf = productMaterial.getNumberOf() - relocatableProduct.getNumberOf();
        productMaterial.setNumberOf(newNumberOf);
        productMaterial.setInStock(newNumberOf > 0);
        productMaterialDao.update(productMaterial);
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

    public List<RelocatableProduct> getRelocatableProductsFromWriteOff(WarehouseWriteOff writeOff) {
        return writeOffDao.getRelocatableProductsFromWriteOff(writeOff);
    }

}
