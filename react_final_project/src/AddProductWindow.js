import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Scrollbars} from "react-custom-scrollbars";
import axios from "./api/axios";
import $ from "jquery";
import ProductCategorySelect from "./ProductCategorySelect";

export default function AddProductWindow({
                                             show, closeWindow, showMessage,
                                             onProductCreated
                                         }) {
    const [nameValue, setNameValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');
    const [codeValue, setCodeValue] = useState('');
    const [vendorCodeValue, setVendorCodeValue] = useState('');
    const [isWarrantyValue, setIsWarrantyValue] = useState(false);
    const [warrantyDaysValue, setWarrantyDaysValue] = useState('0');
    const [zeroCostValue, setZeroCostValue] = useState('0');
    const [repairCostValue, setRepairCostValue] = useState('0');
    const [tradeCostValue, setTradeCostValue] = useState('0');
    const [repairMarginPercentageValue, setRepairMarginPercentageValue] = useState('50');
    const [tradeMarginPercentageValue, setTradeMarginPercentageValue] = useState('100');
    const [isRepairCostCountInPercentageValue, setIsRepairCostCountInPercentageValue] = useState(true);
    const [isTradeCostCountInPercentageValue, setIsTradeCostCountInPercentageValue] = useState(true);
    const [productCategorySelectValue, setProductCategorySelectValue] = useState({});

    useEffect(() => {
        if (show) {
            initData();
        }
    }, [show])

    useEffect(() => {
        if (isRepairCostCountInPercentageValue) {
            setRepairCostValue(countingCostWithMargin(repairMarginPercentageValue));
        }
        if (isTradeCostCountInPercentageValue) {
            setTradeCostValue(countingCostWithMargin(tradeMarginPercentageValue));
        }
    }, [zeroCostValue, repairMarginPercentageValue, tradeMarginPercentageValue,
        isRepairCostCountInPercentageValue, isTradeCostCountInPercentageValue])

    function initData() {
        $('.input-text.focus').focus();
    }

    function countingCostWithMargin(percentage) {
        let marginValue = zeroCostValue * (percentage / 100);
        let costWithMargin = parseFloat(zeroCostValue) + parseFloat(marginValue.toFixed(2));
        return costWithMargin.toString();
    }

    function onSubmit() {
        const product = {
            productCategory: productCategorySelectValue.value,
            name: nameValue,
            description: descriptionValue,
            code: codeValue,
            vendorCode: vendorCodeValue,
            isWarranty: isWarrantyValue,
            warrantyDays: isWarrantyValue ? warrantyDaysValue : '0',
            zeroCost: zeroCostValue,
            repairCost: repairCostValue,
            tradeCost: tradeCostValue,
        }
        console.log(product);
        createProduct(product);
        closeWindow();
        clearForm()
    }

    function clearForm() {
        setNameValue('');
        setDescriptionValue('');
        setCodeValue('');
        setVendorCodeValue('');
        setIsWarrantyValue(false);
        setWarrantyDaysValue('0');
        setZeroCostValue('0');
        setRepairCostValue('0');
        setTradeCostValue('0');
        setRepairMarginPercentageValue('50');
        setTradeMarginPercentageValue('100');
        setIsRepairCostCountInPercentageValue(true);
        setIsTradeCostCountInPercentageValue(true);
    }

    function createProduct(product) {
        axios.post('/products/create', product)
            .then((response) => {
                if (response.data === true) {
                    showMessage('Успешно создан', 'success')
                    onProductCreated();
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
        return isNameNotValid();
    }

    function isNameNotValid() {
        return nameValue.trim() === '';
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
                        {'Новый товар'}
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
                                                Наименование
                                                <b className={'red-star'}>*</b></Form.Label>
                                            <Form.Control type={'text'} className={'input-text focus'}
                                                          value={nameValue}
                                                          onChange={(e) =>
                                                              setNameValue(e.target.value)}/>
                                            {nameInvalidMessage()}
                                        </Form.Group>
                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                Категория товара
                                            </Form.Label>
                                            <ProductCategorySelect
                                                itemSelectValue={productCategorySelectValue}
                                                setItemSelectValue={setProductCategorySelectValue}
                                                showMessage={showMessage}
                                                show={show}/>
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
                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                Код</Form.Label>
                                            <Form.Control type={'text'} className={'input-text'}
                                                          value={codeValue}
                                                          onChange={(e) =>
                                                              setCodeValue(e.target.value)}/>
                                        </Form.Group>
                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                Артикул</Form.Label>
                                            <Form.Control type={'text'} className={'input-text'}
                                                          value={vendorCodeValue}
                                                          onChange={(e) =>
                                                              setVendorCodeValue(e.target.value)}/>
                                        </Form.Group>
                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label checkbox-label'}>
                                                <Form.Check type={'checkbox'} placeholder={"Поставщик"}>
                                                    <Form.Check.Input className={'checkbox warranty-checkbox-div'}
                                                                      checked={isWarrantyValue}
                                                                      onChange={(e) =>
                                                                          setIsWarrantyValue(e.target.checked)}/>
                                                </Form.Check>
                                                Гарантия
                                            </Form.Label>
                                            {isWarrantyValue &&
                                                <div className={'warranty-days-div'}>
                                                    <Form.Label className={'form-group-label warranty-days-label'}>
                                                        Дней: </Form.Label>
                                                    <Form.Control type={'number'} className={'input-text'}
                                                                  min="0.00" max="999999999999" step="1"
                                                                  value={warrantyDaysValue}
                                                                  onChange={(e) =>
                                                                      setWarrantyDaysValue(e.target.value)}/>
                                                </div>}
                                        </Form.Group>
                                        <h5 className={'form-group-tag'}>Наценка</h5>
                                        <hr/>
                                        <Form.Group className={"add-form-group margin-form-group"}>
                                            <div className={'margin-div'}>
                                                <Form.Label className={'form-group-label'}>
                                                    Себестоимость
                                                </Form.Label>
                                                <Form.Control type={"number"} className={'input-text input-cash'}
                                                              min="0.00" max="999999999999" step="1"
                                                              value={zeroCostValue}
                                                              onChange={(e) =>
                                                                  setZeroCostValue(e.target.value)}
                                                />
                                            </div>
                                            <div className={'margin-div-with-percentage'}>
                                                <Form.Label className={'form-group-label'}>
                                                    Ремонтная цена
                                                </Form.Label>
                                                <div className={'percentage-div'}>
                                                    <Form.Check type={'checkbox'} placeholder={"Поставщик"}>
                                                        <Form.Check.Input
                                                            className={'checkbox is-count-in-percentage-checkbox'}
                                                            checked={isRepairCostCountInPercentageValue}
                                                            onChange={(e) =>
                                                                setIsRepairCostCountInPercentageValue(e.target.checked)}/>
                                                    </Form.Check>
                                                    <Form.Label className={'form-group-label percentage-label'}>
                                                        %
                                                    </Form.Label>
                                                    <Form.Control type={"number"}
                                                                  disabled={!isRepairCostCountInPercentageValue}
                                                                  className={'input-text input-cash percentage'}
                                                                  min="0.00" max="10000" step="1"
                                                                  value={repairMarginPercentageValue}
                                                                  onChange={(e) =>
                                                                      setRepairMarginPercentageValue(e.target.value)}
                                                    />
                                                </div>
                                                <Form.Control type={"number"} className={'input-text input-cash'}
                                                              disabled={isRepairCostCountInPercentageValue}
                                                              min="0.00" max="999999999999" step="1"
                                                              value={repairCostValue}
                                                              onChange={(e) =>
                                                                  setRepairCostValue(e.target.value)}
                                                />
                                            </div>
                                            <div className={'margin-div-with-percentage'}>
                                                <Form.Label className={'form-group-label'}>
                                                    Розничная цена
                                                </Form.Label>
                                                <div className={'percentage-div'}>
                                                    <Form.Check type={'checkbox'} placeholder={"Поставщик"}>
                                                        <Form.Check.Input
                                                            className={'checkbox is-count-in-percentage-checkbox'}
                                                            checked={isTradeCostCountInPercentageValue}
                                                            onChange={(e) =>
                                                                setIsTradeCostCountInPercentageValue(e.target.checked)}/>
                                                    </Form.Check>
                                                    <Form.Label className={'form-group-label percentage-label'}>
                                                        %
                                                    </Form.Label>
                                                    <Form.Control type={"number"}
                                                                  disabled={!isTradeCostCountInPercentageValue}
                                                                  className={'input-text input-cash percentage'}
                                                                  min="0.00" max="10000" step="1"
                                                                  value={tradeMarginPercentageValue}
                                                                  onChange={(e) =>
                                                                      setTradeMarginPercentageValue(e.target.value)}
                                                    />
                                                </div>
                                                <Form.Control type={"number"} className={'input-text input-cash'}
                                                              disabled={isTradeCostCountInPercentageValue}
                                                              min="0.00" max="999999999999" step="1"
                                                              value={tradeCostValue}
                                                              onChange={(e) =>
                                                                  setTradeCostValue(e.target.value)}
                                                />
                                            </div>
                                        </Form.Group>
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