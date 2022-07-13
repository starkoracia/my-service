package ua.com.alevel.controllers;

import org.springframework.web.bind.annotation.*;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.ClientDto;
import ua.com.alevel.facade.impl.ClientFacade;

import java.util.List;

@RestController
@RequestMapping("/clients")
@CrossOrigin(origins = "${cross.origin.url}")
public class ClientController {

    ClientFacade clientFacade;

    public ClientController(ClientFacade clientFacade) {
        this.clientFacade = clientFacade;
    }

    @GetMapping()
    public List<ClientDto> clients() {
        return clientFacade.findAll();
    }

    @PostMapping()
    public PageDataResponse<ClientDto> clientsFromRequest(@RequestBody PageDataRequest request) {
        return clientFacade.findAllFromRequest(request);
    }

    @PostMapping("/matches")
    public Long matches(@RequestBody PageDataRequest request) {
        return clientFacade.countNumberOfSearchMatches(request);
    }

    @PostMapping("/create")
    public Boolean createClient(@RequestBody ClientDto dto) {
        clientFacade.create(dto);
        return true;
    }

    @PostMapping("/edit")
    public Boolean editClient(@RequestBody ClientDto dto) {
        clientFacade.update(dto);
        return true;
    }

    @GetMapping("/last")
    public ClientDto getLastCreatedClient() {
        return clientFacade.getLastCreatedClient();
    }

}
