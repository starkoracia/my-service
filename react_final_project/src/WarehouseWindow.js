import React, {useEffect, useState} from "react";
import {Card, Container, Tab, Tabs} from "react-bootstrap";
import ProductTable from "./ProductTable";
import PostingTable from "./PostingTable";
import WriteOffTable from "./WriteOffTable";

function WarehouseWindow({showMessage}) {
    const [tabKey, setTabKey] = useState('products');
    const [showAddPosting, setShowAddPosting] = useState(false);
    const [showAddWriteOff, setShowAddWriteOff] = useState(false);
    const [productTableUpdate, setProductTableUpdate] = useState(false);

    useEffect(() => {
        if (!showAddPosting) {
            setProductTableUpdate(true);
        }
    }, [showAddPosting])

    useEffect(() => {
        if (!showAddWriteOff) {
            setProductTableUpdate(true);
        }
    }, [showAddWriteOff])

    function onAddNewPostingButtonClicked() {
        setShowAddPosting(true);
    }

    function onAddNewWriteOffButtonClicked() {
        setShowAddWriteOff(true);
    }

    return (
        <>
            <div className={'main-board-div'}>
                <Card className={'tab-card'}>
                    <Card.Header className={'table-card-header'}>
                        <h4 style={{whiteSpace: 'pre'}}>{'Склад'}</h4>
                        <div className={'plus-minus-buttons-div'}>
                            <button className={'add-button'}
                                    onClick={() => {
                                        onAddNewPostingButtonClicked();
                                    }}>
                                <img src={'/images/plus.svg'} className={'plus-svg'}/> Оприходование
                            </button>
                            <button className={'minus-button'}
                                    onClick={() => {
                                        onAddNewWriteOffButtonClicked();
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
                                <ProductTable showMessage={showMessage}
                                              productTableUpdate={productTableUpdate}
                                              setProductTableUpdate={setProductTableUpdate}/>
                            </Tab>
                            <Tab eventKey="posting" title="Оприходования">
                                <PostingTable showMessage={showMessage}
                                              showAddPosting={showAddPosting}
                                              setShowAddPosting={setShowAddPosting}/>
                            </Tab>
                            <Tab eventKey="write-off" title="Списания">
                                <WriteOffTable showMessage={showMessage}
                                               showAddWriteOff={showAddWriteOff}
                                               setShowAddWriteOff={setShowAddWriteOff}/>
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default WarehouseWindow;