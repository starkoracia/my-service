import React, {Component} from 'react';
import {Button, Card, Container, Form, FormControl, Table as TableBs} from "react-bootstrap";
import './css/Table.css'
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import {PaginationDiv} from "./PaginationDiv";

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sortBy: '',
            isSortAsc: true,
            searchString: ''
        }
    }

    countFirstPageElement = () => {
        const currentPage = this.props.currentPage;
        const numberOfRows = this.props.numberOfRows;
        if (this.props.amountOfElements == 0) {
            return 0;
        }
        return (currentPage - 1) * numberOfRows + 1
    }

    countLastPageElement = () => {
        const amountOfElements = this.props.amountOfElements;
        const numberOfRows = Number(this.props.numberOfRows);
        const firstElement = this.countFirstPageElement();
        const fullPageElement = firstElement + numberOfRows - 1;
        const isFullPage = fullPageElement < amountOfElements;
        if (isFullPage) {
            return fullPageElement;
        }
        return amountOfElements;
    }

    render() {
        const tableCardHeader = this.props.tableCardHeader;
        const headerFieldNamesMap = this.props.headerFieldNamesMap;
        const fieldNames = Array.from(this.props.headerFieldNamesMap.values());
        const elements = this.props.elements;
        const currentPage = this.props.currentPage;
        const totalPages = this.props.totalPages;
        const numberOfRows = this.props.numberOfRows;
        const amountOfElements = this.props.amountOfElements;
        const sortField = this.props.sortField;
        const searchMatches = this.props.searchMatches;
        const onChangeNumberOfRowsHandler = this.props.onChangeNumberOfRowsHandler;
        const onChangeSearchField = this.props.onChangeSearchField;
        const onSearchSubmit = this.props.onSearchSubmit;
        const onClickSortIcon = this.props.onClickSortIcon;
        const isAsc = this.props.isAsc;
        const countFirstPageElement = this.countFirstPageElement;
        const countLastPageElement = this.countLastPageElement;
        const onClickEdit = this.props.onClickEdit;
        const onClickDelete = this.props.onClickDelete;
        const createRowColumns = this.props.createRowColumns;
        const searchFieldRemove = this.props.searchFieldRemove;
        const paginationRemove = this.props.paginationRemove;
        const disabled = this.props.disabled;
        return (
            <Container className={`table-wrap ` + (searchFieldRemove && 'auto-width')}
                       style={disabled && {pointerEvents: 'none'}}>
                <Card className={'table-card ' + (searchFieldRemove && 'auto-height')}>
                    <Card.Header className={'table-card-header'}>
                        {tableCardHeader}
                        {searchFieldRemove
                            ? <></>
                            :
                            <Container className={'search-container'}>
                                <label className={'search-matches-label'}>Cовпадений: {searchMatches}</label>
                                <Form className="search-form d-flex" onSubmit={onSearchSubmit}>
                                    <FormControl
                                        size={"sm"}
                                        type="search"
                                        placeholder="Поиск"
                                        className="me-2 search-input"
                                        aria-label="Search"
                                        onChange={onChangeSearchField}
                                    />
                                    <Button type={'submit'} className={'search-button'} size={"sm"}
                                            variant="outline-success">Найти</Button>
                                </Form>
                            </Container>
                        }
                    </Card.Header>
                    <Card.Body className={'table-card-body'}>
                        <TableBs striped bordered hover>
                            <TableHeader
                                headerFieldNamesMap={headerFieldNamesMap}
                                sortField={sortField}
                                isAsc={isAsc}
                                onClickSortIcon={onClickSortIcon}
                            />
                            <TableBody
                                elements={elements}
                                fieldNames={fieldNames}
                                onClickEdit={onClickEdit}
                                onClickDelete={onClickDelete}
                                createRowColumns={createRowColumns}
                            />
                        </TableBs>
                    </Card.Body>
                    {paginationRemove
                        ? <></>
                        :
                        <Card.Footer>
                            <Container className={'table-footer'}>
                                <label id={'show-total-rows'}>
                                    с <b>{countFirstPageElement()}</b> по <b>{countLastPageElement()}</b> [ Всего:
                                    <b> {amountOfElements}</b> ]</label>
                                <div id={'number-of-rows-div'}>
                                    <Form.Select value={numberOfRows}
                                                 id={'number-of-rows-select'}
                                                 size="sm"
                                                 onChange={onChangeNumberOfRowsHandler}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </Form.Select>
                                </div>
                                <PaginationDiv
                                    paginationOnClick={this.props.paginationOnClick}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                />
                            </Container>
                        </Card.Footer>
                    }
                </Card>
            </Container>
        );
    }
}

export default Table;