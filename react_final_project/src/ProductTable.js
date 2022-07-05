import React, {useEffect, useRef, useState} from 'react';
import Table from "./Table";
import axios from "axios";
import {Button, Card, Container, Tab, Tabs} from "react-bootstrap";
import AddProductWindow from "./AddProductWindow";
import EditProductWindow from "./EditProductWindow";


function ProductTable({showMessage}) {
    const [numberOfRows, setNumberOfRows] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [amountOfElements, setAmountOfElements] = useState(0);
    const [totalOfPages, setTotalOfPages] = useState(1);
    const [searchField, setSearchField] = useState('');
    const [searchMatches, setSearchMatches] = useState(0);
    const [sort, setSort] = useState({sortField: 'id', isAsc: true});
    const [productToEdit, setProductToEdit] = useState({
        id: 0,
        productCategory: {label: 'Все товары', value: {id: 1, name: 'Все товары'}},
        name: '',
        description: '',
        code: '',
        vendorCode: '',
        isWarranty: false,
        warrantyDays: '0',
        zeroCost: '0',
        repairCost: '0',
        tradeCost: '0',
    });
    const [products, setProducts] = useState([]);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showEditProduct, setShowEditProduct] = useState(false);
    const firstTimeRender = useRef(true);

    useEffect(() => {
        countAndSetTheTotalOfPages();
    }, [amountOfElements, products])

    useEffect(() => {
        getElements();
    }, [numberOfRows, pageNumber, sort])

    useEffect(() => {
        if (!firstTimeRender.current) {
            if (searchField !== '') {
                getNumberOfSearchMatches();
            } else {
                setSearchMatches(0);
                getElements();
            }
        } else {
            firstTimeRender.current = false;
        }
    }, [searchField])

    function getElements() {
        axios.post('http://localhost:8080/products', {
            numberOfElementsOnPage: numberOfRows,
            pageNumber: pageNumber,
            searchString: searchField,
            isSortAsc: sort.isAsc,
            sortBy: sort.sortField
        })
            .then((response) => {
                console.log(response.data);
                setProducts(response.data.dtoEntities);
                setAmountOfElements(response.data.amountOfElements);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const getNumberOfSearchMatches = () => {
        axios.post('http://localhost:8080/products/matches', {
            searchString: searchField
        })
            .then((response) => {
                const searchMatches = response.data;
                setSearchMatches(searchMatches);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const countAndSetTheTotalOfPages = () => {
        const pages = countTheTotalOfPages(numberOfRows, amountOfElements);
        setTotalOfPages(pages);
    }

    const countTheTotalOfPages = (numberOfRows, amountOfElements) => {
        const amount = amountOfElements;
        let pages = Math.floor(amount / numberOfRows);
        if (amount % numberOfRows !== 0) {
            return pages + 1;
        }
        return pages;
    }

    const onChangeSearchField = (event) => {
        const text = event.target.value;
        setSearchField(text);
    }

    const onChangeNumberOfRowsHandler = (event) => {
        const newNumbersOfRows = event.target.value;
        let newTotalPages = countTheTotalOfPages(newNumbersOfRows, amountOfElements);
        newTotalPages === 0 && (newTotalPages = 1);
        if (newTotalPages < pageNumber) {
            setPageNumber(newTotalPages);
        }
        setNumberOfRows(newNumbersOfRows);
    }

    const paginationOnClick = (pageNumber) => {
        setPageNumber(pageNumber);
    }

    const onSearchSubmit = (event) => {
        event.preventDefault();

        let pages = countTheTotalOfPages(numberOfRows, searchMatches);
        pages === 0 && (pages = 1);
        if (searchMatches === 0 && searchField === '') {
            return;
        }
        if (pages < pageNumber) {
            setPageNumber(pages);
        } else {
            getElements();
        }
    }

    const onClickSortIcon = (sortName, isAsc) => {
        const lastSortField = sort.sortField;
        let isAscNew = true;
        if (lastSortField === sortName) {
            isAscNew = !isAsc;
        }
        setSort({sortField: sortName, isAsc: isAscNew});
    }

    const onDblClick = (product) => {
        setProductToEdit(product);
        setShowEditProduct(true);
    }

    function closeAddWindow() {
        setShowAddProduct(false);
    }

    function closeEditWindow() {
        setShowEditProduct(false);
    }

    function onProductCreated() {
        getElements();
    }

    function onSubmitProductEdit() {
        getElements();
    }

    function onClickAddProduct() {
        setShowAddProduct(true);
    }

    function createTableCardHeader() {
        const tableName = 'Товары';
        return (
            <>
                <h4 style={{whiteSpace: 'pre'}}>{tableName}</h4>
                <div className={'plus-minus-buttons-div'}>
                    <Button variant={'info'} className={'select-button'}
                            onClick={onClickAddProduct}>
                        <img src={'/images/plus.svg'} className={'plus-svg'}/>
                        Товар
                    </Button>
                </div>
            </>
        )
    }

    const getHeaderFieldNamesMap = () => {
        const headerFieldArray = [
            {headerName: 'Id', fieldName: 'id'},
            {headerName: 'Наименование', fieldName: 'name'},
            {headerName: 'Описание', fieldName: 'description'},
            {headerName: 'Код', fieldName: 'code'},
            {headerName: 'Цена', fieldName: 'tradeCost'},
            {headerName: 'Гарантия', fieldName: 'warrantyDays'},
            {headerName: 'Остаток', fieldName: 'numberOf'},
        ]
        const headerFieldMap = new Map();
        headerFieldArray.forEach(headerField => {
            headerFieldMap.set(headerField.headerName, headerField.fieldName)
        })
        return headerFieldMap;
    }

    const createRowColumns = (product) => {
        let rowColumns = [];

        let idColumn = <td key={'id'}> {product.id}</td>;
        rowColumns.push(idColumn);
        let nameColumn = <td key={'name'} style={{padding: '1px 8px'}}>
            <div className={'two-line-div'}>
                <span>{product.productCategory.name}</span>
                <span style={{fontWeight: 500, fontSize: 'small'}}>{`${product.name}`}</span>
            </div>
        </td>;
        rowColumns.push(nameColumn);
        let descriptionColumn = <td key={'description'}>{product.description}</td>;
        rowColumns.push(descriptionColumn);
        let codeColumn = <td key={'code'}>
            <div className={'two-line-div'}>
                <span>{product.code}</span>
                <span>{product.vendorCode}</span>
            </div>
        </td>;
        rowColumns.push(codeColumn);
        let tradeCostColumn = <td key={'tradeCost'}> {product.tradeCost}</td>;
        rowColumns.push(tradeCostColumn);
        let warrantyDaysColumn = <td key={'warrantyDays'}> {product.warrantyDays}</td>;
        rowColumns.push(warrantyDaysColumn);
        let numberOfColumn = <td key={'numberOf'}> {product.numberOf}</td>;
        rowColumns.push(numberOfColumn);

        return rowColumns;
    }

    return (
        <>
            <Table
                onChangeSearchField={onChangeSearchField}
                onChangeNumberOfRowsHandler={onChangeNumberOfRowsHandler}
                paginationOnClick={paginationOnClick}
                onSearchSubmit={onSearchSubmit}
                onClickSortIcon={onClickSortIcon}
                onClickEdit={onDblClick}
                headerFieldNamesMap={getHeaderFieldNamesMap()}
                isAsc={sort.isAsc}
                sortField={sort.sortField}
                searchMatches={searchMatches}
                amountOfElements={amountOfElements}
                totalPages={totalOfPages}
                currentPage={pageNumber}
                numberOfRows={numberOfRows}
                tableCardHeader={createTableCardHeader()}
                elements={products}
                createRowColumns={createRowColumns} />
            <AddProductWindow
                show={showAddProduct}
                closeWindow={() => setShowAddProduct(false)}
                onProductCreated={onProductCreated}
                showMessage={showMessage} />
            <EditProductWindow
                show={showEditProduct}
                closeWindow={() => setShowEditProduct(false)}
                onSubmitEdit={onSubmitProductEdit}
                productToEdit={productToEdit}
                showMessage={showMessage} />
            {/*<EditClientWindow*/}
            {/*    show={showEditClient}*/}
            {/*    closeEditWindow={() => setShowEditClient(false)}*/}
            {/*    onClientEdited={() => {getElements()}}*/}
            {/*    editingClient={editingClient}*/}
            {/*    showMessage={showMessage}/>*/}
        </>
    );
}

export default ProductTable;