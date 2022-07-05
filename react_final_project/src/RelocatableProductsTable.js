import React, {useState} from 'react';
import Table from "./Table";
import {Button, Form} from "react-bootstrap";
import RelocatableProductSelect from "./RelocatableProductSelect";
import showMessage from "./ShowMessage";

function RelocatableProductsTable({
                                      show, showMessage, selectedProducts, setSelectedProducts,
                                      productSelectValue, setProductSelectValue
                                  }) {

    const [sort, setSort] = useState({sortField: 'id', isAsc: true});
    const [amountValue, setAmountValue] = useState(0);

    const style = {
        selectProductDiv: {display: 'flex'}
    }

    function onDblClick(product) {
        // setProductToEdit(product);
        // setShowEditProduct(true);
    }

    function onSelectButtonClick() {
        const relocatableProduct = {
            productMaterial: productSelectValue.value,
            numberOf: amountValue
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

    function isAmountNotValid() {
        if (amountValue == 0) {
            return true;
        }
        return false;
    }

    function amountInvalidMessage() {
        if (isAmountNotValid()) {
            return (
                <Form.Text className={'invalid-message'}>
                    Количество должно быть больше 0!
                </Form.Text>
            )
        }
    }

    function createTableCardHeader() {
        const tableName = 'Товары';
        return (
            <div className={'table-card-header relocatable-product'}>
                <div>
                    <RelocatableProductSelect
                        show={show}
                        showMessage={showMessage}
                        selectedProducts={selectedProducts}
                        productSelectValue={productSelectValue}
                        setProductSelectValue={setProductSelectValue}/>
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
                        />
                    </Form.Group>
                    <Button className={'select-button'}
                            variant={"secondary"}
                            onClick={onSelectButtonClick}
                            disabled={isAmountNotValid()}
                    >
                        Добавить в список
                    </Button>
                </div>
                {amountInvalidMessage()}
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
        const amount = Number(relocatableProduct.numberOf) * Number(relocatableProduct.productMaterial.zeroCost);

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
        let zeroCostColumn = <td key={'tradeCost'}>{relocatableProduct.productMaterial.zeroCost}</td>;
        rowColumns.push(zeroCostColumn);
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
                createRowColumns={createRowColumns}/>
        </>
    );
}

export default RelocatableProductsTable;