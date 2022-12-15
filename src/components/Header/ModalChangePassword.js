import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";

import Conections from "../../conections";
import constants from '../../constants/constants';

import { SAILS_ACCESS_TOKEN } from '../../constants/token';

import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD } from "../../graphql/mutations";

import "./style.css";

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

const ModalChangePassword = ({ modal, hideModal }) => {

    // const token = TOKEN_FIX;
    // const { user_login, radar_id } = data

    const token = localStorage.getItem(SAILS_ACCESS_TOKEN) ? localStorage.getItem(SAILS_ACCESS_TOKEN) : "";
    const user_mail = JSON.parse(sessionStorage.getItem("isAuthenticated")).userInfo.user_email ? JSON.parse(sessionStorage.getItem("isAuthenticated")).userInfo.user_email : "";

    const [dataForm, setDataForm] = useState({
        clientId: "",
        email: user_mail,
        password: "",
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

        changePassword({
            variables: {
                clientId: dataForm.clientId,
                email: dataForm.email,
                password: dataForm.password ,
            },
            context: {
                headers: {
                    "Authorization": token,
                }
            }
        })
        setTimeout(() => {
            setIsloading(false)
            ToastsStore.success(`Contraseña cambiada con éxito`)
            hideModal()
        }, 2000);
    }

    return (
        <div>
            <Modal size="lg" backdrop={"static"} show={modal} onHide={hideModal}>
                <Modal.Header closeButton>
                    <h3>Cambiar contraseña</h3>
                </Modal.Header>
                <div className="container-login100 cityBackground" style={{ minHeight: "10rem", padding: "10rem" }}>
                    <div className="wrap-login100" style={{ alignItems: 'center', justifyContent: 'center', marginBottom: "5rem" }}>
                        <span className="login10-form-title p-b-34 p-t-27" style={{ color: 'white', padding: "1rem", marginBottom: "1rem" }}>
                            <h3>Ingrese su nueva contraseña. La misma debe:</h3>
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
                                <label style={{ color: "white" }}>Nueva contraseña</label>
                                <input
                                    placeholder="Ingrese su nueva contraseña..."
                                    name="password"
                                    type="text"
                                    value={dataForm.password}
                                    onChange={changeInfo}
                                    style={{ marginBottom: "1rem" }}
                                    required
                                />
                            </Form.Field>
                            <Button
                            disabled={
                                dataForm.password.length < 7
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
            </Modal>
        </div>
    );
};

export default ModalChangePassword;