import React, {useEffect, useState} from 'react';
import Table from "./Table";
import {Button, Form} from "react-bootstrap";
import RelocatableProductSelect from "./RelocatableProductSelect";

function RelocatableProductsTable({
                                      show, showMessage, selectedProducts, setSelectedProducts,
                                      productSelectValue, setProductSelectValue, disabled,
                                      isWriteOff
                                  }) {

    const [sort, setSort] = useState({sortField: 'id', isAsc: true});
    const [amountValue, setAmountValue] = useState(0);
    const [priceValue, setPriceValue] = useState(0);

    const style = {
        selectProductDiv: {display: 'flex'}
    }

    useEffect(() => {
        if (productSelectValue?.value?.zeroCost) {
            setPriceValue(productSelectValue.value.zeroCost);
        }
    }, [productSelectValue])

    function onDblClick(relocatableProduct) {
        if (!disabled) {
            const filteredProducts = selectedProducts.filter((product) => product != relocatableProduct);
            setSelectedProducts(filteredProducts);
        }
    }

    function onSelectButtonClick() {
        const relocatableProduct = {
            productMaterial: productSelectValue.value,
            numberOf: amountValue,
            price: priceValue
        }
        setSelectedProducts([...selectedProducts, relocatableProduct]);
        clearForm();
    }

    function clearForm() {
        setAmountValue(0);

    }

    function onClickSortIcon(sortName, isAsc) {
        const lastSortField = sort.sortField;
        let isAscNew = true;
        if (lastSortField === sortName) {
            isAscNew = !isAsc;
        }
        setSort({sortField: sortName, isAsc: isAscNew});
    }

    function isRelocatableProductSelectEmpty() {
        return productSelectValue == null || !productSelectValue.value;
    }

    function isAmountNotValid() {
        if (amountValue <= 0) {
            return true;
        }
        return false;
    }

    function isWriteOffAmountNotValid() {
        if (isWriteOff && productSelectValue?.value?.numberOf < amountValue) {
            return true;
        }
        return false;
    }

    function relocatableProductSelectNotValidMessage() {
        if (isRelocatableProductSelectEmpty()) {
            return (
                <Form.Text className={'invalid-message'}>
                    Выберите продукт!
                </Form.Text>
            )
        }
    }

    function amountInvalidMessage() {
        if (isAmountNotValid()) {
            return (
                <Form.Text className={'invalid-message'}>
                    Количество не может быть меньше 1!
                </Form.Text>
            )
        }
        if (isWriteOffAmountNotValid()) {
            return (
                <Form.Text className={'invalid-message'}>
                    Количество не может превышать остаток товара на складе!
                </Form.Text>
            )
        }
    }

    function isAddToListButtonDisabled() {
        return isAmountNotValid() || isRelocatableProductSelectEmpty()
            || isWriteOffAmountNotValid() || disabled;
    }

    function onFocusSelect(event) {
        event.target.select()
    }

    function createTableCardHeader() {
        const tableName = 'Товары';
        return (!disabled &&
            <div className={'table-card-header relocatable-product'}>
                <div>
                    <RelocatableProductSelect
                        show={show}
                        showMessage={showMessage}
                        selectedProducts={selectedProducts}
                        productSelectValue={productSelectValue}
                        setProductSelectValue={setProductSelectValue}
                        isWriteOff={isWriteOff}
                        disabled={disabled}/>
                    {!disabled && relocatableProductSelectNotValidMessage()}
                </div>
                <hr/>
                <div style={style.selectProductDiv}>
                    <Form.Group className={" add-form-group"}>
                        <Form.Label className={'form-group-label'}>
                            Количество
                        </Form.Label>
                        <Form.Control type={"number"} className={'input-text input-cash'}
                                      min="0.00" max="999999999999" step="1"
                                      value={amountValue}
                                      onChange={(e) => setAmountValue(e.target.value)}
                                      onFocus={onFocusSelect}
                                      disabled={disabled}
                        />
                    </Form.Group>
                    <Form.Group className={" add-form-group"} style={{marginLeft: '5px'}}>
                        <Form.Label className={'form-group-label'}>
                            Цена
                        </Form.Label>
                        <Form.Control type={"number"} className={'input-text input-cash'}
                                      min="0.00" max="999999999999" step="0.1"
                                      value={priceValue}
                                      onChange={(e) => setPriceValue(e.target.value)}
                                      onFocus={onFocusSelect}
                                      disabled={disabled}
                        />
                    </Form.Group>
                    <Button className={'select-button'}
                            variant={"secondary"}
                            onClick={onSelectButtonClick}
                            disabled={isAddToListButtonDisabled()}
                    >
                        Добавить в список
                    </Button>
                </div>
                {!disabled && amountInvalidMessage()}
            </div>
        )
    }

    function getHeaderFieldNamesMap() {
        const headerFieldArray = [
            {headerName: 'Количество', fieldName: 'numberOf'},
            {headerName: 'Наименование', fieldName: 'name'},
            {headerName: 'Описание', fieldName: 'description'},
            {headerName: 'Код', fieldName: 'code'},
            {headerName: 'Цена', fieldName: 'zeroCost'},
            {headerName: 'Сумма', fieldName: 'amount'},
        ]
        const headerFieldMap = new Map();
        headerFieldArray.forEach(headerField => {
            headerFieldMap.set(headerField.headerName, headerField.fieldName)
        })
        return headerFieldMap;
    }

    function createRowColumns(relocatableProduct) {
        let rowColumns = [];
        const amount = Number(relocatableProduct.numberOf) * Number(relocatableProduct.price);

        let numberOfColumn = <td key={'numberOf'}> {relocatableProduct.numberOf}</td>;
        rowColumns.push(numberOfColumn);
        let nameColumn = <td key={'name'} style={{padding: '1px 8px'}}>
            <div className={'two-line-div'}>
                <span>{relocatableProduct.productMaterial.productCategory.name}</span>
                <span style={{fontWeight: 500, fontSize: 'small'}}>{`${relocatableProduct.productMaterial.name}`}</span>
            </div>
        </td>;
        rowColumns.push(nameColumn);
        let descriptionColumn = <td key={'description'}>{relocatableProduct.productMaterial.description}</td>;
        rowColumns.push(descriptionColumn);
        let codeColumn = <td key={'code'}>
            <div className={'two-line-div'}>
                <span>{relocatableProduct.productMaterial.code}</span>
                <span>{relocatableProduct.productMaterial.vendorCode}</span>
            </div>
        </td>;
        rowColumns.push(codeColumn);
        let priceColumn = <td key={'price'}>{relocatableProduct.price}</td>;
        rowColumns.push(priceColumn);
        let amountColumn = <td key={'amount'}>{amount}</td>
        rowColumns.push(amountColumn);

        return rowColumns;
    }

    return (
        <>
            <Table
                searchFieldRemove={true}
                paginationRemove={true}
                onClickSortIcon={onClickSortIcon}
                onClickEdit={onDblClick}
                headerFieldNamesMap={getHeaderFieldNamesMap()}
                isAsc={sort.isAsc}
                sortField={sort.sortField}
                tableCardHeader={createTableCardHeader()}
                elements={selectedProducts}
                createRowColumns={createRowColumns}
                disabled={disabled}/>
        </>
    );
}

export default RelocatableProductsTable;