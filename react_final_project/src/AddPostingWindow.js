import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Scrollbars} from "react-custom-scrollbars";
import axios from "axios";
import $ from "jquery";
import ClientSelect from "./ClientSelect";
import EmployeeSelect from "./EmployeeSelect";
import RelocatableProductsTable from "./RelocatableProductsTable";

export default function AddPostingWindow({
                                             show, closeWindow, showMessage,
                                             onPostingCreated
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

    const [clientSelectValue, setClientSelectValue] = useState({});
    const [employeeSelectValue, setEmployeeSelectValue] = useState({});
    const [relocatableProducts, setRelocatableProducts] = useState([]);
    const [productSelectValue, setProductSelectValue] = useState({});
    const [postingAmountValue, setPostingAmountValue] = useState(0);

    const style = {
        postingAmountDiv: {
            display: 'flex',
            marginLeft: '10px'
        },
        postingAmountH4: {
            paddingTop: '22px',
            marginLeft: 'auto'
        },
        postingAmountCashCardDiv: {borderWidth: '4px'},
        postingAmountCashCardContainer: {
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
    },[relocatableProducts])

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

    function calculatePostingAmount() {
        let amount = 0;
        relocatableProducts.forEach((relocatableProduct) => {
            amount += Number(relocatableProduct.numberOf) * Number(relocatableProduct.productMaterial.zeroCost)
        })
        setPostingAmountValue(amount);
    }

    function onSubmit() {
        // const posting = {
        //     name: nameValue,
        //     description: descriptionValue,
        //     code: codeValue,
        //     vendorCode: vendorCodeValue,
        //     isWarranty: isWarrantyValue,
        //     warrantyDays: isWarrantyValue ? warrantyDaysValue : '0',
        //     zeroCost: zeroCostValue,
        //     repairCost: repairCostValue,
        //     tradeCost: tradeCostValue,
        // }
        // console.log(posting);
        // createPosting(posting);
        // closeWindow();
        // clearForm()
        console.log(isNumberOfProductsNotValid());
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

    function createPosting(posting) {
        axios.post('http://localhost:8080/postings/create', posting)
            .then((response) => {
                if (response.data === true) {
                    showMessage('Успешно создан', 'success')
                    onPostingCreated();
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
        return isSupplierNotValid() || isNumberOfProductsNotValid();
    }

    function isSupplierNotValid() {
        return clientSelectValue == null || !clientSelectValue.value;
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

    function supplierInvalidMessage() {
        if (isSupplierNotValid()) {
            return (
                <Form.Text className={'invalid-message'}>
                    Укажите поставщика!
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
                        {'Новое оприходование'}
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
                                                Поставщик
                                            </Form.Label>
                                            <ClientSelect
                                                clientSelectValue={clientSelectValue}
                                                setClientSelectValue={setClientSelectValue}
                                                showMessage={showMessage}
                                                show={show}
                                                isSupplier={true}
                                            />
                                            {supplierInvalidMessage()}
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
                                        <div style={style.postingAmountDiv}>
                                            <h4 style={style.postingAmountH4}>К оплате :</h4>
                                            <Card className={'amount-cash-card'} style={style.postingAmountCashCardDiv}>
                                                <Card.Body>
                                                    <Container className={'amount-cash-container'}
                                                               style={style.postingAmountCashCardContainer}>
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
        </>
    );
}