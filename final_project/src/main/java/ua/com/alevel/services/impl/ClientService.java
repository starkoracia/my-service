package ua.com.alevel.services.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ua.com.alevel.dao.impl.ClientDao;
import ua.com.alevel.dto.PageDataRequest;
import ua.com.alevel.dto.PageDataResponse;
import ua.com.alevel.dto.entities.ClientDto;
import ua.com.alevel.entities.Client;
import ua.com.alevel.services.ServiceClient;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService implements ServiceClient {

    ClientDao clientDao;
    private Logger infoLogger = LoggerFactory.getLogger("info");

    public ClientService(ClientDao clientDao) {
        this.clientDao = clientDao;
    }

    @Override
    public Boolean create(Client client) {
        Boolean isCreated = clientDao.create(client);
        infoLogger.info("Client is created: {}", client);
        return isCreated;
    }

    @Override
    public void update(Client client) {
        clientDao.update(client);
        infoLogger.info("Client is updated: {}", client);
    }

    @Override
    public void delete(Client client) {
        clientDao.delete(client);
        infoLogger.info("Client is deleted: {}", client);
    }

    @Override
    public boolean existById(Long id) {
        return clientDao.existById(id);
    }

    @Override
    public Optional<Client> findById(Long id) {
        return clientDao.findById(id);
    }

    @Override
    public List<Client> findAll() {
        return clientDao.findAll();
    }

    @Override
    public Long count() {
        return clientDao.count();
    }

    public PageDataResponse<ClientDto> findAllFromRequest(PageDataRequest request) {
        List<Client> clients = clientDao.findAllFromRequest(request);
        PageDataResponse<ClientDto> dataResponse = new PageDataResponse<>();
        dataResponse.setDtoEntities(ClientDto.toDtoList(clients));
        if (request.getSearchString().equals("")) {
            dataResponse.setAmountOfElements(count().intValue());
        } else {
            dataResponse.setAmountOfElements(clients.size());
        }
        return dataResponse;
    }

    public Long countNumberOfSearchMatches(PageDataRequest request) {
        return clientDao.countNumberOfSearchMatches(request);
    }

    public Client getLastCreatedClient() {
        return clientDao.getLastCreatedClient();
    }

}
