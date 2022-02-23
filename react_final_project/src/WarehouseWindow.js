import React, {useState} from "react";
import {Card, Container, Tab, Tabs} from "react-bootstrap";
import ProductTable from "./ProductTable";
import PostingTable from "./PostingTable";
import WriteOffTable from "./WriteOffTable";

function WarehouseWindow({showMessage}) {
    const [tabKey, setTabKey] = useState('products');

    return (
        <>
            <div className={'main-board-div'}>
                <Card className={'tab-card'}>
                    <Card.Header className={'table-card-header'}>
                        <h4 style={{whiteSpace: 'pre'}}>{'Склад'}</h4>
                        <div className={'plus-minus-buttons-div'}>
                            <button className={'add-button'}
                                    onClick={() => {
                                        // setIsIncomeProduct(true);
                                        // setShowAddProduct(true);
                                    }}>
                                <img src={'/images/plus.svg'} className={'plus-svg'}/> Оприходование
                            </button>
                            <button className={'minus-button'}
                                    onClick={() => {
                                        // setIsIncomeProduct(false);
                                        // setShowAddProduct(true);
                                    }}>
                                <img src={'/images/minus.svg'} className={'plus-svg'}/> Списание
                            </button>
                        </div>
                    </Card.Header>
                    <Card.Body className={'table-wrap'}>
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={tabKey}
                                onSelect={(k) => setTabKey(k)}
                                className={'warehouse-tabs'}
                            >
                                <Tab eventKey="products" title="Товары" className={'warehouse-tab'}>
                                    <ProductTable showMessage={showMessage}/>
                                </Tab>
                                <Tab eventKey="posting" title="Оприходования">
                                    <PostingTable showMessage={showMessage}/>
                                </Tab>
                                <Tab eventKey="write-off" title="Списания">
                                    <WriteOffTable showMessage={showMessage}/>
                                </Tab>
                            </Tabs>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default WarehouseWindow;