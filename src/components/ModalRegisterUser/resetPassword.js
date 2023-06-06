import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Form, Button } from "semantic-ui-react";
import { TOKEN_FIX } from '../../constants/token';
import { RESET_PASSWORD } from "../../graphql/mutations";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";
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

const ModalResetPassword = ({ modal, hide, stateModal, data, clientId }) => {

  const token = TOKEN_FIX;

  const { user_email } = data
  const [isLoading, setIsloading] = useState(false);

  const [recovery] = useMutation(RESET_PASSWORD)

  const handleReset = () => {
    setIsloading(true);
    recovery({
      variables: {
        updateAuth: 1,
        clientId: clientId,
        emailorcellphone: user_email,
        password: "123456789",
        flagOldPassword: 0,
      },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      },
      onError: (error) => {
        console.log(error);
      }
    })
    .then(response => {
      if(response.data && response.data.recoveryPass.success){
        setTimeout(() => {
          setIsloading(false);
          ToastsStore.success(`Contraseña de ${user_email} reestablecida con éxito`);
          stateModal(false)
        }, 2000);
      } else {
        setTimeout(() => {
          setIsloading(false);
          ToastsStore.error(`No se pudo reestablecer la contraseña de ${user_email}. Intente nuevamente o contáctese con soporte`);
          stateModal(false)
        }, 2000);
      }
    })
    .catch(err => {
      console.log(err);
      setTimeout(() => {
        setIsloading(false);
        ToastsStore.error(`Algo falló. Contáctese con soporte`);
        stateModal(false)
      }, 2000);
    })
  }

  return (
    <Modal size="md" backdrop={"static"} show={modal} onHide={hide}>
      <Modal.Header closeButton>
        <h3>Reestablecer contraseña</h3>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Field>
            <label>Desea reestablecer la contraseña de este usuario?</label>
            <input
              placeholder="Ingrese correo..."
              name="email"
              type="email"
              value={user_email}
              readOnly
            />
          </Form.Field>
          <Form.Group inline>
            <Button onClick={() => stateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleReset}>
              Reestablecer
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

export default ModalResetPassword;
