import React, {useEffect, useState} from 'react';
import Select from "react-select";
import {Button} from "react-bootstrap";
import axios from "axios";
import AddPaymentItemWindow from "./AddPaymentItemWindow";

function PaymentItemSelect({show, itemSelectValue, setItemSelectValue,
                               showMessage, isIncomePayment}) {

    const [showAddItem, setShowAddItem] = useState(false);
    const [itemOptions, setItemOptions] = useState([{label: '...', value: null}]);

    useEffect(() => {
        if (show) {
            initData();
        }
    }, [show])

    function initData() {
        getItems();
    }

    function closeAddWindow() {
        setShowAddItem(false);
    }

    function onItemCreated() {
        getLastCreatedClient();
    }

    function getLastCreatedClient() {
        axios.get('http://localhost:8080/payments/items/last')
            .then((response) => {
                const item = response.data;
                const label = `${item.name}`
                const itemOption = {label: label, value: item};
                if(isIncomePayment === item.income) {
                    itemOptions.push(itemOption);
                    setItemSelectValue(itemOption);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function onClickAddItem() {
        setShowAddItem(true);
    }

    function createAndSetItemOptions(items) {
        const options = convertItemsToOptions(items);
        setItemSelectValue(options[0])
        setItemOptions(options);
    }

    function getItems() {
        axios.get('http://localhost:8080/payments/items')
            .then((response) => {
                createAndSetItemOptions(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function convertItemsToOptions(items) {
        const options = [];
        items
            .filter((i) => i.income === isIncomePayment)
            .forEach((i) => {
                const label = `${i.name}`
                options.push({label: label, value: i})
            });
        return options;
    }

    return (
        <>
            <div className={'select-div'}>
                <Select
                    className={'select'}
                    options={itemOptions}
                    value={itemSelectValue}
                    onChange={setItemSelectValue}
                />
                <Button className={'select-button'}
                        variant={"info"}
                        onClick={onClickAddItem}>
                    +
                </Button>
            </div>
            <AddPaymentItemWindow
                show={showAddItem}
                closeAddWindow={closeAddWindow}
                onItemCreated={onItemCreated}
                showMessage={showMessage}
                isIncomePayment={isIncomePayment}
            />
        </>
    );
}

export default PaymentItemSelect;