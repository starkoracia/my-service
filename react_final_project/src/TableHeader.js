import React, {Component} from 'react';

class TableHeader extends Component {

    constructor(props) {
        super(props);
    }


    createHeader() {
        const headerFieldNamesMap = this.props.headerFieldNamesMap;
        const onClickSortIcon = this.props.onClickSortIcon;
        const sortField = this.props.sortField;
        const isAsc = this.props.isAsc;

        let headerRow = [];

        const size = headerFieldNamesMap.size;
        let i = 0;

        headerFieldNamesMap.forEach((fieldName, headerName, map) => {
            headerRow.push(
                <th key={headerName} className={'table-header-column'}
                    style={(i === 0 || i + 1 === size) ? {borderWidth: 0} : {}}
                    onClick={() => onClickSortIcon(fieldName, isAsc)}>
                    <SortIcon
                        isAsc={isAsc}
                        fieldName={fieldName}
                        headerName={headerName}
                        sortField={sortField}
                        onClickSortIcon={onClickSortIcon}/>
                </th>
            )
            i++;
        })
        return headerRow;
    }

    render() {
        return (
            <thead>
            <tr>
                {this.createHeader()}
            </tr>
            </thead>
        );
    }
}

class SortIcon extends Component {

    getSortState = () => {
        const sortName = this.props.fieldName;
        const sortField = this.props.sortField;
        const isAsc = this.props.isAsc;
        let state = '';
        if (sortField !== sortName) {
            state = '';
        }
        if (sortField === sortName) {
            state = isAsc ? 'asc' : 'desc';
        }
        return state;
    }

    render() {
        const sortState = this.getSortState();
        const sortName = this.props.fieldName;
        const headerName = this.props.headerName;
        const onClickSortIcon = this.props.onClickSortIcon;
        const isAsc = this.props.isAsc;
        let iconBlock;
        if (sortState === 'asc') {
            iconBlock = <img className={'sort-image'} src={'/images/icons/sort-up-48.png'}/>;
        } else if (sortState === 'desc') {
            iconBlock = <img className={'sort-image'} src={'/images/icons/sort-down-48.png'}/>;
        } else {
            iconBlock = <></>
        }
        return (
            <div className={'sort-icon'}
            >
                <label className={'sort-icon-label'}>{headerName}</label>
                <div className={'icon-block'}>
                    {iconBlock}
                </div>

            </div>
        )
    }
}

export default TableHeader;