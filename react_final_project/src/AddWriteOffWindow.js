import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Scrollbars} from "react-custom-scrollbars";
import axios from "./api/axios";
import ClientSelect from "./ClientSelect";
import EmployeeSelect from "./EmployeeSelect";
import RelocatableProductsTable from "./RelocatableProductsTable";
import AddPaymentWindow from "./AddPaymentWindow";

export default function AddWriteOffWindow({
                                              show, closeWindow, showMessage,
                                              onWriteOffCreated
                                          }) {
    const [descriptionValue, setDescriptionValue] = useState('');
    const [clientSelectValue, setClientSelectValue] = useState({});
    const [employeeSelectValue, setEmployeeSelectValue] = useState({});
    const [relocatableProducts, setRelocatableProducts] = useState([]);
    const [productSelectValue, setProductSelectValue] = useState({});
    const [writeOffAmountValue, setWriteOffAmountValue] = useState('0');

    const [showAddPayment, setShowAddPayment] = useState(false);

    const style = {
        writeOffAmountDiv: {
            display: 'flex',
            marginLeft: '10px'
        },
        writeOffAmountH4: {
            paddingTop: '22px',
            marginLeft: 'auto'
        },
        writeOffAmountCashCardDiv: {borderWidth: '4px'},
        writeOffAmountCashCardContainer: {
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
        clearForm();
    }

    function calculateWriteOffAmount() {
        let amount = 0;
        relocatableProducts.forEach((relocatableProduct) => {
            amount += Number(relocatableProduct.numberOf) * Number(relocatableProduct.price)
        })
        setWriteOffAmountValue(amount.toString());
    }

    function clearForm() {
        setDescriptionValue('');
        setClientSelectValue(null);
        setRelocatableProducts([]);
        setProductSelectValue(null);
        setWriteOffAmountValue('0');
    }

    function onSubmit() {
        const writeOff = createWriteOffFromFields();
        console.log(writeOff);
        setShowAddPayment(true);
    }

    function onPaymentCreated(payment) {
        createWriteOff(createWriteOffFromFields(payment));
        setShowAddPayment(false);
        closeWindow();
    }

    function createWriteOffFromFields(payment) {
        const writeOff = {
            client: !!clientSelectValue?.value ? clientSelectValue.value : null,
            description: descriptionValue,
            employee: employeeSelectValue.value,
            relocatableProducts: relocatableProducts,
            payment: payment
        }
        return writeOff;
    }

    function createPaymentDataForNewPayment() {
        const paymentData = {
            amountValue: writeOffAmountValue,
            employeeSelectValue: employeeSelectValue,
            clientSelectValue: clientSelectValue,
            commentValue: 'Приход по списанию товара'
        }
        return paymentData;
    }

    function createWriteOff(writeOff) {
        axios.post('/write_offs/create', writeOff)
            .then((response) => {
                if (response.data === true) {
                    showMessage('Успешно создан', 'success')
                    onWriteOffCreated();
                } else {
                    showMessage('Ошибка создания', 'danger')
                }
            })
            .catch(function (error) {
                showMessage('Ошибка создания', 'danger')
                console.log(error);
            })
    }

    function isFormNotValid() {
        return isNumberOfProductsNotValid();
    }

    function isNumberOfProductsNotValid() {
        return relocatableProducts.length < 1;
    }

    function numberOfProductsInvalidMessage() {
        if (isNumberOfProductsNotValid()) {
            return (
                <Form.Text className={'invalid-message'}>
                    Добавьте перемещаемые товары!
                </Form.Text>
            )
        }
    }

    function onHide() {
        closeWindow();
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
                        {'Новое списание'}
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
                                                isSupplier={false}
                                            />
                                        </Form.Group>
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
                                            isWriteOff={true}
                                        />
                                        {numberOfProductsInvalidMessage()}
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
                                        <div style={style.writeOffAmountDiv}>
                                            <h4 style={style.writeOffAmountH4}>К оплате :</h4>
                                            <Card className={'amount-cash-card'}
                                                  style={style.writeOffAmountCashCardDiv}>
                                                <Card.Body>
                                                    <Container className={'amount-cash-container'}
                                                               style={style.writeOffAmountCashCardContainer}>
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
                                        Добавить
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
            <AddPaymentWindow
                paymentData={createPaymentDataForNewPayment()}
                show={showAddPayment}
                closeWindow={() => setShowAddPayment(false)}
                onPaymentCreated={onPaymentCreated}
                isIncomePayment={true}
                showMessage={showMessage}/>
        </>
    );
}