import React, {useEffect, useRef, useState} from 'react';
import Table from "./Table";
import axios from "./api/axios";
import {Card, Container} from "react-bootstrap";
import EditClientWindow from "./EditClientWindow";
import AddPaymentWindow from "./AddPaymentWindow";


function PaymentTable({showMessage}) {
    const [numberOfRows, setNumberOfRows] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [amountOfElements, setAmountOfElements] = useState(0);
    const [totalOfPages, setTotalOfPages] = useState(1);
    const [searchField, setSearchField] = useState('');
    const [searchMatches, setSearchMatches] = useState(0);
    const [sort, setSort] = useState({sortField: 'id', isAsc: true});
    const [editingPayment, setEditingPayment] = useState({
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
    const [payments, setPayments] = useState([]);
    const [balance, setBalance] = useState(0);
    const [showAddPayment, setShowAddPayment] = useState(false);
    const [showEditPayment, setShowEditPayment] = useState(false);
    const [showEditClient, setShowEditClient] = useState(false);
    const [isIncomePayment, setIsIncomePayment] = useState(false);
    const firstTimeRender = useRef(true);

    useEffect(() => {
        countAndSetTheTotalOfPages();
    }, [amountOfElements, payments])

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
        axios.post('/payments', {
            numberOfElementsOnPage: numberOfRows,
            pageNumber: pageNumber,
            searchString: searchField,
            isSortAsc: sort.isAsc,
            sortBy: sort.sortField
        })
            .then((response) => {
                getBalance();
                setPayments(response.data.dtoEntities);
                setAmountOfElements(response.data.amountOfElements);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function getBalance() {
        axios.get('/payments/balance')
            .then((response) => {
                setBalance(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function editPayment(client) {
        axios.post('/payments/edit', client)
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
        axios.post('/payments/matches', {
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
        setEditingPayment(client);
        setShowEditPayment(true);
    }

    function onPaymentClick(e, client) {
        onDblClick(client);
        e.preventDefault();
    }

    function closeAddWindow() {
        setShowAddPayment(false);
    }

    function closeEditWindow() {
        setShowEditPayment(false);
    }

    function onPaymentCreated() {
        getElements();
    }

    function onSubmitEdit(client) {
        editPayment(client);
        closeEditWindow();
    }

    function onClientClick(e, client) {
        setEditingClient(client);
        setShowEditClient(true);
        e.preventDefault();
    }

    function createTableCardHeader() {
        const tableName = 'Движение денег';
        return (
            <>
                <h4 style={{whiteSpace: 'pre'}}>{tableName}</h4>
                <div className={'plus-minus-buttons-div'}>
                    <button className={'add-button'}
                            onClick={() => {
                                setIsIncomePayment(true);
                                setShowAddPayment(true);
                            }}>
                        <img src={'/images/plus.svg'} className={'plus-svg'}/> Приход
                    </button>
                    <button className={'minus-button'}
                            onClick={() => {
                                setIsIncomePayment(false);
                                setShowAddPayment(true);
                            }}>
                        <img src={'/images/minus.svg'} className={'plus-svg'}/> Расход
                    </button>
                </div>
                <Card className={'amount-cash-card'}>
                    <Card.Body>
                        <Container className={'amount-cash-container'}>
                            <h3><b><i>{balance} $</i></b></h3>
                        </Container>
                    </Card.Body>
                </Card>
            </>
        )
    }

    const getHeaderFieldNamesMap = () => {
        const headerFieldArray = [
            {headerName: 'Id', fieldName: 'id'},
            {headerName: 'Создан', fieldName: 'dateTime'},
            {headerName: 'Комментарий', fieldName: 'paymentItem'},
            {headerName: 'Клиент', fieldName: 'client'},
            {headerName: 'Сумма', fieldName: 'amount'},
            {headerName: 'Остаток', fieldName: 'balanceAfter'},
        ]
        const headerFieldMap = new Map();
        headerFieldArray.forEach(headerField => {
            headerFieldMap.set(headerField.headerName, headerField.fieldName)
        })
        return headerFieldMap;
    }

    const createRowColumns = (payment) => {
        let rowColumns = [];
        const date = new Date(Date.parse(payment.dateTime));

        let idColumn = <td key={'id'}> {payment.id}</td>;
        rowColumns.push(idColumn);
        let dateTimeColumn = <td key={'dateTime'}>
            <div className={'two-line-div'}>
                <span>{payment.cashier.name}</span>
                <span>{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</span>
            </div>
        </td>;
        rowColumns.push(dateTimeColumn);
        let commentColumn = <td key={'comment'}>
            <div className={'two-line-div'}>
                <span>{payment.paymentItem.name}</span>
                <span>{payment.comment}</span>
            </div>
        </td>;
        rowColumns.push(commentColumn);
        let clientColumn = <td key={'client'}/>;
        if (payment.client) {
            const client = payment.client;
            const supplierSvg = client.isSupplier &&
                <img src={'/images/supplier.svg'} className={'supplier-svg'}/>
            clientColumn = <td key={'client'}>
                <a href={'#'}
                   onClick={(e) => onClientClick(e, client)}>
                    {client.name}
                </a>
                {supplierSvg}</td>;
        }
        rowColumns.push(clientColumn);
        let amountColumn;
        if (payment.income) {
            amountColumn = <td key={'amount'}
                               style={{fontWeight: 800, color: 'limegreen', fontSize: '15px'}}>
                {'+' + payment.amount}</td>;
        } else {
            amountColumn = <td key={'amount'}
                               style={{fontWeight: 800, color: 'red', fontSize: '15px', textAlign: 'end'}}>
                {'-' + payment.amount}</td>;
        }
        rowColumns.push(amountColumn);
        let balanceAfterColumn = <td key={'balanceAfter'}> {payment.balanceAfter}</td>;
        rowColumns.push(balanceAfterColumn);

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
                    elements={payments}
                    createRowColumns={createRowColumns}/>
                <EditClientWindow
                    show={showEditClient}
                    closeEditWindow={() => setShowEditClient(false)}
                    onClientEdited={() => {
                        getElements()
                    }}
                    editingClient={editingClient}
                    showMessage={showMessage}/>
                <AddPaymentWindow
                    show={showAddPayment}
                    closeWindow={() => setShowAddPayment(false)}
                    onPaymentCreated={onPaymentCreated}
                    isIncomePayment={isIncomePayment}
                    showMessage={showMessage}/>
                {/*<EditPaymentWindow*/}
                {/*    show={showEditPayment}*/}
                {/*    onHide={closeEditWindow}*/}
                {/*    closeEditWindow={closeEditWindow}*/}
                {/*    onSubmitEdit={onSubmitEdit}*/}
                {/*    editingPayment={editingPayment}/>*/}
            </div>
        </>
    );
}

export default PaymentTable;