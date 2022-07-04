package ua.com.alevel.facade.impl;

import org.springframework.stereotype.Service;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.WarehouseWriteOffDto;
import ua.com.alevel.entities.WarehouseWriteOff;
import ua.com.alevel.facade.FacadeWarehouseWriteOff;
import ua.com.alevel.services.impl.WarehouseWriteOffService;

import java.util.List;
import java.util.Optional;

@Service
public class WarehouseWriteOffFacade implements FacadeWarehouseWriteOff {

    WarehouseWriteOffService writeOffService;

    public WarehouseWriteOffFacade(WarehouseWriteOffService writeOffService) {
        this.writeOffService = writeOffService;
    }

    @Override
    public Boolean create(WarehouseWriteOffDto dto) {
        WarehouseWriteOff writeOff = dto.toWriteOff();
        Boolean isCreated = writeOffService.create(writeOff);
        dto.setId(writeOff.getId());
        return isCreated;
    }

    @Override
    public void update(WarehouseWriteOffDto dto) {
        writeOffService.update(dto.toWriteOff());
    }

    @Override
    public void delete(WarehouseWriteOffDto dto) {
        writeOffService.delete(dto.toWriteOff());
    }

    @Override
    public boolean existById(Long id) {
        return writeOffService.existById(id);
    }

    @Override
    public Optional<WarehouseWriteOffDto> findById(Long id) {
        WarehouseWriteOff writeOff = writeOffService.findById(id).get();
        return Optional.ofNullable(WarehouseWriteOffDto.toDto(writeOff));
    }

    @Override
    public List<WarehouseWriteOffDto> findAll() {
        return WarehouseWriteOffDto.toDtoList(writeOffService.findAll());
    }

    @Override
    public PageDataResponse<WarehouseWriteOffDto> findAllFromRequest(PageDataRequest request) {
        return null;
    }

    @Override
    public Long countNumberOfSearchMatches(PageDataRequest request) {
        return null;
    }

    @Override
    public Long count() {
        return writeOffService.count();
    }

}
