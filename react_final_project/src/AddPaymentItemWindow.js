import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Scrollbars} from "react-custom-scrollbars";
import axios from "axios";
import $ from "jquery";

export default function AddPaymentItemWindow({show, closeAddWindow, showMessage, onItemCreated}) {

    const [itemNameInputValue, setItemNameInputValue] = useState('');
    const [isIncomeValue, setIsIncomeValue] = useState(true);

    useEffect(() => {
        if(show) {
            initData();
        }
    },[show])

    function initData() {
        setIsIncomeValue(true);
        $('.payment-input.input-text').focus();
    }

    function onSubmit() {
        const item = {
            name: itemNameInputValue,
            income: isIncomeValue
        }
        createItem(item);
        closeAddWindow();
        clearForm();
    }

    function createItem(item) {
        axios.post('http://localhost:8080/payments/items/create', item)
            .then((response) => {
                if (response.data === true) {
                    showMessage('Успешно создан', 'success')
                    onItemCreated();
                } else {
                    showMessage('Ошибка создания', 'danger')
                }
            })
            .catch(function (error) {
                showMessage('Ошибка создания', 'danger')
                console.log(error);
            })
    }

    function clearForm() {
        setIsIncomeValue(true);
        setItemNameInputValue('');
    }

    function isNameNotValid() {
        if(itemNameInputValue.trim() === '') {
            return true;
        }
        return false;
    }

    function isFormNotValid() {
        return isNameNotValid();
    }

    function nameInvalidMessage() {
        if(isNameNotValid()) {
            return (
                <Form.Text className={'invalid-message'}>
                    Имя не должно быть пустым!
                </Form.Text>
            )
        }
    }

    function onHide() {
        closeAddWindow();
        clearForm();
    }

    return <Modal
        show={show}
        onHide={onHide}
        dialogClassName="add-modal-dialog"
        contentClassName={"add-modal-content"}
        aria-labelledby="example-custom-modal-styling-title"
    >
        <Modal.Header closeButton>
            <Modal.Title>
                Новая категория платежа
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className={"add-modal-body"}>
            <Container className={"add-container"}>
                <Card className={"add-card"}>
                    <Scrollbars style={{width: "100%", height: "100%"}}>
                        <Card.Body className={"add-card-body"}>
                            <Form className={"add-form"}>
                                <Form.Group className={"add-form-group"}>
                                    <div style={{display: 'flex'}}>
                                        <Form.Check.Label className={'form-group-label radio-green-label'}>
                                            Приход
                                            <Form.Check>
                                                <Form.Check.Input
                                                    type={'radio'}
                                                    name={'isIncomeRadio'}
                                                    className={'payment-radio'}
                                                    checked={isIncomeValue}
                                                    onChange={(e) => {
                                                        setIsIncomeValue(true);
                                                    }}/>
                                            </Form.Check>
                                        </Form.Check.Label>
                                        <Form.Check.Label className={'form-group-label radio-red-label'}>
                                            Расход
                                            <Form.Check>
                                                <Form.Check.Input
                                                    type={'radio'}
                                                    name={'isIncomeRadio'}
                                                    className={'payment-radio'}
                                                    onChange={(e) => {
                                                        setIsIncomeValue(false);
                                                    }}/>
                                            </Form.Check>
                                        </Form.Check.Label>
                                    </div>
                                </Form.Group>
                                <Form.Group className={"add-form-group"}>
                                    <Form.Label className={'form-group-label'}>Имя категории</Form.Label>
                                    <Form.Control type={"text"} className={'payment-input input-text'}
                                                  value={itemNameInputValue}
                                                  onChange={(e) => setItemNameInputValue(e.target.value)}
                                    />
                                    {nameInvalidMessage()}
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
                                    onClick={closeAddWindow}
                            >
                                Отменить
                            </Button>
                        </div>
                    </Card.Footer>
                </Card>
            </Container>
        </Modal.Body>
    </Modal>;
}