import React, {useEffect, useRef, useState} from "react";
import {faCheck, faInfoCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import '../css/Auth.css'
import {Scrollbars} from "react-custom-scrollbars";
import {Link, useNavigate} from "react-router-dom";
import $ from 'jquery';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
    const errRef = useRef();

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [success, setSuccess] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    const [show, setShow] = useState(true);

    useEffect(() => {
        $('.input-text.user-input').focus();
    }, [])

    useEffect(() => {
        setValidName(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword])

    useEffect(() => {
        setErrMsg('');
    }, [email, password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const value1 = EMAIL_REGEX.test(email);
        const value2 = PASSWORD_REGEX.test(password);
        if (!value1 || !value2) {
            setErrMsg("Не верный ввод");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                {email, password},
                {
                    headers: {'Content-Type': 'application/json'},
                }
            );
            if (response.status == 200) {
                console.log('Register 200!')
                navigate("/login", {replace: true});
            }

            setEmail('');
            setPassword('');
            setMatchPassword('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('Нет ответа от сервера');
            } else if (err.response?.status === 409) {
                setErrMsg('Email уже используется');
            } else {
                setErrMsg('Ошибка Регистрации')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            <Modal
                show={show}
                onHide={() => {
                }}
                dialogClassName="add-modal-dialog"
                contentClassName={"add-modal-content"}
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header>
                    <Modal.Title>
                        Регистрация
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}
                           aria-live="assertive">{errMsg}</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={"add-modal-body"}>
                    <Container className={"add-container"}>
                        <Card className={"add-card"}>
                            <Scrollbars style={{width: "100%", height: "100%"}}>
                                <Card.Body className={"add-card-body"}>
                                    <Form className={"add-form"}>
                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                Email:
                                                <FontAwesomeIcon icon={faCheck}
                                                                 className={validName ? "valid" : "hide"}/>
                                                <FontAwesomeIcon icon={faTimes}
                                                                 className={validName || !email ? "hide" : "invalid"}/></Form.Label>

                                            <Form.Control type={"text"} className={'input-text user-input'}
                                                          value={email}
                                                          onChange={(e) => setEmail(e.target.value)}
                                                          aria-autocomplete={'none'}
                                                          aria-required={'true'}
                                                          aria-invalid={validName ? 'false' : 'true'}
                                                          aria-describedby="uidnote"
                                                          onFocus={() => setUserFocus(true)}
                                                          onBlur={() => setUserFocus(false)}
                                            />
                                        </Form.Group>
                                        <p id="uidnote"
                                           className={userFocus && email && !validName ? "instructions" : "offscreen"}>
                                            <FontAwesomeIcon icon={faInfoCircle}/>
                                            Введите достоверный email
                                        </p>

                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                Пароль:
                                                <FontAwesomeIcon icon={faCheck}
                                                                 className={validPassword ? "valid" : "hide"}/>
                                                <FontAwesomeIcon icon={faTimes}
                                                                 className={validPassword || !password ? "hide" : "invalid"}/>
                                            </Form.Label>

                                            <Form.Control type={'password'} className={'input-text'}
                                                          id={'password'}
                                                          value={password}
                                                          onChange={(e) => setPassword(e.target.value)}
                                                          required
                                                          aria-invalid={validPassword ? "false" : "true"}
                                                          aria-describedby="pwdnote"
                                                          onFocus={() => setPasswordFocus(true)}
                                                          onBlur={() => setPasswordFocus(false)}
                                            />
                                        </Form.Group>
                                        <p id="pwdnote"
                                           className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                                            <FontAwesomeIcon icon={faInfoCircle}/>
                                            от 8 до 24 символов.<br/>
                                            Должен содердать заглавные и прописные буквы, числа и специальные
                                            символы.<br/>
                                            Разрешены специальные символы: <span
                                            aria-label="exclamation mark">!</span>
                                            <span
                                                aria-label="at symbol">@</span> <span
                                            aria-label="hashtag">#</span>
                                            <span
                                                aria-label="dollar sign">$</span> <span
                                            aria-label="percent">%</span>
                                        </p>

                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                Подтверждение пароля:
                                                <FontAwesomeIcon icon={faCheck}
                                                                 className={validMatch && matchPassword ? "valid" : "hide"}/>
                                                <FontAwesomeIcon icon={faTimes}
                                                                 className={validMatch || !matchPassword ? "hide" : "invalid"}/>
                                            </Form.Label>

                                            <Form.Control type={'password'} className={'input-text'}
                                                          id={'confirm_pwd'}
                                                          onChange={(e) => setMatchPassword(e.target.value)}
                                                          value={matchPassword}
                                                          required
                                                          aria-invalid={validMatch ? "false" : "true"}
                                                          aria-describedby="confirmnote"
                                                          onFocus={() => setMatchFocus(true)}
                                                          onBlur={() => setMatchFocus(false)}
                                            />
                                        </Form.Group>
                                        <p id="confirmnote"
                                           className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                            <FontAwesomeIcon icon={faInfoCircle}/>
                                            Должен совпадать с введенным выше паролем.
                                        </p>

                                        <Button className={"add-form-button register"} variant={"secondary"}
                                                type={"button"}
                                                disabled={!validName || !validPassword || !validMatch}
                                                onClick={handleSubmit}
                                        >
                                            Зарегестрироваться
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Scrollbars>
                            <Card.Footer className={"add-card-footer"}>
                                <p>
                                    Уже зарегестрированы?<br/>
                                    <span className="line">
                                            <Link to="/login">Войти</Link>
                                        </span>
                                </p>
                                <p>
                                    <span className="line">
                    <Link to="/">На главную</Link>
                    </span>
                                </p>
                            </Card.Footer>
                        </Card>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Register