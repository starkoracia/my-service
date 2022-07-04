package ua.com.alevel.facade.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.WarehousePostingDto;
import ua.com.alevel.entities.WarehousePosting;
import ua.com.alevel.facade.FacadeWarehousePosting;
import ua.com.alevel.services.impl.WarehousePostingService;

import java.util.List;
import java.util.Optional;

@Service
public class WarehousePostingFacade implements FacadeWarehousePosting {

    WarehousePostingService postingService;

    public WarehousePostingFacade(WarehousePostingService postingService) {
        this.postingService = postingService;
    }

    @Override
    public Boolean create(WarehousePostingDto dto) {
        WarehousePosting posting = dto.toPosting();
        Boolean isCreated = postingService.create(posting);
        dto.setId(posting.getId());
        return isCreated;
    }

    @Override
    public void update(WarehousePostingDto dto) {
        postingService.update(dto.toPosting());
    }

    @Override
    public void delete(WarehousePostingDto dto) {
        postingService.delete(dto.toPosting());
    }

    @Override
    public boolean existById(Long id) {
        return postingService.existById(id);
    }

    @Override
    public Optional<WarehousePostingDto> findById(Long id) {
        WarehousePosting posting = postingService.findById(id).get();
        return Optional.ofNullable(WarehousePostingDto.toDto(posting));
    }

    @Override
    public List<WarehousePostingDto> findAll() {
        return WarehousePostingDto.toDtoList(postingService.findAll());
    }

    @Override
    public PageDataResponse<WarehousePostingDto> findAllFromRequest(PageDataRequest request) {
        return null;
    }

    @Override
    public Long countNumberOfSearchMatches(PageDataRequest request) {
        return null;
    }

    @Override
    public Long count() {
        return postingService.count();
    }

}
