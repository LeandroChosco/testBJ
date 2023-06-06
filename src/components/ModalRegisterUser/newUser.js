import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";
import { useMutation, useQuery } from '@apollo/client'
import { REGISTER_USER, CREATE_POLICE } from '../../graphql/mutations'
import { TYPES_ROL } from '../../graphql/queries'
import { TOKEN_FIX } from '../../constants/token'

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

const ModalRegisterUser = ({ modal, hide, stateModal, clientId }) => {

  const token = TOKEN_FIX;

  const [registrationUser] = useMutation(REGISTER_USER)
  const [registrationPolice] = useMutation(CREATE_POLICE)

  const [isLegalAge, setIsLegalAge] = useState(true);
  const [rolId, setRolId] = useState(1)
  const [isLoading, setIsloading] = useState(false);

  const [dataForm, setDataForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "12345678",
    country_code: "+52",
    phone: "",
    legal_age: "",
    location: "",
    pin: "1234",
    profile_picture: null,
    cca2: "MX",
    is_web: true,
    isCustomRegistration: true,
    clientId: clientId,
    rol_id: "",
  });

  const [dataPolice, setDataPolice] = useState({
    usernumber: "",
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    cca2: "MX",
    country_code: "+52",
    clientId: clientId,
    usertypeId: 4
  })

  const getAllRoles = () => {
    let { data, loading } = useQuery(TYPES_ROL, {
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    })
    if (!loading && data) {
      return data.getUserTypes
    }
  }
  const allRoles = getAllRoles();


  const addUser = (event) => {
    event.preventDefault();
    if (rolId !== 4) {
      setIsloading(true);
      registrationUser({
        variables: {
          email: dataForm.email,
          password: dataForm.password,
          clientId: dataForm.clientId,
          phone: parseInt(dataForm.phone),
          country_code: dataForm.country_code,
          cca2: dataForm.cca2,
          location: "{\n  \"latitude\": \"" + dataForm.location.split(",")[0].trim() + "\",\n  \"longitude\": \"" + dataForm.location.split(",")[1].trim() + "\"\n}",
          firstname: dataForm.firstname,
          lastname: dataForm.lastname,
          rol_id: rolId,
          is_web: dataForm.is_web,
          isCustomRegistration: dataForm.isCustomRegistration,
          pin: dataForm.pin,
          legal_age: isLegalAge,
        },
        context: {
          headers: {
            "Authorization": token ? token : "",
          }
        },
      })
      .then(response => {
        if(response.data && response.data.registration.token){
          setTimeout(() => {
            setIsloading(false);
            ToastsStore.success("Usuario creado con éxito")
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
    } else {
      setIsloading(true);
      registrationPolice({
        variables: {
          usernumber: dataPolice.usernumber,
          firstname: dataPolice.firstname,
          lastname: dataPolice.lastname,
          email: dataPolice.email,
          password: dataPolice.password,
          phone: parseInt(dataPolice.phone),
          cca2: dataPolice.cca2,
          country_code: dataPolice.country_code,
          is_active: dataPolice.is_active,
          clientId: dataPolice.clientId,
          usertypeId: dataPolice.usertypeId,
        },
        context: {
          headers: {
            "Authorization": token ? token : "",
          }
        },
      })
      .then(response => {
        if(response.data && response.data.createPolice.token){
          setTimeout(() => {
            setIsloading(false);
            ToastsStore.success("Policía creado con éxito")
            stateModal(false);
          }, 2000);
        } else {
          setTimeout(() => {
            setIsloading(false);
            ToastsStore.error("No se pudo crear el policía. Intente más tarde o contáctese con soporte")
            stateModal(false);
          }, 2000);
        }
      })
      .catch(err => {
        console.log(err);
        setTimeout(() => {
          setIsloading(false);
          ToastsStore.error("Algo falló. Contáctese con soporte")
          stateModal(false);
        }, 2000);
      })
    }
  };

  const changeType = (event, data) => {
    if (data.value === "yes") {
      setIsLegalAge(true);
    }
    if (data.value === "no") {
      setIsLegalAge(false);
    }
  };

  const changeRol = (event, data) => {
    if (data) {
      setRolId(data.value)
    }
  }

  const changeInfo = (event, data) => {
    if (rolId !== 4) {
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
    } else {
      if (data) {
        setDataPolice({
          ...dataPolice,
          [data.name]: data.value,
        });
      } else {
        setDataPolice({
          ...dataPolice,
          [event.target.name]: event.target.value,
        });
      }
    }
  };

  return (
    <Modal size="md" backdrop={"static"} show={modal} onHide={hide}>
      <Modal.Header closeButton>
        <h3>Nuevo usuario</h3>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={addUser}>
          <Form.Field>
            <Form.Group style={{display: "grid"}}>
              <div>
                <Form.Field>
                  <label>Tipo de usuario</label>
                </Form.Field>
              </div>
              <div>
                {
                  allRoles && allRoles.map((el) => {
                    return (
                      <Form.Field>
                        <Form.Radio
                          label={el.name}
                          value={el.id}
                          checked={rolId === el.id}
                          onChange={changeRol}
                        />
                      </Form.Field>
                    )
                  })
                }
              </div>
            </Form.Group>
          </Form.Field>

          {rolId !== 4 ?
            <>
              <Form.Group inline>
                <Form.Field>
                  <label>Nombre</label>
                  <input
                    placeholder="Ingrese nombre..."
                    name="firstname"
                    type="text"
                    value={dataForm.firstname}
                    onChange={changeInfo}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Apellido</label>
                  <input
                    placeholder="Ingrese apellido..."
                    name="lastname"
                    type="text"
                    value={dataForm.lastname}
                    onChange={changeInfo}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Field>
                <label>Correo</label>
                <input
                  placeholder="Ingrese correo..."
                  name="email"
                  type="email"
                  value={dataForm.email}
                  onChange={changeInfo}
                />
              </Form.Field>
              <Form.Field>
                <label>Contraseña</label>
                <input
                  placeholder="Ingrese contraseña..."
                  name="password"
                  type="text"
                  value={dataForm.password}
                  onChange={changeInfo}
                />
              </Form.Field>
              <Form.Group inline>
                <Form.Field>
                  <label>LADA</label>
                  <input
                    placeholder="Ingrese LADA..."
                    name="country_code"
                    type="text"
                    value={dataForm.country_code}
                    onChange={changeInfo}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Celular</label>
                  <input
                    placeholder="Ingrese su celular..."
                    name="phone"
                    type="number"
                    value={dataForm.phone}
                    onChange={changeInfo}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field>
                  <label>Mayor de edad?</label>
                </Form.Field>
                <Form.Radio
                  label="Sí"
                  value="yes"
                  checked={isLegalAge}
                  onChange={changeType}
                />
                <Form.Radio
                  label="No"
                  value="no"
                  checked={!isLegalAge}
                  onChange={changeType}
                />
              </Form.Group>
              <Form.Field>
                <label>Ubicación</label>
                <input
                  placeholder="Ingrese su ubicación..."
                  name="location"
                  type="text"
                  value={dataForm.location}
                  onChange={changeInfo}
                />
              </Form.Field>
              <Form.Field>
                <label>Pin</label>
                <input
                  placeholder="Ingrese su pin..."
                  name="pin"
                  type="text"
                  value={dataForm.pin}
                  onChange={changeInfo}
                />
              </Form.Field>
              <div className="row">
                <Button
                  className="styleBtnAdd btn-block"
                  type="submit"
                  disabled={
                    dataForm.firstname === "" ||
                    dataForm.lastname === "" ||
                    dataForm.email === "" ||
                    dataForm.password === "" ||
                    dataForm.pin === ""
                  }
                >
                  AGREGAR USUARIO
                </Button>
              </div>
            </>
            :
            <>
              <Form.Field>
                <label>Número de patrulla</label>
                <input
                  placeholder="Ingrese número..."
                  name="usernumber"
                  type="number"
                  value={dataPolice.usernumber}
                  onChange={changeInfo}
                />
              </Form.Field>
              <Form.Group inline>
                <Form.Field>
                  <label>Nombre del policía</label>
                  <input
                    placeholder="Ingrese nombre..."
                    name="firstname"
                    type="text"
                    value={dataPolice.firstname}
                    onChange={changeInfo}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Apellido del policía</label>
                  <input
                    placeholder="Ingrese apellido..."
                    name="lastname"
                    type="text"
                    value={dataPolice.lastname}
                    onChange={changeInfo}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group inline>
                <Form.Field>
                  <label>Correo</label>
                  <input
                    placeholder="Ingrese correo..."
                    name="email"
                    type="email"
                    value={dataPolice.email}
                    onChange={changeInfo}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Contraseña</label>
                  <input
                    placeholder="Ingrese contraseña..."
                    name="password"
                    type="text"
                    value={dataPolice.password}
                    onChange={changeInfo}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group inline>
                <Form.Field>
                  <label>LADA</label>
                  <input
                    placeholder="Ingrese LADA..."
                    name="country_code"
                    type="text"
                    value={dataPolice.country_code}
                    onChange={changeInfo}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Teléfono</label>
                  <input
                    placeholder="Ingrese número de teléfono..."
                    name="phone"
                    type="number"
                    value={dataPolice.phone}
                    onChange={changeInfo}
                  />
                </Form.Field>
              </Form.Group>
              <div className="row">
                <Button
                  className="styleBtnAdd btn-block"
                  type="submit"
                  disabled={
                    dataPolice.usernumber === "" ||
                    dataPolice.firstname === "" ||
                    dataPolice.lastname === "" ||
                    dataPolice.email === "" ||
                    dataPolice.password === "" ||
                    dataPolice.phone === "" ||
                    dataPolice.cca2 === "" ||
                    dataPolice.country_code === "" ||
                    dataPolice.clientId === "" ||
                    dataPolice.usertypeId === ""
                  }
                >
                  AGREGAR USUARIO
                </Button>
              </div>
            </>
          }
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

export default ModalRegisterUser;
