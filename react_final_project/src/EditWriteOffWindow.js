import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Scrollbars} from "react-custom-scrollbars";
import axios from "./api/axios";
import $ from "jquery";
import ClientSelect from "./ClientSelect";
import EmployeeSelect from "./EmployeeSelect";
import RelocatableProductsTable from "./RelocatableProductsTable";

export default function EditWriteOffWindow({
                                               show, closeWindow, showMessage,
                                               onWriteOffEdited, writeOffToEdit
                                           }) {
    const [descriptionValue, setDescriptionValue] = useState('');
    const [clientSelectValue, setClientSelectValue] = useState({});
    const [employeeSelectValue, setEmployeeSelectValue] = useState({});
    const [relocatableProducts, setRelocatableProducts] = useState([]);
    const [productSelectValue, setProductSelectValue] = useState({});
    const [writeOffAmountValue, setWriteOffAmountValue] = useState('0');

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
        calculateWriteOffAmount();
    }, [relocatableProducts])

    function initData() {
        setWriteOffToEditFields();
    }

    function setWriteOffToEditFields() {
        setDescriptionValue(writeOffToEdit.description);
        setClientSelectValue(
            writeOffToEdit.client
                ? {
                    label: `${writeOffToEdit.client.name}  ${writeOffToEdit.client.mobile}`,
                    value: writeOffToEdit.client
                }
                : null);
        setRelocatableProducts(writeOffToEdit.relocatableProducts);
        setEmployeeSelectValue({
            label: `${writeOffToEdit.employee.name}`,
            value: writeOffToEdit.employee
        })
    }

    function calculateWriteOffAmount() {
        let amount = 0;
        relocatableProducts.forEach((relocatableProduct) => {
            amount += Number(relocatableProduct.numberOf) * Number(relocatableProduct.price)
        })
        setWriteOffAmountValue(amount.toString());
    }

    function onSubmit() {
        writeOffToEdit.description = descriptionValue;
        writeOffToEdit.employee = employeeSelectValue.value;
        editWriteOff(writeOffToEdit);
        // clearForm()
    }

    function clearForm() {

    }

    function editWriteOff(writeOff) {
        axios.post('/write_offs/edit', writeOff)
            .then((response) => {
                if (response.data === true) {
                    showMessage('Успешно изменен', 'success')
                    onWriteOffEdited();
                } else {
                    showMessage('Ошибка изменения', 'danger')
                }
            })
            .catch((error) => {
                showMessage('Ошибка изменения', 'danger')
                console.log(error);
            })
    }

    function isFormNotValid() {
        return isNumberOfProductsNotValid();
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
                        {'Изменение списания'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={"add-modal-body"}>
                    <Container className={"add-container"}>
                        <Card className={"add-card"}>
                            <Scrollbars style={{width: "100%", height: "100%"}}>
                                <Card.Body className={"add-card-body"}>
                                    <Form className={"add-form"}>
                                        <h5 className={'form-group-tag'}>Общая информация</h5>
                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                Клиент
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
                                                Описание
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
                                                Принял
                                            </Form.Label>
                                            <EmployeeSelect
                                                show={show}
                                                isSeller={false}
                                                employeeSelectValue={employeeSelectValue}
                                                setEmployeeSelectValue={setEmployeeSelectValue}/>
                                        </Form.Group>
                                        <hr/>
                                        <div style={style.amountDiv}>
                                            <h4 style={style.amountH4}>К оплате :</h4>
                                            <Card className={'amount-cash-card'} style={style.amountCashCardDiv}>
                                                <Card.Body>
                                                    <Container className={'amount-cash-container'}
                                                               style={style.amountCashCardContainer}>
                                                        <h3><b><i>{writeOffAmountValue} $</i></b></h3>
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
                                        Изменить
                                    </Button>
                                    <Button className={"cancel-form-button"} variant={"warning"} type={"button"}
                                            onClick={closeWindow}>
                                        Отменить
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