package ua.com.alevel.controllers;

import org.springframework.web.bind.annotation.*;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.RelocatableProductDto;
import ua.com.alevel.dto.entities.WarehouseWriteOffDto;
import ua.com.alevel.facade.impl.PaymentFacade;
import ua.com.alevel.facade.impl.WarehouseWriteOffFacade;

import java.util.List;

@RestController
@RequestMapping("/write_offs")
@CrossOrigin(origins = "${cross.origin.url}")
public class WarehouseWriteOffController {

    WarehouseWriteOffFacade writeOffFacade;
    PaymentFacade paymentFacade;

    public WarehouseWriteOffController(WarehouseWriteOffFacade writeOffFacade, PaymentFacade paymentFacade) {
        this.writeOffFacade = writeOffFacade;
        this.paymentFacade = paymentFacade;
    }

    @GetMapping
    public List<WarehouseWriteOffDto> writeOffs() {
        return writeOffFacade.findAll();
    }

    @PostMapping
    public PageDataResponse<WarehouseWriteOffDto> writeOffsFromRequest(@RequestBody PageDataRequest dataRequest) {
        return writeOffFacade.findAllFromRequest(dataRequest);
    }

    @PostMapping("/create")
    public Boolean create(@RequestBody WarehouseWriteOffDto writeOffDto) {
        paymentFacade.create(writeOffDto.getPayment());
        return writeOffFacade.create(writeOffDto);
    }

    @PostMapping("/relocatable_products")
    public List<RelocatableProductDto> getRelocatableProductsFromPosting(@RequestBody WarehouseWriteOffDto writeOffDto) {
        return writeOffFacade.getRelocatableProductsFromWriteOff(writeOffDto);
    }

    @PostMapping("/edit")
    public Boolean edit(@RequestBody WarehouseWriteOffDto writeOffDto) {
        writeOffFacade.update(writeOffDto);
        return true;
    }

    @PostMapping("/matches")
    public Long searchMatches(@RequestBody PageDataRequest request) {
        return writeOffFacade.countNumberOfSearchMatches(request);
    }

}
