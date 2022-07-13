import React, {useEffect, useState} from 'react';
import Select from "react-select";
import {Button} from "react-bootstrap";
import axios from "./api/axios";

function EmployeeSelect({show, employeeSelectValue, setEmployeeSelectValue,
                            showMessage, isSeller, disabled}) {

    const [itemOptions, setItemOptions] = useState([{label: '...', value: null}]);

    useEffect(() => {
        initData();
    }, [])

    useEffect(() => {
        if (show) {

        }
    }, [show])

    function initData() {
        getItems();
    }

    function createAndSetItemOptions(items) {
        const options = convertItemsToOptions(items);
        if(show) {
            setEmployeeSelectValue(options[0]);
        }
        setItemOptions(options);
    }

    function getItems() {
        axios.get('/employees')
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
            .forEach((i) => {
                const label = `${i.name}`
                options.push({label: label, value: i})
            });
        if(isSeller) {
            return options.filter(option => option.value.position === 'SELLER')
        }
        return options;
    }

    return (
        <>
            <div className={'select-div'}>
                <Select
                    className={'select'}
                    options={itemOptions}
                    value={employeeSelectValue}
                    onChange={setEmployeeSelectValue}
                    isDisabled={disabled}
                />
            </div>
        </>
    );
}

export default EmployeeSelect;