import React, {useEffect, useRef, useState} from 'react';
import Table from "./Table";
import axios from "axios";
import {Card, Container, Tab, Tabs} from "react-bootstrap";


function WriteOffTable({showMessage}) {
    const [numberOfRows, setNumberOfRows] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [amountOfElements, setAmountOfElements] = useState(0);
    const [totalOfPages, setTotalOfPages] = useState(1);
    const [searchField, setSearchField] = useState('');
    const [searchMatches, setSearchMatches] = useState(0);
    const [sort, setSort] = useState({sortField: 'id', isAsc: true});
    const [editingWriteOff, setEditingWriteOff] = useState({
        id: 0,
    });
    const [editingClient, setEditingClient] = useState({
        id: 0,
        name: '',
        email: '',
        mobile: '',
        isSupplier: false,
        recommendation: '',
        annotation: ''
    });
    const [writeOffs, setWriteOffs] = useState([]);
    const [showAddWriteOff, setShowAddWriteOff] = useState(false);
    const [showEditWriteOff, setShowEditWriteOff] = useState(false);
    const [showEditClient, setShowEditClient] = useState(false);
    const [isIncomeWriteOff, setIsIncomeWriteOff] = useState(false);
    const firstTimeRender = useRef(true);

    useEffect(() => {
        countAndSetTheTotalOfPages();
    }, [amountOfElements, writeOffs])

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
        axios.get('http://localhost:8080/write_offs')
            //     numberOfElementsOnPage: numberOfRows,
            //     pageNumber: pageNumber,
            //     searchString: searchField,
            //     isSortAsc: sort.isAsc,
            //     sortBy: sort.sortField
            // })
            .then((response) => {
                console.log(response.data);
                setWriteOffs(response.data);
                // setAmountOfElements(response.data.amountOfElements);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function editWriteOff(client) {
        axios.post('http://localhost:8080/writeOffs/edit', client)
            .then((response) => {
                if (response.data === true) {
                    showMessage('Успешно сохранен', 'success')
                    getElements();
                } else {
                    showMessage('Ошибка сохранения', 'danger')
                }
            })
            .catch(function (error) {
                showMessage('Ошибка сохранения', 'danger')
                console.log(error);
            })
    }

    const getNumberOfSearchMatches = () => {
        axios.post('http://localhost:8080/writeOffs/matches', {
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

    const onDblClick = (client) => {
        setEditingWriteOff(client);
        setShowEditWriteOff(true);
    }

    function onWriteOffClick(e, client) {
        onDblClick(client);
        e.preventDefault();
    }

    function closeAddWindow() {
        setShowAddWriteOff(false);
    }

    function closeEditWindow() {
        setShowEditWriteOff(false);
    }

    function onWriteOffCreated() {
        getElements();
    }

    function onSubmitEdit(client) {
        editWriteOff(client);
        closeEditWindow();
    }

    function onClientClick(e, client) {
        setEditingClient(client);
        setShowEditClient(true);
        e.preventDefault();
    }

    function createTableCardHeader() {
        const tableName = 'Списания';
        return (
            <>
                <h4 style={{whiteSpace: 'pre'}}>{tableName}</h4>
                {/*<div className={'plus-minus-buttons-div'}>*/}
                {/*    <button className={'add-button'}*/}
                {/*            onClick={() => {*/}
                {/*                setIsIncomeWriteOff(true);*/}
                {/*                setShowAddWriteOff(true);*/}
                {/*            }}>*/}
                {/*        <img src={'/images/plus.svg'} className={'plus-svg'}/> Оприходование*/}
                {/*    </button>*/}
                {/*    <button className={'minus-button'}*/}
                {/*            onClick={() => {*/}
                {/*                setIsIncomeWriteOff(false);*/}
                {/*                setShowAddWriteOff(true);*/}
                {/*            }}>*/}
                {/*        <img src={'/images/minus.svg'} className={'plus-svg'}/> Списание*/}
                {/*    </button>*/}
                {/*</div>*/}
            </>
        )
    }

    const getHeaderFieldNamesMap = () => {
        const headerFieldArray = [
            {headerName: 'Id', fieldName: 'id'},
            {headerName: 'Время', fieldName: 'dateTime'},
            {headerName: 'Описание', fieldName: 'description'},
            {headerName: 'Заказ', fieldName: 'order'},
            {headerName: 'Цена', fieldName: 'payment'},
        ]
        const headerFieldMap = new Map();
        headerFieldArray.forEach(headerField => {
            headerFieldMap.set(headerField.headerName, headerField.fieldName)
        })
        return headerFieldMap;
    }

    const createRowColumns = (writeOff) => {
        let rowColumns = [];
        const date = new Date(Date.parse(writeOff.dateTime));

        let idColumn = <td key={'id'}> {writeOff.id}</td>;
        rowColumns.push(idColumn);
        let dateTimeColumn = <td key={'dateTime'}>
            <div className={'two-line-div'}>
                <span>{writeOff.employee.name}</span>
                <span>{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</span>
            </div>
        </td>;
        rowColumns.push(dateTimeColumn);
        let descriptionColumn = <td key={'description'}>{writeOff.description}</td>;
        rowColumns.push(descriptionColumn);
        let orderColumn = <td key={'order'}>{`Заказ #${writeOff.order.id}`}</td>;
        rowColumns.push(orderColumn);
        let paymentColumn = <td key={'payment'}> {writeOff.payment && writeOff.payment.amount}</td>;
        rowColumns.push(paymentColumn);

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
                elements={writeOffs}
                createRowColumns={createRowColumns}/>
            {/*<Table*/}
            {/*    onChangeSearchField={onChangeSearchField}*/}
            {/*    onChangeNumberOfRowsHandler={onChangeNumberOfRowsHandler}*/}
            {/*    paginationOnClick={paginationOnClick}*/}
            {/*    onSearchSubmit={onSearchSubmit}*/}
            {/*    onClickSortIcon={onClickSortIcon}*/}
            {/*    onClickEdit={onDblClick}*/}
            {/*    headerFieldNamesMap={getHeaderFieldNamesMap()}*/}
            {/*    isAsc={sort.isAsc}*/}
            {/*    sortField={sort.sortField}*/}
            {/*    searchMatches={searchMatches}*/}
            {/*    amountOfElements={amountOfElements}*/}
            {/*    totalPages={totalOfPages}*/}
            {/*    currentPage={pageNumber}*/}
            {/*    numberOfRows={numberOfRows}*/}
            {/*    tableCardHeader={createTableCardHeader()}*/}
            {/*    elements={writeOffs}*/}
            {/*    createRowColumns={createRowColumns}/>*/}
            {/*<EditClientWindow*/}
            {/*    show={showEditClient}*/}
            {/*    closeEditWindow={() => setShowEditClient(false)}*/}
            {/*    onClientEdited={() => {getElements()}}*/}
            {/*    editingClient={editingClient}*/}
            {/*    showMessage={showMessage}/>*/}
            {/*<AddWriteOffWindow*/}
            {/*    show={showAddWriteOff}*/}
            {/*    closeWindow={() => setShowAddWriteOff(false)}*/}
            {/*    onWriteOffCreated={onWriteOffCreated}*/}
            {/*    isIncomeWriteOff={isIncomeWriteOff}*/}
            {/*    showMessage={showMessage}/>*/}
            {/*<EditWriteOffWindow*/}
            {/*    show={showEditWriteOff}*/}
            {/*    onHide={closeEditWindow}*/}
            {/*    closeEditWindow={closeEditWindow}*/}
            {/*    onSubmitEdit={onSubmitEdit}*/}
            {/*    editingWriteOff={editingWriteOff}/>*/}
        </>
    );
}

export default WriteOffTable;