package ua.com.alevel.controllers;

import org.springframework.web.bind.annotation.*;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.PaymentDto;
import ua.com.alevel.dto.entities.PaymentItemDto;
import ua.com.alevel.facade.impl.PaymentFacade;
import ua.com.alevel.facade.impl.PaymentItemFacade;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    PaymentFacade paymentFacade;
    PaymentItemFacade itemFacade;

    public PaymentController(PaymentFacade paymentFacade, PaymentItemFacade itemFacade) {
        this.paymentFacade = paymentFacade;
        this.itemFacade = itemFacade;
    }

    @GetMapping()
    public List<PaymentDto> payments() {
        return paymentFacade.findAll();
    }

    @PostMapping()
    public PageDataResponse<PaymentDto> paymentsFromRequest(@RequestBody PageDataRequest request) {
        return paymentFacade.findAllFromRequest(request);
    }

    @PostMapping("/matches")
    public Long searchMatches(@RequestBody PageDataRequest request) {
        return paymentFacade.countNumberOfSearchMatches(request);
    }


    @PostMapping("/create")
    public Boolean employees(@RequestBody PaymentDto paymentDto) {
        return paymentFacade.create(paymentDto);
    }


    @GetMapping("/balance")
    public BigDecimal getBalance() {
        return paymentFacade.getBalanceFromLastPayment();
    }


    @GetMapping("/items")
    public List<PaymentItemDto> getPaymentItems() {
        return itemFacade.findAll();
    }

    @GetMapping("/items/last")
    public PaymentItemDto getLastItem() {
        return itemFacade.getLastCreatedItem();
    }

    @PostMapping("/items/create")
    public Boolean createItem(@RequestBody PaymentItemDto itemDto) {
        return itemFacade.create(itemDto);
    }

}
