import React, {useEffect, useRef, useState} from 'react';

import axios from '../api/axios';
import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import '../css/Auth.css'
import {Scrollbars} from "react-custom-scrollbars";
import {Link, useLocation, useNavigate} from "react-router-dom";
import $ from 'jquery';
import useAuth from "../hooks/useAuth";

const LOGIN_URL = '/login';


const Login = () => {
    const {setAuth} = useAuth();
    const userRef = useRef();
    const errRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [show, setShow] = useState(true);

    useEffect(() => {
        $('.input-text.user-input').focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                {email, password},
                {
                    headers: {'Content-Type': 'application/json'},
                    auth: null
                }
            );
            if (response.status == 200) {
                const auth = {
                    email: email,
                    password: password
                };
                window.localStorage.setItem('auth', JSON.stringify(auth));
                setAuth(auth);
                axios.defaults.auth = {
                    username: email,
                    password: password
                }
                console.log(axios.defaults.auth)
                console.log(auth)
            }
            // const accessToken = response?.data?.accessToken;
            setEmail('');
            setPassword('');
            navigate(from, {replace: true});
        } catch (err) {
            if (!err?.response) {
                setErrMsg('Нет ответа от сервера');
            } else if (err.response?.status === 400) {
                setErrMsg('Отсутствует логин или пароль');
            } else if (err.response?.status === 401) {
                setErrMsg('Неверные данные входа');
            } else {
                setErrMsg('Ошибка входа');
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
                        Вход
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
                                            </Form.Label>
                                            <Form.Control type={"text"} className={'input-text user-input'}
                                                          value={email}
                                                          onChange={(e) => setEmail(e.target.value)}
                                                          aria-autocomplete={'none'}
                                                          aria-required={'true'}
                                            />
                                        </Form.Group>

                                        <Form.Group className={"add-form-group"}>
                                            <Form.Label className={'form-group-label'}>
                                                Пароль:
                                            </Form.Label>

                                            <Form.Control type={'password'} className={'input-text'}
                                                          id={'password'}
                                                          value={password}
                                                          onChange={(e) => setPassword(e.target.value)}
                                                          required
                                            />
                                        </Form.Group>
                                        <Button className={"add-form-button register"} variant={"primary"}
                                                type={"button"}
                                                onClick={handleSubmit}
                                        >
                                            Войти
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Scrollbars>

                            <Card.Footer className={"add-card-footer"}>
                                <p>
                                    Нет аккаунта?<br/>
                                    <span className="line">
                    <Link to="/register">Регистрация</Link>
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

export default Login