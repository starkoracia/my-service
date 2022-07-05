import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import {Scrollbars} from "react-custom-scrollbars";
import axios from "axios";
import Select from "react-select";
import $ from "jquery";
import ClientSelect from "./ClientSelect";
import PaymentItemSelect from "./PaymentItemSelect";
import EmployeeSelect from "./EmployeeSelect";

export default function AddPaymentWindow({
                                             show, closeWindow, isIncomePayment,
                                             showMessage, onPaymentCreated
                                         }) {
    const [amountValue, setAmountValue] = useState('');
    const [commentValue, setCommentValue] = useState('');
    const [clientSelectValue, setClientSelectValue] = useState([]);
    const [paymentItemSelectValue, setPaymentItemSelectValue] = useState({});
    const [cashierOptions, setCashierOptions] = useState({});
    const [cashierSelectValue, setCashierSelectValue] = useState({});


    useEffect(() => {
        if (show) {
            initData();
        }
    }, [show])

    function initData() {
        if (isIncomePayment) {
            setCommentValue('Приход денег');
        } else {
            setCommentValue('Расход денег');
        }
        $('.input-text.input-cash').focus();
    }

    function onSubmit() {
        let client;
        if (clientSelectValue != null && clientSelectValue.value != null) {
            client = clientSelectValue.value;
        } else {
            client = null;
        }
        const payment = {
            amount: amountValue,
            cashier: cashierSelectValue.value,
            client: client,
            comment: commentValue,
            income: isIncomePayment,
            paymentItem: paymentItemSelectValue.value
        }
        console.log(payment);
        createPayment(payment);
        clearForm()
    }

    function clearForm() {
        setAmountValue('');
        setCommentValue('');
        setClientSelectValue(null);
        setPaymentItemSelectValue(null);
        setCashierOptions({});
        setCashierSelectValue({});
    }

    function createPayment(payment) {
        axios.post('http://localhost:8080/payments/create', payment)
            .then((response) => {
                if (response.data === true) {
                    showMessage('Успешно создан', 'success')
                    onPaymentCreated();
                    closeWindow();
                } else {
                    showMessage('Ошибка создания', 'danger')
                }
            })
            .catch(function (error) {
                showMessage('Ошибка создания', 'danger')
                console.log(error);
            })
    }

    function isAmountNotValid() {
        if (amountValue.trim() === '') {
            return true;
        }
        return false;
    }

    function isFormNotValid() {
        return isAmountNotValid() || isCommentNotValid();
    }

    function amountInvalidMessage() {
        if (isAmountNotValid()) {
            return (
                <Form.Text className={'invalid-message'}>
                    Сумма не должна быть пустой!
                </Form.Text>
            )
        }
    }

    function isCommentNotValid() {
        if (commentValue.trim() === '') {
            return true;
        }
        return false;
    }

    function commentInvalidMessage() {
        if (isCommentNotValid()) {
            return (
                <Form.Text className={'invalid-message'}>
                    Комментарий не должен быть пустым!
                </Form.Text>
            )
        }
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
                        {isIncomePayment ? 'Приход денег' : 'Расход денег'}
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
                                            />
                                        </Form.Group>
                                        <Form.Group className={" add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                Сумма
                                                <b className={'red-star'}>*</b></Form.Label>
                                            <Form.Control type={"number"} className={'input-text input-cash'}
                                                          min="0.00" max="999999999999" step="0.01"
                                                          value={amountValue}
                                                          onChange={(e) => setAmountValue(e.target.value)}
                                            />
                                            {amountInvalidMessage()}
                                        </Form.Group>
                                        <h5 className={'form-group-tag'}>Другое</h5>
                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                Комментарий
                                                <b className={'red-star'}>*</b></Form.Label>
                                            <Form.Control as={'textarea'} className={'input-text'}
                                                          value={commentValue}
                                                          onChange={(e) => setCommentValue(e.target.value)}/>
                                            {commentInvalidMessage()}
                                        </Form.Group>
                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                Категория платежа
                                                <b className={'red-star'}>*</b>
                                            </Form.Label>
                                            <PaymentItemSelect
                                                itemSelectValue={paymentItemSelectValue}
                                                setItemSelectValue={setPaymentItemSelectValue}
                                                showMessage={showMessage}
                                                show={show}
                                                isIncomePayment={isIncomePayment}/>
                                        </Form.Group>
                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                Кассир
                                                <b className={'red-star'}>*</b>
                                            </Form.Label>
                                            <EmployeeSelect
                                                show={show}
                                                isSeller={true}
                                                showMessage={showMessage}
                                                employeeSelectValue={cashierSelectValue}
                                                setEmployeeSelectValue={setCashierSelectValue} />
                                        </Form.Group>
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
                                            onClick={closeWindow}
                                    >
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