import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";

// import { TOKEN_FIX } from '../../constants/token'
// import { DISABLE_USER } from "../../graphql/mutations";
// import { useMutation } from "@apollo/client";

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

const ModalChangePassword = ({ modal, hideModal, favicon }) => {

    // const token = TOKEN_FIX;
    // const { user_login, radar_id } = data

    const [dataForm, setDataForm] = useState({
        clientId: 1,
        email: "",
        password: "",
    })

    const [isLoading, setIsloading] = useState(false);
    // const [disable] = useMutation(DISABLE_USER)

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

    // const newPassword = () => {
    //     setDataForm({
    //         ...dataForm,
    //         password: btoa((Math.random() * 10000000).toString())
    //     })
    // }

    const handleReset = () => {
        setIsloading(true);
        // disable({
        //     variables: {
        //         userId: radar_id,
        //         rootUserId: 6099,
        //         is_web: true,
        //         clientId: clientId,
        //     },
        //     context: {
        //         headers: {
        //             "Authorization": token,
        //         }
        //     }
        // })
        setTimeout(() => {
            console.log("Enviando", dataForm)
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
                <div className="container-login100 cityBackground" style={{minHeight: "10rem", padding: "10rem"}}>
                    <div className="wrap-login100" style={{ alignItems: 'center', justifyContent: 'center', marginBottom: "5rem" }}>
                        <span className="login10-form-title p-b-34 p-t-27" style={{ color: 'white', padding: "1rem", marginBottom: "1rem" }}>
                            <h3>Ingrese:</h3>
                            <ul style={{marginBottom: "1rem"}}>
                                <li>
                                    <h5>
                                        - Usuario
                                    </h5>
                                </li>
                                <li>
                                    <h5>
                                        - Clave antigua
                                    </h5>
                                </li>
                                <li>
                                    <h5>
                                        - Clave nueva
                                    </h5>
                                </li>
                            </ul>
                        </span>
                        <br />
                        <Form onSubmit={handleReset}>
                            <Form.Field>
                                <label style={{color: "white"}}>Correo</label>
                                <input
                                    placeholder="Ingrese su correo..."
                                    name="email"
                                    type="email"
                                    value={dataForm.email}
                                    onChange={changeInfo}
                                    style={{marginBottom: "1rem"}}
                                    required
                                />
                            </Form.Field>
                            <Form.Field>
                                <label style={{color: "white"}}>Nueva clave</label>
                                <input
                                    placeholder="Ingrese su correo..."
                                    name="password"
                                    type="text"
                                    value={dataForm.password}
                                    onChange={changeInfo}
                                    style={{marginBottom: "1rem"}}
                                    required
                                />
                            </Form.Field>
                            <Button>
                                Cambiar clave
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