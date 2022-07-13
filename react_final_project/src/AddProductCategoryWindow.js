import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Scrollbars} from "react-custom-scrollbars";
import axios from "./api/axios";
import $ from "jquery";

export default function AddProductCategoryWindow({show, closeAddWindow, showMessage, onItemCreated}) {

    const [itemNameInputValue, setItemNameInputValue] = useState('');

    useEffect(() => {
        if (show) {
            initData();
        }
    }, [show])

    function initData() {
        $('.payment-input.input-text').focus();
    }

    function onSubmit() {
        const item = {
            name: itemNameInputValue
        }
        createItem(item);
        closeAddWindow();
        clearForm();
    }

    function createItem(item) {
        axios.post('/products/categories/create', item)
            .then((response) => {
                if (response.data === true) {
                    onItemCreated();
                    showMessage('Успешно создан', 'success');
                } else {
                    showMessage('Ошибка создания', 'danger');
                }
            })
            .catch(function (error) {
                showMessage('Ошибка создания', 'danger');
                console.log(error);
            })
    }

    function clearForm() {
        setItemNameInputValue('');
    }

    function isNameNotValid() {
        if (itemNameInputValue.trim() === '') {
            return true;
        }
        return false;
    }

    function isFormNotValid() {
        return isNameNotValid();
    }

    function nameInvalidMessage() {
        if (isNameNotValid()) {
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
                Новая категория товара
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className={"add-modal-body"}>
            <Container className={"add-container"}>
                <Card className={"add-card"}>
                    <Scrollbars style={{width: "100%", height: "100%"}}>
                        <Card.Body className={"add-card-body"}>
                            <Form className={"add-form"} onSubmit={(event) => event.preventDefault()}>
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