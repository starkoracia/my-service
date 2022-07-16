import React, {useEffect, useRef, useState} from 'react';
import Table from "./Table";
import axios from "./api/axios";
import AddWriteOffWindow from "./AddWriteOffWindow";
import EditClientWindow from "./EditClientWindow";
import EditWriteOffWindow from "./EditWriteOffWindow";


function WriteOffTable({showMessage, showAddWriteOff, setShowAddWriteOff}) {
    const [numberOfRows, setNumberOfRows] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [amountOfElements, setAmountOfElements] = useState(0);
    const [totalOfPages, setTotalOfPages] = useState(1);
    const [searchField, setSearchField] = useState('');
    const [searchMatches, setSearchMatches] = useState(0);
    const [sort, setSort] = useState({sortField: 'id', isAsc: true});
    const [writeOffToEdit, setWriteOffToEdit] = useState({
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
    const [showEditWriteOff, setShowEditWriteOff] = useState(false);
    const [showEditClient, setShowEditClient] = useState(false);
    const firstTimeRender = useRef(true);

    useEffect(() => {
        if (showAddWriteOff) {
            initData();
        }
        if (showAddWriteOff == false) {
            getElements();
        }
    }, [showAddWriteOff])

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

    function initData() {

    }

    function getElements() {
        axios.post('/write_offs', {
                numberOfElementsOnPage: numberOfRows,
                pageNumber: pageNumber,
                searchString: searchField,
                isSortAsc: sort.isAsc,
                sortBy: sort.sortField
            })
            .then((response) => {
                setWriteOffs(response.data.dtoEntities);
                setAmountOfElements(response.data.amountOfElements);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function editWriteOff(writeOff) {
        axios.post('/write_offs/edit', writeOff)
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
        axios.post('/write_offs/matches', {
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

    const onDblClick = (writeOff) => {
        setRelocatableProductsToWriteOff(writeOff, (writeOff) => {
            setWriteOffToEdit(writeOff);
            setShowEditWriteOff(true);
        });
    }

    function onWriteOffEdited() {
        setShowEditWriteOff(false);
        getElements();
    }

    function setRelocatableProductsToWriteOff(writeOff, callback) {
        axios.post('/write_offs/relocatable_products', writeOff)
            .then(response => {
                writeOff.relocatableProducts = response.data;
                callback(writeOff);
            })
            .catch(function (error) {
                console.log(error);
            });
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

    function onSubmitEdit(writeOff) {
        editWriteOff(writeOff);
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
            </>
        )
    }

    const getHeaderFieldNamesMap = () => {
        const headerFieldArray = [
            {headerName: 'Id', fieldName: 'id'},
            {headerName: 'Клиент', fieldName: 'client'},
            {headerName: 'Ответственный/Время', fieldName: 'dateTime'},
            {headerName: 'Описание', fieldName: 'description'},
            {headerName: 'Заказ', fieldName: 'order'},
            {headerName: 'Сумма', fieldName: 'payment'},
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
        let clientColumn = <td key={'client'} style={{whiteSpace: 'pre'}}> {'--'} </td>;
        if (writeOff.client) {
            const client = writeOff.client;
            const supplierSvg = client.isSupplier &&
                <img src={'/images/supplier.svg'} className={'supplier-svg'}/>
            clientColumn = <td key={'supplier'} style={{whiteSpace: 'pre'}}>
                <a href={'#'}
                   onClick={(e) => onClientClick(e, client)}>
                    {client.name}
                </a>
                {supplierSvg}</td>;
        }
        rowColumns.push(clientColumn);
        let dateTimeColumn = <td key={'dateTime'}>
            <div className={'two-line-div'}>
                <span>{writeOff.employee.name}</span>
                <span>{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</span>
            </div>
        </td>;
        rowColumns.push(dateTimeColumn);
        let descriptionColumn = <td key={'description'}>{writeOff.description}</td>;
        rowColumns.push(descriptionColumn);
        let orderColumn = <td key={'order'}>{writeOff.order ? `Заказ #${writeOff.order.id}` : '--'}</td>;
        rowColumns.push(orderColumn);
        let paymentColumn = <td key={'payment'}> {writeOff.payment ? writeOff.payment.amount : '0'}</td>;
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
            <EditClientWindow
                show={showEditClient}
                closeEditWindow={() => setShowEditClient(false)}
                onClientEdited={() => {
                    getElements()
                }}
                editingClient={editingClient}
                showMessage={showMessage}/>
            <AddWriteOffWindow
                show={showAddWriteOff}
                closeWindow={closeAddWindow}
                onWriteOffCreated={onWriteOffCreated}
                showMessage={showMessage}/>
            <EditWriteOffWindow
                show={showEditWriteOff}
                onWriteOffEdited={onWriteOffEdited}
                onHide={closeEditWindow}
                closeWindow={closeEditWindow}
                onSubmitEdit={onSubmitEdit}
                writeOffToEdit={writeOffToEdit}
                showMessage={showMessage}/>
        </>
    );
}

export default WriteOffTable;