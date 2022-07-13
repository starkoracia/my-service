package ua.com.alevel.facade.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.RelocatableProductDto;
import ua.com.alevel.entities.RelocatableProduct;
import ua.com.alevel.facade.FacadeRelocatableProduct;
import ua.com.alevel.services.impl.RelocatableProductService;

import java.util.List;
import java.util.Optional;

@Service
public class RelocatableProductFacade implements FacadeRelocatableProduct {

    RelocatableProductService relocatableProductService;

    public RelocatableProductFacade(RelocatableProductService relocatableProductService) {
        this.relocatableProductService = relocatableProductService;
    }

    @Override
    public Boolean create(RelocatableProductDto dto) {
        RelocatableProduct relocatableProduct = dto.toRelocatableProduct();
        Boolean isCreated = relocatableProductService.create(relocatableProduct);
        dto.setId(relocatableProduct.getId());
        return isCreated;
    }

    @Override
    public void update(RelocatableProductDto dto) {
        relocatableProductService.update(dto.toRelocatableProduct());
    }

    @Override
    public void delete(RelocatableProductDto dto) {
        relocatableProductService.delete(dto.toRelocatableProduct());
    }

    @Override
    public boolean existById(Long id) {
        return relocatableProductService.existById(id);
    }

    @Override
    public Optional<RelocatableProductDto> findById(Long id) {
        RelocatableProduct relocatableProduct = relocatableProductService.findById(id).get();
        return Optional.ofNullable(RelocatableProductDto.toDto(relocatableProduct));
    }

    @Override
    public List<RelocatableProductDto> findAll() {
        return RelocatableProductDto.toDtoList(relocatableProductService.findAll());
    }

    @Override
    public PageDataResponse<RelocatableProductDto> findAllFromRequest(PageDataRequest request) {
        return null;
    }

    @Override
    public Long countNumberOfSearchMatches(PageDataRequest request) {
        return null;
    }

    @Override
    public Long count() {
        return relocatableProductService.count();
    }

}
