import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore, ToastsContainer } from "react-toasts";

import CryptoJS from 'crypto-js'

import Conections from "../../conections";
import constants from '../../constants/constants';

import { REACT_APP_ENCRYPT_KEY } from "../../env";
import { SAILS_ACCESS_TOKEN } from '../../constants/token';

import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD } from "../../graphql/mutations";

import logo from "../../assets/images/logo.jpeg"

const styles = {
    spinner: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
    },
};

export default function ResetPassword() {


    const token = localStorage.getItem(SAILS_ACCESS_TOKEN) ? localStorage.getItem(SAILS_ACCESS_TOKEN) : "";

    const [dataForm, setDataForm] = useState({
        clientId: "",
        email: "",
        password: "",
        flag_recovery: 1,
        old_password: "",
        check_password: "",
    })

    const [isLoading, setIsloading] = useState(false);
    const [changePassword] = useMutation(CHANGE_PASSWORD)

    if (dataForm.clientId === "") {
        Conections.getClients().then(res => {
            const client = res.data.data.getClients.filter(c => c.name === constants.client);
            setDataForm({
                ...dataForm,
                clientId: client[0].id,
            })
        })
    }

    const changeInfo = (event, data) => {
        if (data) {
            setDataForm({
                ...dataForm,
                [data.name]: data.value,
            });
        } else {
            setDataForm({
                ...dataForm,
                [event.target.name]: event.target.value,
            });
        }
    }

    const handleReset = () => {

        setIsloading(true);
        let oldHashPass = CryptoJS.AES.encrypt(dataForm.old_password, REACT_APP_ENCRYPT_KEY).toString();
        let hashPass = CryptoJS.AES.encrypt(dataForm.password, REACT_APP_ENCRYPT_KEY).toString();

        changePassword({
            variables: {
                clientId: dataForm.clientId,
                email: dataForm.email,
                password: hashPass,
                flag_recovery: dataForm.flag_recovery,
                old_password: oldHashPass,
            },
            context: {
                headers: {
                    "Authorization": token,
                }
            }
        }).then(response => {
            if (response.data.recoveryPassWeb.success) {
                setTimeout(() => {
                    setIsloading(false)
                    ToastsStore.success(`Contraseña cambiada con éxito.`)
                }, 2000);

                setTimeout(() => {
                    ToastsStore.success(`Será redirigido al login en 5 segundos...`)
                }, 4000);

                setTimeout(() => {
                    window.location.href = window.location.href.replace(window.location.pathname, '/login')
                }, 9000);

            } else {
                setTimeout(() => {
                    setIsloading(false)
                    ToastsStore.error(`Algo salió mal! Intente nuevamente o contáctese con soporte.`)
                }, 2000);
            }

        })
            .catch(error => {
                console.log(error)
                setTimeout(() => {
                    setIsloading(false)
                    ToastsStore.error(`Datos incorrectos. Verifique los campos por favor.`)
                }, 2000);
            })
    }

    return (
        <div className="container-login100 cityBackground">
            <ToastsContainer store={ToastsStore} />
                <div className="wrap-login100" style={{ alignItems: 'center', justifyContent: 'center', marginBottom: "3rem", marginTop: "2rem" }}>
                    <span className="login100-form-logo">
                        <img
                            src={logo}
                            style={{ width: "100%", borderRadius: "50%" }}
                            alt={constants.client}
                        />
                    </span>
                    <span className="login10-form-title p-b-34 p-t-27" style={{ color: 'white', padding: "1rem", marginBottom: "1rem" }}>
                        <h3>Ingrese la contraseña que fue enviada a su correo electrónico y su nueva contraseña. La misma debe:</h3>
                        <ul style={{ marginBottom: "1rem" }}>
                            <li>
                                <h5>
                                    - Contener al menos 7 caracteres.
                                </h5>
                            </li>
                            <li>
                                <h5>
                                    - Ser fácil de recordar.
                                </h5>
                            </li>
                        </ul>
                    </span>
                    <br />
                    <Form onSubmit={handleReset}>
                        <Form.Field>
                            <label style={{ color: "white" }}>Correo</label>
                            <input
                                placeholder="Ingrese su correo..."
                                name="email"
                                type="text"
                                value={dataForm.email}
                                onChange={changeInfo}
                                style={{ marginBottom: "1rem" }}
                                required
                            />
                        </Form.Field>
                        <Form.Field>
                            <label style={{ color: "white" }}>Contraseña actual</label>
                            <input
                                placeholder="Ingrese su contraseña actual..."
                                name="old_password"
                                type="password"
                                value={dataForm.old_password}
                                onChange={changeInfo}
                                style={{ marginBottom: "1rem" }}
                                required
                            />
                        </Form.Field>
                        <Form.Field>
                            <label style={{ color: "white" }}>Nueva contraseña</label>
                            <input
                                placeholder="Ingrese su nueva contraseña..."
                                name="password"
                                type="password"
                                value={dataForm.password}
                                onChange={changeInfo}
                                style={{ marginBottom: "1rem" }}
                                required
                            />
                        </Form.Field>
                        <Form.Field>
                            <label style={{ color: "white" }}>Confirmar contraseña</label>
                            <input
                                placeholder="Confirme su contraseña..."
                                name="check_password"
                                type="password"
                                value={dataForm.check_password}
                                onChange={changeInfo}
                                style={{ marginBottom: "1rem" }}
                                required
                            />
                        </Form.Field>
                        <Button
                            disabled={
                                dataForm.old_password === "" ||
                                dataForm.old_password.length < 7 ||
                                dataForm.password.length < 7 ||
                                dataForm.password !== dataForm.check_password
                            }
                        >
                            Cambiar contraseña
                        </Button>
                    </Form>
                </div>
                {isLoading && (
                    <div style={styles.spinner}>
                        <CircleSpinner size={30} color="#D7DBDD" loading={isLoading} />
                    </div>
                )}
        </div>
    )
}