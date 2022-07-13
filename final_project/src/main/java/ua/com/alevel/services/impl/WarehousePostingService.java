package ua.com.alevel.services.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.dao.impl.ProductMaterialDao;
import ua.com.alevel.dao.impl.RelocatableProductDao;
import ua.com.alevel.dao.impl.WarehousePostingDao;
import ua.com.alevel.dto.entities.RelocatableProductDto;
import ua.com.alevel.entities.ProductMaterial;
import ua.com.alevel.entities.RelocatableProduct;
import ua.com.alevel.entities.WarehousePosting;
import ua.com.alevel.services.ServiceWarehousePosting;

import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class WarehousePostingService implements ServiceWarehousePosting {

    WarehousePostingDao postingDao;
    RelocatableProductDao relocatableProductDao;
    ProductMaterialDao productMaterialDao;

    public WarehousePostingService(WarehousePostingDao postingDao, RelocatableProductDao relocatableProductDao, ProductMaterialDao productMaterialDao) {
        this.postingDao = postingDao;
        this.relocatableProductDao = relocatableProductDao;
        this.productMaterialDao = productMaterialDao;
    }

    @Override
    public Boolean create(WarehousePosting posting) {
        Set<RelocatableProduct> relocatableProducts = posting.getRelocatableProducts();
        relocatableProducts.forEach(relocatableProduct -> {
            relocatableProductDao.create(relocatableProduct);
            setNewNumberOfProduct(relocatableProduct);
        });
        posting.setDateTime(Calendar.getInstance());

        return postingDao.create(posting);
    }

    private void setNewNumberOfProduct(RelocatableProduct relocatableProduct) {
        ProductMaterial productMaterial = relocatableProduct.getProductMaterial();
        int newNumberOf = productMaterial.getNumberOf() + relocatableProduct.getNumberOf();
        productMaterial.setNumberOf(newNumberOf);
        productMaterial.setInStock(newNumberOf > 0);
        productMaterialDao.update(productMaterial);
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

    public List<RelocatableProductDto> getRelocatableProductsFromPosting(WarehousePosting posting) {
        List<RelocatableProduct> relocatableProducts = postingDao.getRelocatableProductsFromPosting(posting);
        return RelocatableProductDto.toDtoList(relocatableProducts);
    }

}
