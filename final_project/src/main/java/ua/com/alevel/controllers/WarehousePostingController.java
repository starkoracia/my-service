package ua.com.alevel.controllers;

import org.springframework.web.bind.annotation.*;
import ua.com.alevel.dto.entities.RelocatableProductDto;
import ua.com.alevel.dto.entities.WarehousePostingDto;
import ua.com.alevel.facade.impl.PaymentFacade;
import ua.com.alevel.facade.impl.WarehousePostingFacade;

import java.util.List;

@RestController
@RequestMapping("/postings")
@CrossOrigin(origins = "${cross.origin.url}")
public class WarehousePostingController {

    WarehousePostingFacade postingFacade;
    PaymentFacade paymentFacade;

    public WarehousePostingController(WarehousePostingFacade postingFacade, PaymentFacade paymentFacade) {
        this.postingFacade = postingFacade;
        this.paymentFacade = paymentFacade;
    }

    @GetMapping
    public List<WarehousePostingDto> postings() {
        return postingFacade.findAll();
    }

    @PostMapping("/create")
    public Boolean postingCreate(@RequestBody WarehousePostingDto postingDto) {
        paymentFacade.create(postingDto.getPayment());
        return postingFacade.create(postingDto);
    }

    @PostMapping("/edit")
    public Boolean edit(@RequestBody WarehousePostingDto postingDto) {
        postingFacade.update(postingDto);
        return true;
    }

    @PostMapping("/relocatable_products")
    public List<RelocatableProductDto> getRelocatableProductsFromPosting(@RequestBody WarehousePostingDto postingDto) {
        return postingFacade.getRelocatableProductsFromPosting(postingDto);
    }

}
