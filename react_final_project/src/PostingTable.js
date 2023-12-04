import React, {useEffect, useRef, useState} from 'react';
import Table from "./Table";
import axios from "./api/axios";
import AddPostingWindow from "./AddPostingWindow";
import EditClientWindow from "./EditClientWindow";
import EditPostingWindow from "./EditPostingWindow";


function PostingTable({showMessage, showAddPosting, setShowAddPosting}) {
    const [numberOfRows, setNumberOfRows] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [amountOfElements, setAmountOfElements] = useState(0);
    const [totalOfPages, setTotalOfPages] = useState(1);
    const [searchField, setSearchField] = useState('');
    const [searchMatches, setSearchMatches] = useState(0);
    const [sort, setSort] = useState({sortField: 'id', isAsc: true});
    const [postingToEdit, setPostingToEdit] = useState({
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
    const [showEditPosting, setShowEditPosting] = useState(false);
    const [showEditClient, setShowEditClient] = useState(false);
    const firstTimeRender = useRef(true);

    useEffect(() => {
        if (showAddPosting) {
            initData();
        }
        if (showAddPosting == false) {
            getElements();
        }
    }, [showAddPosting])

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

    function initData() {

    }

    function getElements() {
        axios.post('/postings', {
                numberOfElementsOnPage: numberOfRows,
                pageNumber: pageNumber,
                searchString: searchField,
                isSortAsc: sort.isAsc,
                sortBy: sort.sortField
            })
            .then((response) => {
                setPostings(response.data.dtoEntities);
                setAmountOfElements(response.data.amountOfElements);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function editPosting(posting) {
        axios.post('/postings/edit', posting)
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
        axios.post('/postings/matches', {
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

    function onDblClick(posting) {
        setRelocatableProductsToPosting(posting, (posting) => {
            setPostingToEdit(posting);
            setShowEditPosting(true);
        });
    }

    function onPostingEdited() {
        setShowEditPosting(false);
        getElements();
    }

    function setRelocatableProductsToPosting(posting, callback) {
        axios.post('/postings/relocatable_products', posting)
            .then(response => {
                posting.relocatableProducts = response.data;
                callback(posting);
            })
            .catch(function (error) {
                console.log(error);
            });
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

    function onSubmitEdit(posting) {
        editPosting(posting);
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
            {headerName: 'Ответственный/Время', fieldName: 'dateTime'},
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
        let supplierColumn = <td key={'supplier'} style={{whiteSpace: 'pre'}}/>;
        if (posting.supplier) {
            const supplier = posting.supplier;
            const supplierSvg = supplier.isSupplier &&
                <img src={'/images/supplier.svg'} className={'supplier-svg'}/>
            supplierColumn = <td key={'supplier'} style={{whiteSpace: 'pre'}}>
                <a href={'#'}
                   onClick={(e) => onClientClick(e, supplier)}>
                    {supplier.name}
                </a>
                {supplierSvg}</td>;
        }
        rowColumns.push(supplierColumn);
        let dateTimeColumn = <td key={'dateTime'} style={{whiteSpace: 'pre'}}>
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
            <EditClientWindow
                show={showEditClient}
                closeEditWindow={() => setShowEditClient(false)}
                onClientEdited={() => getElements()}
                editingClient={editingClient}
                showMessage={showMessage}/>
            <AddPostingWindow
                show={showAddPosting}
                closeWindow={closeAddWindow}
                onPostingCreated={onPostingCreated}
                showMessage={showMessage}/>
            <EditPostingWindow
                showMessage={showMessage}
                onPostingEdited={onPostingEdited}
                show={showEditPosting}
                onHide={closeEditWindow}
                closeWindow={closeEditWindow}
                onSubmitEdit={onSubmitEdit}
                postingToEdit={postingToEdit}/>
        </>
    );
}

export default PostingTable;