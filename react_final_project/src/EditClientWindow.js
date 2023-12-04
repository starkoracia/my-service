import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Scrollbars} from "react-custom-scrollbars";
import {axiosFreeAuth} from "./api/axios";

export default function EditClientWindow({
                                             show, closeEditWindow,
                                             editingClient, showMessage, onClientEdited
                                         }) {
    const [isSupplierValue, setIsSupplierValue] = useState(false);
    const [nameInputValue, setNameInputValue] = useState('');
    const [emailInputValue, setEmailInputValue] = useState('');
    const [mobileInputValue, setMobileInputValue] = useState('');
    const [recommendationInputValue, setRecommendationInputValue] = useState('');
    const [annotationInputValue, setAnnotationInputValue] = useState('');

    useEffect(() => {
        if (show) {
            setClientToForm(editingClient);
        }
    }, [show])

    function onSubmit() {
        const client = {
            id: editingClient.id,
            isSupplier: isSupplierValue,
            name: nameInputValue,
            email: emailInputValue,
            mobile: mobileInputValue,
            recommendation: recommendationInputValue,
            annotation: annotationInputValue
        }
        editClient(client);
        closeEditWindow();
        clearForm()
    }

    function editClient(client) {
        axiosFreeAuth.post('/clients/edit', client)
            .then((response) => {
                if (response.data === true) {
                    showMessage('Успешно сохранен', 'success')
                    onClientEdited()
                } else {
                    showMessage('Ошибка сохранения', 'danger')
                }
            })
            .catch(function (error) {
                showMessage('Ошибка сохранения', 'danger')
                console.log(error);
            })
    }

    function setClientToForm(client) {
        setIsSupplierValue(client.isSupplier);
        setNameInputValue(client.name);
        setEmailInputValue(client.email);
        setMobileInputValue(client.mobile);
        setRecommendationInputValue(client.recommendation);
        setAnnotationInputValue(client.annotation)
    }

    function clearForm() {
        setIsSupplierValue(false);
        setNameInputValue('');
        setEmailInputValue('');
        setMobileInputValue('');
        setRecommendationInputValue('');
        setAnnotationInputValue('');
    }

    function isNameNotValid() {
        if (nameInputValue.trim() === '') {
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
        closeEditWindow();
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
                Данные клиента
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
                                    <Form.Label className={'form-group-label checkbox-label'}>
                                        <Form.Check type={'checkbox'} placeholder={"Поставщик"}>
                                            <Form.Check.Input className={'checkbox'}
                                                              checked={isSupplierValue}
                                                              onChange={(e) => setIsSupplierValue(e.target.checked)}/>
                                        </Form.Check>
                                        <img src={'/images/supplier.svg'} className={'supplier-checkbox-svg'}/>Поставщик
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className={"add-form-group"}>
                                    <Form.Label className={'form-group-label'}>Имя клиента<b
                                        className={'red-star'}>*</b></Form.Label>
                                    <Form.Control type={"text"} className={'input-text'}
                                                  value={nameInputValue}
                                                  onChange={(e) => setNameInputValue(e.target.value)}
                                    />
                                    {nameInvalidMessage()}
                                </Form.Group>
                                <Form.Group className={"add-form-group"}>
                                    <Form.Label className={'form-group-label'}>Email</Form.Label>
                                    <Form.Control type={"text"} className={'input-text'}
                                                  value={emailInputValue}
                                                  onChange={(e) => setEmailInputValue(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className={" add-form-group"}>
                                    <Form.Label className={'form-group-label'}>Телефон</Form.Label>
                                    <Form.Control type={"number"} className={'input-text'}
                                                  min="0" max="999999999999" step="1"
                                                  value={mobileInputValue}
                                                  onChange={(e) => setMobileInputValue(e.target.value)}
                                    />
                                    {/*{this.phoneNumberInvalidMessage()}*/}
                                </Form.Group>
                                <h5 className={'form-group-tag'}>Другое</h5>
                                <Form.Group className={"add-form-group"}>
                                    <Form.Label className={'form-group-label'}>Откуда клиент узнал про нас</Form.Label>
                                    <Form.Control type={"text"} className={'input-text'}
                                                  value={recommendationInputValue}
                                                  onChange={(e) => setRecommendationInputValue(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className={"add-form-group"}>
                                    <Form.Label className={'form-group-label'}>Примечание</Form.Label>
                                    <Form.Control as={'textarea'} className={'input-text'}
                                                  value={annotationInputValue}
                                                  onChange={(e) => setAnnotationInputValue(e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Scrollbars>
                    <Card.Footer className={"add-card-footer"}>
                        <div className={"add-cancel-buttons-div"}>
                            <Button className={"add-form-button"} variant={"secondary"} type={"button"}
                                    disabled={isFormNotValid()}
                                    onClick={onSubmit}>
                                Сохранить
                            </Button>
                            <Button className={"cancel-form-button"} variant={"warning"} type={"button"}
                                    onClick={closeEditWindow}
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