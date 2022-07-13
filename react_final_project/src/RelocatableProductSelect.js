import React, {useEffect, useState} from 'react';
import Select from "react-select";
import {Button} from "react-bootstrap";
import AddProductWindow from "./AddProductWindow";
import axios from "./api/axios";
import configData from "./configData.js";

function RelocatableProductSelect({
                                      show, productSelectValue, setProductSelectValue,
                                      selectedProducts, showMessage, disabled, isWriteOff
                                  }) {
    const [products, setProducts] = useState([]);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [productOptions, setProductOptions] = useState([{label: '...', value: null}]);

    useEffect(() => {
        if (show) {
            initData();
        }
    }, [show])

    useEffect(() => {
        createAndSetProductOptions();
    }, [selectedProducts, products])

    function initData() {
        getProducts();
    }

    function closeWindow() {
        setShowAddProduct(false);
    }

    function onProductCreated() {
        getLastCreatedProduct();
    }

    function getProducts() {
        axios.get(`${configData.SERVER_URL}/products`)
            .then((response) => {
                const products = response.data;
                setProducts(products);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function getLastCreatedProduct() {
        axios.get('/products/last')
            .then((response) => {
                const product = response.data;
                const label = `#${product.id} ${product.name}`;
                const productOption = {label: label, value: product};
                productOptions.push(productOption)
                setProductSelectValue(productOption);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function onClickAddProduct() {
        setShowAddProduct(true);
    }

    function createAndSetProductOptions() {
        const filteredProducts =
            products
                .filter(product => {
                    let result = true;
                    selectedProducts.forEach(relocatableProduct => {
                        if (relocatableProduct.productMaterial.id === product.id) {
                            result = false;
                        }
                    });
                    if (isWriteOff && !product.inStock) {
                        result = false;
                    }
                    return result;
                });

        const options = convertProductsToOptions(filteredProducts);
        setProductOptions(options);
        setProductSelectValue(options[0] ? options[0] : null);
    }

    function convertProductsToOptions(products) {
        const options = [];
        products.forEach((product) => {
            const label = `#${product.id} ${product.name} ${isWriteOff ? `(${product.numberOf} шт)` : ''}`;
            options.push({
                label: label,
                value: product
            })
        });
        return options;
    }

    return (
        <>
            <h6>Товар</h6>
            <div className={'select-div'}>
                <Select
                    className={'select relocatable-product'}
                    options={productOptions}
                    value={productSelectValue}
                    onChange={setProductSelectValue}
                    isClearable={true}
                    isDisabled={disabled}
                />
                {!isWriteOff &&
                    <Button className={'select-button'}
                            variant={"info"}
                            onClick={onClickAddProduct}
                            disabled={disabled}>
                        Новый товар +
                    </Button>}
            </div>
            <AddProductWindow
                show={showAddProduct}
                closeWindow={closeWindow}
                onProductCreated={onProductCreated}
                showMessage={showMessage}
            />
        </>
    );
}


export default RelocatableProductSelect;