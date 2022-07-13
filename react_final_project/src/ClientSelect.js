import React, {useEffect, useState} from 'react';
import Select from "react-select";
import {Button} from "react-bootstrap";
import AddClientWindow from "./AddClientWindow";
import axios from "./api/axios";

function ClientSelect({
                          show, clientSelectValue, setClientSelectValue, showMessage,
                          isSupplier, disabled
                      }) {

    const [showAddClient, setShowAddClient] = useState(false);
    const [clientOptions, setClientOptions] = useState([{label: '...', value: null}]);

    useEffect(() => {
        if (show) {
            initData();
        }
    }, [show])

    function initData() {
        getClients();
    }

    function closeAddWindow() {
        setShowAddClient(false);
    }

    function onClientCreated() {
        getLastCreatedClient();
    }

    function getLastCreatedClient() {
        axios.get('/clients/last')
            .then((response) => {
                const client = response.data;
                const label = `${client.name}  ${client.mobile}`
                const clientOption = {label: label, value: client};
                clientOptions.push(clientOption)
                setClientSelectValue(clientOption);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function onClickAddClient() {
        setShowAddClient(true);
    }

    function createAndSetClientOptions(clients) {
        const options = convertClientsToOptions(clients);
        setClientOptions(options);
    }

    function getClients() {
        axios.get('/clients')
            .then((response) => {
                createAndSetClientOptions(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function convertClientsToOptions(clients) {
        const options = [];
        clients.forEach((client) => {
            const label = `${client.name}  ${client.mobile}`
            options.push({
                label: label,
                value: client
            })
        });
        if (isSupplier) {
            return options.filter(option => option.value.isSupplier);
        }
        return options;
    }

    return (
        <>
            <div className={'select-div'}>
                <Select
                    className={'select'}
                    options={clientOptions}
                    value={clientSelectValue}
                    onChange={setClientSelectValue}
                    isClearable={true}
                    isDisabled={disabled}
                />
                <Button className={'select-button'}
                        variant={"info"}
                        onClick={onClickAddClient}
                        disabled={disabled}>
                    +
                </Button>
            </div>
            <AddClientWindow
                show={showAddClient}
                closeAddWindow={closeAddWindow}
                onClientCreated={onClientCreated}
                showMessage={showMessage}
                isSupplier={isSupplier}
            />
        </>
    );
}


export default ClientSelect;