import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";

import { TOKEN_FIX } from '../../constants/token'
import { DISABLE_USER } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";

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

const ModalDeleteUser = ({ modal, hide, stateModal, data, clientId }) => {
 
    const token = TOKEN_FIX;
    const { user_login, radar_id } = data

    const [isLoading, setIsloading] = useState(false);
    const [disable] = useMutation(DISABLE_USER)

    const handleDelete = () => {
        setIsloading(true);
        disable({
            variables: {
                userId: radar_id,
                rootUserId: 1,
                is_web: true,
                clientId: clientId,
            },
            context: {
                headers: {
                    "Authorization": token,
                }
            }
        })
        setTimeout(() => {
            setIsloading(false)
            ToastsStore.warning(`Usuario ${user_login} bloqueado con éxito`)
            stateModal(false)
        }, 2000);
    }

    return (
        <Modal size="md" backdrop={"static"} show={modal} onHide={hide}>
            <Modal.Header closeButton>
                <h3>Bloquear usuario</h3>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Field>
                        <label>Está seguro que desea bloquear a este usuario?</label>
                        <input
                            placeholder="Ingrese nombre..."
                            name="firstname"
                            type="text"
                            value={user_login}
                            readOnly
                        />
                    </Form.Field>
                    <Form.Group inline>
                        <Button onClick={() => stateModal(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleDelete}>
                            Borrar
                        </Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            {isLoading && (
                <div style={styles.spinner}>
                    <CircleSpinner size={30} color="#D7DBDD" loading={isLoading} />
                </div>
            )}
        </Modal>
    );
};

export default ModalDeleteUser;
