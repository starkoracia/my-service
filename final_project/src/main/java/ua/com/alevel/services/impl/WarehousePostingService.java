package ua.com.alevel.services.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ua.com.alevel.dao.impl.ProductMaterialDao;
import ua.com.alevel.dao.impl.RelocatableProductDao;
import ua.com.alevel.dao.impl.WarehousePostingDao;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.RelocatableProductDto;
import ua.com.alevel.dto.entities.WarehousePostingDto;
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
    private Logger infoLogger = LoggerFactory.getLogger("info");

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

        Boolean isCreated = postingDao.create(posting);
        infoLogger.info("Posting is created: {}", posting);
        return isCreated;
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
        infoLogger.info("Posting is updated: {}", posting);
    }

    @Override
    public void delete(WarehousePosting posting) {
        postingDao.delete(posting);
        infoLogger.info("Posting is deleted: {}", posting);
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

    public PageDataResponse<WarehousePostingDto> findAllFromRequest(PageDataRequest request) {
        List<WarehousePosting> postings = postingDao.findAllFromRequest(request);
        PageDataResponse<WarehousePostingDto> dataResponse = new PageDataResponse<>();
        dataResponse.setDtoEntities(WarehousePostingDto.toDtoList(postings));
        if (request.getSearchString().equals("")) {
            dataResponse.setAmountOfElements(count().intValue());
        } else {
            dataResponse.setAmountOfElements(countNumberOfSearchMatches(request).intValue());
        }
        return dataResponse;
    }

    public Long countNumberOfSearchMatches(PageDataRequest request) {
        return postingDao.countNumberOfSearchMatches(request);
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
