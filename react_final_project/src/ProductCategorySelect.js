import React, {useEffect, useState} from 'react';
import Select from "react-select";
import {Button} from "react-bootstrap";
import axios from "axios";
import AddProductCategoryWindow from "./AddProductCategoryWindow";

function ProductCategorySelect({show, itemSelectValue, setItemSelectValue, showMessage}) {

    const [showAddCategory, setShowAddCategory] = useState(false);
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
        setShowAddCategory(false);
    }

    function onClickAddCategory() {
        setShowAddCategory(true);
    }

    function createAndSetItemOptions(items) {
        const options = convertItemsToOptions(items);
        setItemSelectValue(options[0])
        setItemOptions(options);
    }

    function getItems() {
        axios.get('http://localhost:8080/products/categories')
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
        return options;
    }

    function onItemCreated() {
        getLastCreatedCategory();
    }

    function getLastCreatedCategory() {
        axios.get('http://localhost:8080/products/categories/last')
            .then((response) => {
                const item = response.data;
                const label = `${item.name}`
                const itemOption = {label: label, value: item};
                itemOptions.push(itemOption);
                setItemSelectValue(itemOption);
            })
            .catch(function (error) {
                console.log(error);
            })
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
                        onClick={onClickAddCategory}>
                    +
                </Button>
            </div>
            <AddProductCategoryWindow
                show={showAddCategory}
                closeAddWindow={closeAddWindow}
                showMessage={showMessage}
                onItemCreated={onItemCreated}
            />
        </>
    );
}

export default ProductCategorySelect;