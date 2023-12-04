import React, {useEffect, useRef, useState} from 'react';
import Table from "./Table";
import {axiosFreeAuth} from "./api/axios";
import {useNavigate} from 'react-router-dom';
import AddClientWindow from './AddClientWindow';
import EditClientWindow from "./EditClientWindow";


function ClientTable({showMessage}) {
    const [numberOfRows, setNumberOfRows] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [amountOfElements, setAmountOfElements] = useState(0);
    const [totalOfPages, setTotalOfPages] = useState(1);
    const [searchField, setSearchField] = useState('');
    const [searchMatches, setSearchMatches] = useState(0);
    const [sort, setSort] = useState({sortField: 'id', isAsc: true});
    const [editingClient, setEditingClient] = useState({
        id: 0,
        name: '',
        email: '',
        mobile: '',
        isSupplier: false,
        recommendation: '',
        annotation: ''
    });
    const [clients, setClients] = useState([]);
    const [showAddClient, setShowAddClient] = useState(false);
    const [showEditClient, setShowEditClient] = useState(false);
    const firstTimeRender = useRef(true);
    const navigate = useNavigate();

    useEffect(() => {
        countAndSetTheTotalOfPages();
    }, [amountOfElements, clients])

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

    const getElements = () => {
        axiosFreeAuth.post('/clients', {
            numberOfElementsOnPage: numberOfRows,
            pageNumber: pageNumber,
            searchString: searchField,
            isSortAsc: sort.isAsc,
            sortBy: sort.sortField
        })
            .then((response) => {
                setClients(response.data.dtoEntities);
                setAmountOfElements(response.data.amountOfElements);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function editClient(client) {
        axiosFreeAuth.post('/clients/edit', client)
            .then((response) => {
                if (response.data === true) {
                    showMessage('Успешно сохранен', 'success')

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
        axiosFreeAuth.post('/clients/matches', {
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
        setEditingClient(client);
        setShowEditClient(true);
    }

    function onClientClick(e, client) {
        onDblClick(client);
        e.preventDefault();
    }

    function closeAddWindow() {
        setShowAddClient(false);
    }

    function closeEditWindow() {
        setShowEditClient(false);
    }

    function onClientCreated() {
        getElements();
    }

    function onClientEdited() {
        getElements();
    }

    function createTableCardHeader() {
        const tableName = 'Клиенты';
        return (
            <>
                <h4>{tableName}</h4>
                <button className={'add-button'} variant="success"
                        onClick={() => {
                            setShowAddClient(true);
                        }}>
                    <img src={'/images/plus.svg'} className={'plus-svg'}/> Клиент
                </button>
            </>
        )
    }

    const getHeaderFieldNamesMap = () => {
        const headerFieldArray = [
            {headerName: 'Id', fieldName: 'id'},
            {headerName: 'Имя/компания', fieldName: 'name'},
            {headerName: 'Email', fieldName: 'email'},
            {headerName: 'Мобильный', fieldName: 'mobile'},
            {headerName: 'Рекламный канал', fieldName: 'recommendation'},
            {headerName: 'Примечание', fieldName: 'annotation'},
        ]
        const headerFieldMap = new Map();
        headerFieldArray.forEach(headerField => {
            headerFieldMap.set(headerField.headerName, headerField.fieldName)
        })
        return headerFieldMap;
    }

    const createRowColumns = (client) => {
        let rowColumns = [];

        const supplierSvg = client.isSupplier &&
            <img src={'/images/supplier.svg'} className={'supplier-svg'}/>

        let idColumn = <td key={client.id}> {client.id}</td>;
        rowColumns.push(idColumn);
        let firstNameColumn = <td key={'name'}>
            <a href={''}
               onClick={(e) => onClientClick(e, client)}>
                {client.name}
            </a>
            {supplierSvg}</td>;
        rowColumns.push(firstNameColumn);
        let emailColumn = <td key={'email'}> {client.email}</td>;
        rowColumns.push(emailColumn);
        let mobileColumn = <td key={'mobile'}> {client.mobile}</td>;
        rowColumns.push(mobileColumn);
        let recommendationColumn = <td key={'recommendation'}> {client.recommendation}</td>;
        rowColumns.push(recommendationColumn);
        let annotationColumn = <td key={'annotation'}> {client.annotation}</td>;
        rowColumns.push(annotationColumn);

        return rowColumns;
    }

    return (
        <>
            <div className={'main-board-div'}>
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
                    elements={clients}
                    createRowColumns={createRowColumns}/>
                <AddClientWindow
                    show={showAddClient}
                    closeAddWindow={closeAddWindow}
                    onClientCreated={onClientCreated}
                    showMessage={showMessage}/>
                <EditClientWindow
                    show={showEditClient}
                    closeEditWindow={closeEditWindow}
                    onClientEdited={onClientEdited}
                    editingClient={editingClient}
                    showMessage={showMessage}/>
                {/*<Routes>*/}
                {/*    <Route path="/payment" element={*/}
                {/*        <CreatePayment*/}
                {/*            customerToPayment={customerToPayment}*/}
                {/*        />*/}
                {/*    }/>*/}
                {/*</Routes>*/}
            </div>
        </>
    );
}

export default ClientTable;