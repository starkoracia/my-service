import React, {useEffect, useRef, useState} from 'react';
import Table from "./Table";
import axios from "axios";


function PostingTable({showMessage}) {
    const [numberOfRows, setNumberOfRows] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [amountOfElements, setAmountOfElements] = useState(0);
    const [totalOfPages, setTotalOfPages] = useState(1);
    const [searchField, setSearchField] = useState('');
    const [searchMatches, setSearchMatches] = useState(0);
    const [sort, setSort] = useState({sortField: 'id', isAsc: true});
    const [editingPosting, setEditingPosting] = useState({
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
    const [postings, setPostings] = useState([]);
    const [showAddPosting, setShowAddPosting] = useState(false);
    const [showEditPosting, setShowEditPosting] = useState(false);
    const [showEditClient, setShowEditClient] = useState(false);
    const [isIncomePosting, setIsIncomePosting] = useState(false);
    const firstTimeRender = useRef(true);

    useEffect(() => {
        countAndSetTheTotalOfPages();
    }, [amountOfElements, postings])

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
        axios.get('http://localhost:8080/postings')
            //     numberOfElementsOnPage: numberOfRows,
            //     pageNumber: pageNumber,
            //     searchString: searchField,
            //     isSortAsc: sort.isAsc,
            //     sortBy: sort.sortField
            // })
            .then((response) => {
                console.log(response.data);
                setPostings(response.data);
                // setAmountOfElements(response.data.amountOfElements);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function editPosting(client) {
        axios.post('http://localhost:8080/postings/edit', client)
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
        axios.post('http://localhost:8080/postings/matches', {
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
        setEditingPosting(client);
        setShowEditPosting(true);
    }

    function onPostingClick(e, client) {
        onDblClick(client);
        e.preventDefault();
    }

    function closeAddWindow() {
        setShowAddPosting(false);
    }

    function closeEditWindow() {
        setShowEditPosting(false);
    }

    function onPostingCreated() {
        getElements();
    }

    function onSubmitEdit(client) {
        editPosting(client);
        closeEditWindow();
    }

    function onClientClick(e, client) {
        setEditingClient(client);
        setShowEditClient(true);
        e.preventDefault();
    }

    function createTableCardHeader() {
        const tableName = 'Оприходования';
        return (
            <>
                <h4 style={{whiteSpace: 'pre'}}>{tableName}</h4>
            </>
        )
    }

    const getHeaderFieldNamesMap = () => {
        const headerFieldArray = [
            {headerName: 'Id', fieldName: 'id'},
            {headerName: 'Поставщик', fieldName: 'supplier'},
            {headerName: 'Время', fieldName: 'dateTime'},
            {headerName: 'Описание', fieldName: 'description'},
            {headerName: 'Сумма', fieldName: 'payment'},
        ]
        const headerFieldMap = new Map();
        headerFieldArray.forEach(headerField => {
            headerFieldMap.set(headerField.headerName, headerField.fieldName)
        })
        return headerFieldMap;
    }

    const createRowColumns = (posting) => {
        let rowColumns = [];
        const date = new Date(Date.parse(posting.dateTime));

        let idColumn = <td key={'id'}> {posting.id}</td>;
        rowColumns.push(idColumn);
        let supplierColumn = <td key={'supplier'}/>;
        if(posting.supplier) {
            const supplier = posting.supplier;
            const supplierSvg = supplier.isSupplier &&
                <img src={'/images/supplier.svg'} className={'supplier-svg'}/>
            supplierColumn = <td key={'supplier'}>
                <a href={'#'}
                   onClick={(e) => onClientClick(e, supplier)}>
                    {supplier.name}
                </a>
                {supplierSvg}</td>;
        }
        rowColumns.push(supplierColumn);
        let dateTimeColumn = <td key={'dateTime'}>
            <div className={'two-line-div'}>
                <span>{posting.employee.name}</span>
                <span>{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</span>
            </div>
        </td>;
        rowColumns.push(dateTimeColumn);
        let descriptionColumn = <td key={'description'}>{posting.description}</td>;
        rowColumns.push(descriptionColumn);
        let paymentColumn = <td key={'payment'}> {posting.payment.amount}</td>;
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
                elements={postings}
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
            {/*    elements={postings}*/}
            {/*    createRowColumns={createRowColumns}/>*/}
            {/*<EditClientWindow*/}
            {/*    show={showEditClient}*/}
            {/*    closeEditWindow={() => setShowEditClient(false)}*/}
            {/*    onClientEdited={() => {getElements()}}*/}
            {/*    editingClient={editingClient}*/}
            {/*    showMessage={showMessage}/>*/}
            {/*<AddPostingWindow*/}
            {/*    show={showAddPosting}*/}
            {/*    closeWindow={() => setShowAddPosting(false)}*/}
            {/*    onPostingCreated={onPostingCreated}*/}
            {/*    isIncomePosting={isIncomePosting}*/}
            {/*    showMessage={showMessage}/>*/}
            {/*<EditPostingWindow*/}
            {/*    show={showEditPosting}*/}
            {/*    onHide={closeEditWindow}*/}
            {/*    closeEditWindow={closeEditWindow}*/}
            {/*    onSubmitEdit={onSubmitEdit}*/}
            {/*    editingPosting={editingPosting}/>*/}
        </>
    );
}

export default PostingTable;