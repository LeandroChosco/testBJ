import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";

import "./style.css";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../graphql/mutations";
import { TOKEN_FIX } from '../../constants/token';

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

const ModalDetailUser = ({ modal, clientId, hide, stateModal, data }) => {

  const token = TOKEN_FIX;
  const { user_nicename, cellphone, radar_id, user_email } = data
  const [isLoading, setIsloading] = useState(false);
  const [dataForm, setDataForm] = useState({
    userId: radar_id,
    firstname: user_nicename.split(" ")[0],
    lastname: user_nicename.split(" ").length > 2 ? user_nicename.split(" ").slice(1).join(" ") : user_nicename.split(" ").length === 2 ? user_nicename.split(" ")[1] : "",
    country_code: cellphone ? cellphone.split("+52").length > 1 ? "+52" : "" : "",
    email: user_email,
    phone: cellphone ? cellphone.split("+52").length > 1 ? cellphone.split("+52")[1] : cellphone : "",
    cca2: "MX",
    profile_picture: null
  });

  const [update] = useMutation(UPDATE_USER);

  const updateUser = (event) => {
    event.preventDefault();
    setIsloading(true);
    update({
      variables: {
        clientId: clientId,
        userId: dataForm.userId,
        firstname: dataForm.firstname,
        lastname: dataForm.lastname,
        email: dataForm.email,
        phone: dataForm.phone,
        country_code: dataForm.country_code,
        cca2: dataForm.cca2,
        profile_picture: dataForm.profile_picture
      },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      },
    })
    .then(response => {
      if(response.data && response.data.updateUserData){
        setTimeout(() => {
          setIsloading(false);
          ToastsStore.success("Usuario modificado con éxito");
          stateModal(false);
        }, 2000);
      } else {
        setTimeout(() => {
          setIsloading(false);
          ToastsStore.error("No se pudo crear el usuario. Intente más tarde o contáctese con soporte");
          stateModal(false);
        }, 2000);
      }
    })
    .catch(err => {
      console.log(err);
      setTimeout(() => {
        setIsloading(false);
        ToastsStore.error("Algo falló. Contáctese con soporte");
        stateModal(false);
      }, 2000);
    })

    

  };

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
  };

  return (
    <Modal size="md" backdrop={"static"} show={modal} onHide={hide}>
      <Modal.Header closeButton>
        <h3>Editar usuario</h3>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={updateUser}>
          <Form.Group inline>
            <Form.Field>
              <label>Nombre</label>
              <input
                placeholder="Ingrese nombre..."
                name="firstname"
                type="text"
                onChange={changeInfo}
                value={dataForm.firstname}
              />
            </Form.Field>
            <Form.Field>
              <label>Apellido</label>
              <input
                placeholder="Ingrese apellido..."
                name="lastname"
                type="text"
                onChange={changeInfo}
                value={dataForm.lastname}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group inline>
            <Form.Field>
              <label>LADA</label>
              <input
                placeholder="Ingrese LADA..."
                name="country_code"
                type="number"
                onChange={changeInfo}
                value={dataForm.country_code}
              />
            </Form.Field>
            <Form.Field>
              <label>Celular</label>
              <input
                placeholder="Ingrese su celular..."
                name="phone"
                type="number"
                onChange={changeInfo}
                value={dataForm.phone}
              />
            </Form.Field>
          </Form.Group>
          <div className="row">
            <Button
              className="styleBtnAdd btn-block"
              type="submit"
              disabled={
                dataForm.firstname === "" ||
                dataForm.lastname === "" ||
                dataForm.email === ""
              }
            >
              CONFIRMAR CAMBIOS
            </Button>
          </div>
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

export default ModalDetailUser;
