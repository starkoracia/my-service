import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Scrollbars} from "react-custom-scrollbars";
import axios from "./api/axios";
import ClientSelect from "./ClientSelect";
import EmployeeSelect from "./EmployeeSelect";
import RelocatableProductsTable from "./RelocatableProductsTable";

export default function EditPostingWindow({
                                              show, closeWindow, showMessage,
                                              onPostingEdited, postingToEdit
                                          }) {
    const [descriptionValue, setDescriptionValue] = useState('');
    const [clientSelectValue, setClientSelectValue] = useState({});
    const [employeeSelectValue, setEmployeeSelectValue] = useState({});
    const [relocatableProducts, setRelocatableProducts] = useState([]);
    const [productSelectValue, setProductSelectValue] = useState({});
    const [postingAmountValue, setPostingAmountValue] = useState('0');

    const style = {
        amountDiv: {
            display: 'flex',
            marginLeft: '10px'
        },
        amountH4: {
            paddingTop: '22px',
            marginLeft: 'auto'
        },
        amountCashCardDiv: {borderWidth: '4px'},
        amountCashCardContainer: {
            width: '150px',
            borderWidth: '4px'
        }
    }

    useEffect(() => {
        if (show) {
            initData();
        }
    }, [show])

    useEffect(() => {
        calculatePostingAmount();
    }, [relocatableProducts])

    function initData() {
        setPostingToEditFields();
    }

    function setPostingToEditFields() {
        setDescriptionValue(postingToEdit.description);
        setClientSelectValue({
            label: `${postingToEdit.supplier.name}  ${postingToEdit.supplier.mobile}`,
            value: postingToEdit.supplier
        });
        setRelocatableProducts(postingToEdit.relocatableProducts);
        setEmployeeSelectValue({
            label: `${postingToEdit.employee.name}`,
            value: postingToEdit.employee
        })
    }

    function calculatePostingAmount() {
        let amount = 0;
        relocatableProducts.forEach((relocatableProduct) => {
            amount += Number(relocatableProduct.numberOf) * Number(relocatableProduct.price)
        })
        setPostingAmountValue(amount.toString());
    }

    function onSubmit() {
        postingToEdit.description = descriptionValue;
        postingToEdit.employee = employeeSelectValue.value;
        editPosting(postingToEdit);
    }

    function clearForm() {

    }

    function editPosting(posting) {
        axios.post('/postings/edit', posting)
            .then((response) => {
                if (response.data === true) {
                    showMessage('?????????????? ??????????????', 'success')
                    onPostingEdited();
                } else {
                    showMessage('???????????? ??????????????????', 'danger')
                }
            })
            .catch((error) => {
                showMessage('???????????? ??????????????????', 'danger')
                console.log(error);
            })
    }

    function isFormNotValid() {
        return isSupplierNotValid() || isNumberOfProductsNotValid();
    }

    function isSupplierNotValid() {
        return clientSelectValue == null || !clientSelectValue.value;
    }

    function isNumberOfProductsNotValid() {
        return relocatableProducts.length < 1;
    }

    function onHide() {
        closeWindow();
        clearForm();
    }

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                dialogClassName="add-modal-dialog"
                contentClassName={"add-modal-content"}
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {'?????????????????? ??????????????????????????'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={"add-modal-body"}>
                    <Container className={"add-container"}>
                        <Card className={"add-card"}>
                            <Scrollbars style={{width: "100%", height: "100%"}}>
                                <Card.Body className={"add-card-body"}>
                                    <Form className={"add-form"}>
                                        <h5 className={'form-group-tag'}>?????????? ????????????????????</h5>
                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                ??????????????????
                                            </Form.Label>
                                            <ClientSelect
                                                clientSelectValue={clientSelectValue}
                                                setClientSelectValue={setClientSelectValue}
                                                showMessage={showMessage}
                                                show={show}
                                                isSupplier={true}
                                                disabled={true}
                                            />
                                        </Form.Group>
                                        <hr/>
                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                ????????????????
                                            </Form.Label>
                                            <Form.Control as={'textarea'} className={'input-text'}
                                                          value={descriptionValue}
                                                          onChange={(e) =>
                                                              setDescriptionValue(e.target.value)}/>
                                        </Form.Group>
                                        <hr/>
                                        <RelocatableProductsTable
                                            show={show}
                                            showMessage={showMessage}
                                            selectedProducts={relocatableProducts}
                                            setSelectedProducts={setRelocatableProducts}
                                            productSelectValue={productSelectValue}
                                            setProductSelectValue={setProductSelectValue}
                                            disabled={true}
                                        />
                                        <hr/>
                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                ????????????
                                            </Form.Label>
                                            <EmployeeSelect
                                                show={show}
                                                isSeller={false}
                                                employeeSelectValue={employeeSelectValue}
                                                setEmployeeSelectValue={setEmployeeSelectValue}/>
                                        </Form.Group>
                                        <hr/>
                                        <div style={style.amountDiv}>
                                            <h4 style={style.amountH4}>?? ???????????? :</h4>
                                            <Card className={'amount-cash-card'} style={style.amountCashCardDiv}>
                                                <Card.Body>
                                                    <Container className={'amount-cash-container'}
                                                               style={style.amountCashCardContainer}>
                                                        <h3><b><i>{postingAmountValue} $</i></b></h3>
                                                    </Container>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                        <hr/>
                                    </Form>
                                </Card.Body>
                            </Scrollbars>
                            <Card.Footer className={"add-card-footer"}>
                                <div className={"add-cancel-buttons-div"}>
                                    <Button className={"add-form-button"} variant={"secondary"} type={"button"}
                                            disabled={isFormNotValid()}
                                            onClick={onSubmit}>
                                        ????????????????
                                    </Button>
                                    <Button className={"cancel-form-button"} variant={"warning"} type={"button"}
                                            onClick={closeWindow}>
                                        ????????????????
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}