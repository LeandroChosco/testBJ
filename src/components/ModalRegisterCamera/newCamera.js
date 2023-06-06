import React, { useEffect, useState } from "react";
import { Modal, Col } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";
import { CAMERA_USER } from '../../graphql/mutations'
import { useMutation } from '@apollo/client'
import { RADAR_ID, TOKEN_FIX } from '../../constants/token'
import { allQueries } from "./queries";


import "./style.css";
import Actions from "./Actions";
import conections from "../../conections";

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
const ModalRegisterCamera = ({ modal, clientId, hide, stateModal, modalInputs }) => {

  const token = TOKEN_FIX;

  let userId = parseInt(localStorage.getItem(RADAR_ID));

  const [registration] = useMutation(CAMERA_USER);
  const [updateData, setUpdateData] = useState(0);
  const [updateIp, setUpdateIp] = useState(0)
  //////
  const [updateCarrier, setUpdateCarrier] = useState(0);
  //////
  const [pageModal, setPageModal] = useState(1)

  const [isLoading, setIsloading] = useState(false);
  const [isAmazonStream, setIsAmazonStream] = useState(0);
  const [isLPR, setIsLPR] = useState(0);
  const [isMic, setIsMic] = useState(0);

  const [showModal, setShowModal, hideModalCameraInputs] = modalInputs;
  const [typeModal, setTypeModal] = useState("");

  const [dataForm, setDataForm] = useState({
    google_cordenate: "",
    num_cam: "",
    dns_ip: "",
    cam_user: "",
    cam_pass: "",
    street: "",
    number: "",
    township: "",
    town: "",
    state: "",
    cat_carrier_id: 0,
    ssid_name: "",
    password: "",
    between_streets: "",
    model_id: 3,
    zip: "",
    userId: "",
    url_id: "",
    stream_id: "",
    storage_id: "",
    amazon_stream: 1,
    amazon_arn_channel: null,
    amazon_region: null,
    update_data: 0,
    id_camara: 0,
    is_lpr: 0,
    is_mic: 0,
  });

  const [dataToShow, setDataToShow] = useState({
    url_name: "",
    stream_name: "",
    storage_name: "",
    user_name: "",
    cat_address_name: "",
  })

  const actions = (cell, row, rowIndex, formatExtraData) => {
    return (
      <Actions setters={[setDataForm, setUpdateCarrier, setIsAmazonStream, setDataToShow, setShowModal, setTypeModal, isLPR, isMic, setIsLPR, setIsMic]} data={[row, dataForm, dataToShow]} />
    )
  }

  const columnsDns = [{
    dataField: "id",
    text: 'ID',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "dns",
    text: 'IP cámara',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }];

  const columnsCarrier = [{
    dataField: "carrier",
    text: 'Nombre Carrier',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "description",
    text: 'Descripción',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "active",
    text: 'Activa?',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }]

  const columnsApi = [{
    dataField: "name_instance",
    text: 'Nombre',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "dns_ip",
    text: 'DNS',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "active",
    text: 'Activa?',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "type",
    text: 'Tipo',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }]

  const columnsStream = [{
    dataField: "name",
    text: 'Nombre',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "ip_url_ms",
    text: 'DNS',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "active",
    text: 'Activa?',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }]

  const columnsStorage = [{
    dataField: "ip_url",
    text: 'IP',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "bucket_bold",
    text: 'Bucket',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "client_bucket_bold",
    text: 'Cliente',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }]

  const columnsZip = [{
    dataField: "d_cp",
    text: 'Código Postal',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "d_estado",
    text: 'Estado',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "d_ciudad",
    text: 'Ciudad',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }];

  const columnsUsers = [{
    dataField: "user_nicename",
    text: 'NOMBRE',
    filter: textFilter({
      placeholder: 'Buscar por nombre'
    })
  }, {
    dataField: "user_login",
    text: 'USER',
    filter: textFilter({
      placeholder: 'Buscar por user'
    })
  }, {
    dataField: "user_email",
    text: 'EMAIL',
    filter: textFilter({
      placeholder: 'Buscar por correo'
    })
  }, {
    dataField: "cellphone",
    text: 'TELÉFONO',
    filter: textFilter({
      placeholder: 'Buscar por teléfono'
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }];


  const [allCamerasToServers, setAllCamerasToServers] = useState(null);

  const allCatAddress = allQueries.getCatAddress(token);
  const allUsers = allQueries.getAllUsers(clientId, token);
  const allBrand = allQueries.getAllBrand(token);
  const allApiUrl = allQueries.getApiUrl(token);
  const streamUrl = allQueries.getStreamUrl(token);
  const storageUrl = allQueries.getStorageUrl(token);
  const carrier = allQueries.getCarrier(token);


  const changeUpdate = (event, data) => {
    if (data) {
      setUpdateData(data.value)
    }
    if (data.value === 0) {
      handleReset()
    }
    if (data.value === 1) {
      setDataForm({
        ...dataForm,
        update_data: 1
      })
    }
  }

  const changeIp = (event, data) => {
    if (data) {
      setUpdateIp(data.value)
    }
    if (data.value === 0) {
      setDataForm({
        ...dataForm,
        dns_ip: "Buscar"
      })
    }
    if (data.value === 1 && dataForm.dns_ip === "Buscar") {
      setDataForm({
        ...dataForm,
        dns_ip: ""
      })
    }
  }

  const changeCarrier = (event, data) => {
    if (data) {
      setUpdateCarrier(data.value)
    }
    if (data.value === 0) {
      setDataForm({
        ...dataForm,
        cat_carrier_id: 0,
      })
    }
  }

  const changeType = (event, data) => {
    if (data.value === 1) {
      setIsAmazonStream(1);
    }
    if (data.value === 0) {
      setIsAmazonStream(0);
      setDataForm({
        ...dataForm,
        amazon_arn_channel: "",
        amazon_region: "",
      })
    };
  }


  const changeLPR = (event, data) => {
    if (data.value === 1) {
      setIsLPR(1)
      setDataForm({
        ...dataForm,
        is_lpr: 1,
      })
    }
    if (data.value === 0) {
      setIsLPR(0)
      setDataForm({
        ...dataForm,
        is_lpr: 0,
      })
    };
  }

  const changeMic = (event, data) => {
    if (data.value === 1) {
      setIsMic(1)
      setDataForm({
        ...dataForm,
        is_mic: 1,
      })
    }
    if (data.value === 0) {
      setIsMic(0)
      setDataForm({
        ...dataForm,
        is_mic: 0,
      })
    };
  }

  const addCamera = (event) => {
    event.preventDefault();
    let data = {
      google_cordenate: dataForm.google_cordenate,
      num_cam: parseInt(dataForm.num_cam),
      dns_ip: dataForm.dns_ip,
      cam_user: dataForm.cam_user,
      cam_pass: dataForm.cam_pass,
      street: dataForm.street,
      number: dataForm.number,
      township: dataForm.township,
      town: dataForm.town,
      state: dataForm.state,
      cat_carrier_id: parseInt(dataForm.cat_carrier_id),
      ssid_name: dataForm.ssid_name,
      password: dataForm.password,
      between_streets: dataForm.between_streets,
      model_id: parseInt(dataForm.model_id),
      zip: dataForm.zip,
      userId: dataForm.userId,
      url_id: dataForm.url_id,
      stream_id: dataForm.stream_id,
      storage_id: dataForm.storage_id,
      amazon_stream: parseInt(isAmazonStream),
      amazon_arn_channel: dataForm.amazon_arn_channel,
      amazon_region: dataForm.amazon_region,
      update_data: updateData,
      id_camara: dataForm.id_camara,
    };

    setIsloading(true);
    if (dataForm.zip === "-") {
      registration({
        variables: {
          google_cordenate: dataForm.google_cordenate,
          num_cam: parseInt(dataForm.num_cam),
          dns_ip: dataForm.dns_ip,
          cam_user: dataForm.cam_user !== "" ? dataForm.cam_user : "admin",
          cam_pass: dataForm.cam_pass !== "" ? dataForm.cam_pass : "ENGTK2010!",
          street: dataForm.street,
          number: dataForm.number.toString(),
          township: dataForm.township,
          town: dataForm.town,
          state: dataForm.state,
          cat_carrier_id: parseInt(dataForm.cat_carrier_id),
          ssid_name: dataForm.ssid_name,
          password: dataForm.password,
          between_streets: dataForm.between_streets,
          model_id: parseInt(dataForm.model_id),
          userId: userId,
          // url_id: dataForm.url_id,
          stream_id: dataForm.stream_id,
          storage_id: dataForm.storage_id,
          amazon_stream: parseInt(isAmazonStream),
          amazon_arn_channel: dataForm.amazon_arn_channel,
          amazon_region: dataForm.amazon_region,
          update_data: updateData,
          id_camara: dataForm.id_camara,
          is_lpr: parseInt(dataForm.is_lpr),
          is_mic: parseInt(dataForm.is_mic),
        },
        context: {
          headers: {
            "Authorization": token ? token : "",
          }
        },
      }).then(response => {
        if (response.data && response.data.registerUserCameraWeb.success) {
          setTimeout(() => {
            setIsloading(false);
            ToastsStore.success("Cámara actualizada con éxito");
            stateModal(false);
          }, 2000);
        } else {
          setTimeout(() => {
            setIsloading(false);
            ToastsStore.error("No se pudo actualizar la cámara");
            stateModal(false);
          }, 2000);
        }
      }).catch(err => {
        console.log(err);
        setTimeout(() => {
          setIsloading(false);
          ToastsStore.error("Algo falló. Comuníquese con soporte");
          stateModal(false);
        }, 2000);
      });
    } else {
      registration({
        variables: {
          google_cordenate: dataForm.google_cordenate,
          num_cam: parseInt(dataForm.num_cam),
          dns_ip: dataForm.dns_ip,
          cam_user: dataForm.cam_user !== "" ? dataForm.cam_user : "admin",
          cam_pass: dataForm.cam_pass !== "" ? dataForm.cam_pass : "ENGTK2010!",
          street: dataForm.street,
          number: dataForm.number.toString(),
          township: dataForm.township,
          town: dataForm.town,
          state: dataForm.state,
          cat_carrier_id: parseInt(dataForm.cat_carrier_id),
          ssid_name: dataForm.ssid_name,
          password: dataForm.password,
          between_streets: dataForm.between_streets,
          model_id: parseInt(dataForm.model_id),
          zip: dataForm.zip,
          userId: dataForm.userId,
          url_id: dataForm.url_id,
          stream_id: dataForm.stream_id,
          storage_id: dataForm.storage_id,
          amazon_stream: parseInt(isAmazonStream),
          amazon_arn_channel: dataForm.amazon_arn_channel,
          amazon_region: dataForm.amazon_region,
          update_data: updateData,
          id_camara: dataForm.id_camara,
          is_lpr: parseInt(dataForm.is_lpr),
          is_mic: parseInt(dataForm.is_mic),
        },
        context: {
          headers: {
            "Authorization": token ? token : "",
          }
        },
      }).then(response => {
        if (response.data && response.data.registerUserCameraWeb.success) {
          setTimeout(() => {
            setIsloading(false);
            ToastsStore.success("Cámara agregada con éxito");
            stateModal(false);
          }, 2000);
        } else if (response.data.registerUserCameraWeb.error === "el numero de la camara ya existe") {
          setTimeout(() => {
            setIsloading(false);
            ToastsStore.error("Ya existe una cámara con ese número. Pruebe con otro número");
            stateModal(false);
          }, 2000);
        } else {
          setTimeout(() => {
            setIsloading(false);
            ToastsStore.error("No se pudo agregar la cámara");
            stateModal(false);
          }, 2000);
        }
      }).catch(err => {
        console.log(err);
        setTimeout(() => {
          setIsloading(false);
          ToastsStore.error("Algo falló. Comuníquese con soporte");
          stateModal(false);
        }, 2000);
      });
    };
  };

  const handleSelect = (e) => {
    e.preventDefault();
    setShowModal(true);
    setTypeModal(e.target.name);
  };

  const handleReset = () => {
    setDataForm({
      google_cordenate: "",
      num_cam: "",
      dns_ip: "",
      cam_user: "",
      cam_pass: "",
      street: "",
      number: "",
      township: "",
      town: "",
      state: "",
      cat_carrier_id: 0,
      ssid_name: "",
      password: "",
      between_streets: "",
      model_id: 3,
      zip: "",
      userId: "",
      url_id: "",
      stream_id: "",
      storage_id: "",
      amazon_stream: 1,
      amazon_arn_channel: null,
      amazon_region: null,
      update_data: 0,
      id_camara: 0,
      is_lpr: 0,
      is_mic: 0,
    })
    setDataToShow({
      url_name: "",
      stream_name: "",
      storage_name: "",
      user_name: "",
      cat_address_name: "",
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
  };

  const previousPage = (e) => {
    e.preventDefault();
    setPageModal(pageModal - 1);
  }

  const nextPage = (e) => {
    e.preventDefault();
    setPageModal(pageModal + 1);
  }

  useEffect(() => {
    conections.getAllCams().then(response => {
      setAllCamerasToServers(response.data);
    })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <Modal size="lg" backdrop={"static"} show={modal} onHide={hide}>
      <Modal.Header closeButton>
        <h3>Nueva cámara</h3>
      </Modal.Header>
      <Modal.Body className="styleContent" style={{ height: "27rem" }}>
        <Form onSubmit={addCamera}>
          {
            updateData === 1 && typeModal === "dns_ip" ?
              <Modal size="xl" backdrop={"static"} show={showModal} onHide={hideModalCameraInputs} centered={true}>
                <Modal.Header closeButton>
                  <h3>Elija IP</h3>
                </Modal.Header>
                <Modal.Body style={{ padding: !allCamerasToServers && "4rem" }}>
                  {
                    allCamerasToServers ?
                      <BootstrapTable className="styleTable" hover="true" keyField='id' data={allCamerasToServers} columns={columnsDns} filter={filterFactory()} pagination={paginationFactory()} />
                      :
                      <div style={styles.spinner}>
                        <CircleSpinner size={30} color="#D7DBDD" loading={!allCamerasToServers} />
                      </div>
                  }
                </Modal.Body>
              </Modal>
              :
              updateCarrier === 1 && typeModal === "carrier" ?
                <Modal size="xl" backdrop={"static"} show={showModal} onHide={hideModalCameraInputs} centered={true}>
                  <Modal.Header closeButton>
                    <h3>Elija Carrier</h3>
                  </Modal.Header>
                  <Modal.Body>
                    <BootstrapTable className="styleTable" hover="true" keyField='id' data={carrier ? carrier : []} columns={columnsCarrier} filter={filterFactory()} pagination={paginationFactory()} />
                  </Modal.Body>
                </Modal>
                :
                typeModal === "apiName" ?
                  <Modal size="xl" backdrop={"static"} show={showModal} onHide={hideModalCameraInputs} centered={true}>
                    <Modal.Header closeButton>
                      <h3>Elija API</h3>
                    </Modal.Header>
                    <Modal.Body>
                      <BootstrapTable className="styleTable" hover="true" keyField='id' data={allApiUrl ? allApiUrl : []} columns={columnsApi} filter={filterFactory()} pagination={paginationFactory()} />
                    </Modal.Body>
                  </Modal>
                  :
                  typeModal === "dnsStream" ?
                    <Modal size="xl" backdrop={"static"} show={showModal} onHide={hideModalCameraInputs} centered={true}>
                      <Modal.Header closeButton>
                        <h3>Elija Stream</h3>
                      </Modal.Header>
                      <Modal.Body>
                        <BootstrapTable className="styleTable" hover="true" keyField='id' data={streamUrl ? streamUrl : []} columns={columnsStream} filter={filterFactory()} pagination={paginationFactory()} />
                      </Modal.Body>
                    </Modal>
                    :
                    typeModal === "dnsStorage" ?
                      <Modal size="xl" backdrop={"static"} show={showModal} onHide={hideModalCameraInputs} centered={true}>
                        <Modal.Header closeButton>
                          <h3>Elija Vault Storage</h3>
                        </Modal.Header>
                        <Modal.Body>
                          <BootstrapTable className="styleTable" hover="true" keyField='id' data={storageUrl ? storageUrl : []} columns={columnsStorage} filter={filterFactory()} pagination={paginationFactory()} />
                        </Modal.Body>
                      </Modal>
                      :
                      typeModal === "zip" ?
                        <Modal size="xl" backdrop={"static"} show={showModal} onHide={hideModalCameraInputs} centered={true}>
                          <Modal.Header closeButton>
                            <h3>Elija ZIP</h3>
                          </Modal.Header>
                          <Modal.Body>
                            <BootstrapTable className="styleTable" hover="true" keyField='id' data={allCatAddress ? allCatAddress : []} columns={columnsZip} filter={filterFactory()} pagination={paginationFactory()} />
                          </Modal.Body>
                        </Modal>
                        :
                        typeModal === "userId" ?
                          <Modal size="xl" backdrop={"static"} show={showModal} onHide={hideModalCameraInputs} centered={true}>
                            <Modal.Header closeButton>
                              <h3>Elija USER ID</h3>
                            </Modal.Header>
                            <Modal.Body>
                              <BootstrapTable className="styleTable" hover="true" keyField='id' data={allUsers ? allUsers : []} columns={columnsUsers} filter={filterFactory()} pagination={paginationFactory()} />
                            </Modal.Body>
                          </Modal>
                          :
                          null

          }
          {pageModal === 1 ?
            <>
              <Form.Group>
                <Col md={4} lg={4}>
                  <Form.Field>
                    <label>Modelo Cam</label>
                    <select name="model_id" onChange={changeInfo} disabled={updateData === 1}>
                      {
                        allBrand ? allBrand.map((el) => {
                          return (
                            <option key={el.id} value={el.id}>{el.name}</option>
                          )
                        }) : null
                      }
                    </select>
                  </Form.Field>
                </Col>
                <Col md={3} lg={3}>
                  <Form.Field>
                    <label>Número de cámara</label>
                    <input
                      placeholder="Ingrese número..."
                      name="num_cam"
                      type="number"
                      value={dataForm.num_cam}
                      onChange={changeInfo}
                    />
                  </Form.Field>
                </Col>
                <Col md={3} lg={3}>
                  <Form.Field>
                    <label>Actualizar existente?</label>
                    <Form.Radio
                      label="NO"
                      value={0}
                      checked={updateData === 0}
                      onChange={changeUpdate}
                    />
                    <Form.Radio
                      label="SÍ"
                      value={1}
                      checked={updateData === 1}
                      onChange={changeUpdate}
                    />
                  </Form.Field>
                </Col>
              </Form.Group>
              <Form.Group>
                <Col md={3} lg={3}>
                  <Form.Field>
                    <label>Editar IP?</label>
                    <Form.Radio
                      label="NO"
                      value={0}
                      checked={updateIp === 0}
                      onChange={changeIp}
                      disabled={updateData === 0}
                    />
                    <Form.Radio
                      label="SÍ"
                      value={1}
                      checked={updateIp === 1}
                      onChange={changeIp}
                      disabled={updateData === 0}
                    />
                  </Form.Field>
                </Col>
                <Col md={4} lg={4}>
                  <Form.Field>
                    {updateData === 1 && updateIp === 0 ?
                      <>
                        <label>IP Cámara</label>
                        <input
                          placeholder="Ingrese IP..."
                          name="dns_ip"
                          type="button"
                          onClick={handleSelect}
                          value={dataForm.dns_ip ? dataForm.dns_ip : "Buscar"}
                          className="btnSearch"
                        />
                      </>
                      :
                      updateData === 1 && updateIp === 1 ?
                        <>
                          <label>IP Cámara</label>
                          <input
                            placeholder="Ingrese IP..."
                            name="dns_ip"
                            type="text"
                            value={dataForm.dns_ip}
                            onChange={changeInfo}
                          />
                        </>
                        :
                        <>
                          <label>IP Cámara</label>
                          <input
                            placeholder="Ingrese IP..."
                            name="dns_ip"
                            type="text"
                            value={dataForm.dns_ip}
                            onChange={changeInfo}
                          />
                        </>
                    }
                  </Form.Field>
                </Col>
                <Col md={4} lg={4}>
                  <Form.Field>
                    <label>Coordenadas</label>
                    <input
                      placeholder="Ingrese coordenadas..."
                      name="google_cordenate"
                      type="text"
                      value={dataForm.google_cordenate}
                      onChange={changeInfo}
                    />
                  </Form.Field>
                </Col>
              </Form.Group>
            </>
            :
            pageModal === 2 ?
              <>
                <Form.Group>
                  <Col md={5} lg={5}>
                    <Form.Field>
                      <label>Usuario de cámara</label>
                      <input
                        placeholder="Ingrese usuario..."
                        name="cam_user"
                        type="text"
                        value={dataForm.cam_user}
                        onChange={changeInfo}
                      />
                    </Form.Field>
                  </Col>
                  <Col md={5} lg={5}>
                    <Form.Field>
                      <label>Contraseña de cámara</label>
                      <input
                        placeholder="Ingrese contraseña..."
                        name="cam_pass"
                        type="text"
                        value={dataForm.cam_pass}
                        onChange={changeInfo}
                      />
                    </Form.Field>
                  </Col>
                </Form.Group>
                <Form.Group>
                  <Col md={3} lg={3}>
                    <Form.Field>
                      <label>Calle</label>
                      <input
                        placeholder="Ingrese calle..."
                        name="street"
                        type="text"
                        value={dataForm.street}
                        onChange={changeInfo}
                      />
                    </Form.Field>
                  </Col>
                  <Col md={2} lg={2}>
                    <Form.Field>
                      <label>Número</label>
                      <input
                        placeholder="Ingrese número..."
                        name="number"
                        type="number"
                        value={dataForm.number}
                        onChange={changeInfo}
                      />
                    </Form.Field>
                  </Col>
                  <Col md={3} lg={3}>
                    <Form.Field>
                      <label>Es LPR?</label>
                      <Form.Radio
                        label="NO"
                        value={0}
                        checked={dataForm.is_lpr === 0}
                        onChange={changeLPR}
                      />
                      <Form.Radio
                        label="SÍ"
                        value={1}
                        checked={dataForm.is_lpr === 1}
                        onChange={changeLPR}
                      />
                    </Form.Field>
                  </Col>
                  <Col md={3} lg={3}>
                    <Form.Field>
                      <label>Tiene micrófono?</label>
                      <Form.Radio
                        label="NO"
                        value={0}
                        checked={dataForm.is_mic === 0}
                        onChange={changeMic}
                      />
                      <Form.Radio
                        label="SÍ"
                        value={1}
                        checked={dataForm.is_mic === 1}
                        onChange={changeMic}
                      />
                    </Form.Field>
                  </Col>
                </Form.Group>
              </>
              :
              pageModal === 3 ?
                <>
                  <Form.Group>
                    <Col md={5} lg={5}>
                      <Form.Field>
                        <label>Estado</label>
                        <input
                          placeholder="Ingrese Estado..."
                          name="state"
                          type="text"
                          value={dataForm.state}
                          onChange={changeInfo}
                        />
                      </Form.Field>
                    </Col>
                  </Form.Group>
                  <Form.Group>
                    <Col md={5} lg={5}>
                      <Form.Field>
                        <label>Municipio o delegación</label>
                        <input
                          placeholder="Ingrese municipio o delegación..."
                          name="township"
                          type="text"
                          value={dataForm.township}
                          onChange={changeInfo}
                        />
                      </Form.Field>
                    </Col>
                    <Col md={5} lg={5}>
                      <Form.Field>
                        <label>Colonia</label>
                        <input
                          placeholder="Ingrese colonia..."
                          name="town"
                          type="text"
                          value={dataForm.town}
                          onChange={changeInfo}
                        />
                      </Form.Field>
                    </Col>
                  </Form.Group>
                </>
                :
                pageModal === 4 ?
                  <>
                    <Form.Group>
                      <Col md={3} lg={3}>
                        <Form.Field>
                          <label>Carrier?</label>
                          <Form.Radio
                            label="NO"
                            value={0}
                            checked={updateCarrier === 0}
                            onChange={changeCarrier}
                          />
                          <Form.Radio
                            label="SÍ"
                            value={1}
                            checked={updateCarrier === 1}
                            onChange={changeCarrier}
                          />
                        </Form.Field>
                      </Col>
                      <Col md={4} lg={4}>
                        <Form.Field>
                          <label>Carrier</label>
                          {
                            updateCarrier === 1 ?
                              <select name="cat_carrier_id" onChange={changeInfo}>
                                {
                                  carrier ? carrier.map((el) => {
                                    return (
                                      <option key={el.id} value={el.id}>{el.carrier}</option>
                                    )
                                  }) : null
                                }
                              </select>
                              :
                              <select name="cat_carrier_id" disabled onChange={changeInfo}>
                                <option>
                                  NO
                                </option>
                              </select>
                          }
                        </Form.Field>
                      </Col>
                    </Form.Group>
                    <Form.Group>
                      <Col md={5} lg={5}>
                        <Form.Field>
                          <label>Nombre SSID</label>
                          <input
                            placeholder="Ingrese nombre de SSID..."
                            name="ssid_name"
                            type="text"
                            value={updateCarrier === 0 ? null : dataForm.ssid_name}
                            onChange={changeInfo}
                            disabled={updateCarrier === 0}
                          />
                        </Form.Field>
                      </Col>
                      <Col md={5} lg={5}>
                        <Form.Field>
                          <label>Contraseña módem</label>
                          <input
                            placeholder="Ingrese contraseña..."
                            name="password"
                            type="text"
                            value={updateCarrier === 0 ? "" : dataForm.password}
                            onChange={changeInfo}
                            disabled={updateCarrier === 0}
                          />
                        </Form.Field>
                      </Col>
                    </Form.Group>
                  </>
                  :
                  pageModal === 5 ?
                    <>
                      <Form.Group>
                        <Col md={4} lg={4}>
                          <Form.Field>
                            <label>Código Postal</label>
                            <input
                              placeholder="Ingrese DNS..."
                              name="zip"
                              type="button"
                              onClick={handleSelect}
                              value={dataToShow.cat_address_name ? dataToShow.cat_address_name : "Buscar"}
                              className="btnSearch"
                            />
                          </Form.Field>
                        </Col>
                      </Form.Group>
                      <Form.Group>
                        <Col md={4} lg={4}>
                          <Form.Field>
                            <label>ID Usuario</label>
                            <input
                              placeholder="Ingrese DNS..."
                              name="userId"
                              type="button"
                              onClick={handleSelect}
                              value={dataToShow.user_name ? dataToShow.user_name : "Buscar"}
                              className="btnSearch"
                            />
                          </Form.Field>
                        </Col>
                      </Form.Group>
                    </>
                    :
                    pageModal === 6 ?
                      <>
                        <Form.Group>
                          <Col md={4} lg={4}>
                            <Form.Field>
                              <label>URL ID</label>
                              <input
                                placeholder="Ingrese nombre..."
                                name="apiName"
                                type="button"
                                onClick={handleSelect}
                                value={dataToShow.url_name ? dataToShow.url_name : "Buscar"}
                                className="btnSearch"
                              />
                            </Form.Field>
                          </Col>
                        </Form.Group>
                        <Form.Group>
                          <Col md={4} lg={4}>
                            <Form.Field>
                              <label>Stream ID</label>
                              <input
                                placeholder="Ingrese nombre..."
                                name="dnsStream"
                                type="button"
                                onClick={handleSelect}
                                value={dataToShow.stream_name ? dataToShow.stream_name : "Buscar"}
                                className="btnSearch"
                              />
                            </Form.Field>
                          </Col>
                          <Col md={4} lg={4}>
                            <Form.Field>
                              <label>Storage ID</label>
                              <input
                                placeholder="Ingrese nombre..."
                                name="dnsStorage"
                                type="button"
                                onClick={handleSelect}
                                value={dataToShow.storage_name ? dataToShow.storage_name : "Buscar"}
                                className="btnSearch"
                              />
                            </Form.Field>
                          </Col>
                        </Form.Group>
                      </>
                      :
                      pageModal === 7 ?
                        <>
                          <Form.Group>
                            <Col md={3} lg={3}>
                              <Form.Field>
                                <label>Amazon Stream?</label>
                                <Form.Radio
                                  label="NO"
                                  value={0}
                                  checked={isAmazonStream === 0}
                                  onChange={changeType}
                                />
                                <Form.Radio
                                  label="SÍ"
                                  value={1}
                                  checked={isAmazonStream === 1}
                                  onChange={changeType}
                                />
                              </Form.Field>
                            </Col>
                          </Form.Group>
                          <Form.Group>
                            <Col md={4} lg={4}>
                              <Form.Field>
                                <label>Amazon ARN Channel</label>
                                <input
                                  placeholder="Ingrese ARN Channel..."
                                  name="amazon_arn_channel"
                                  type="text"
                                  value={dataForm.amazon_arn_channel ? dataForm.amazon_arn_channel : ""}
                                  onChange={changeInfo}
                                  disabled={isAmazonStream === 0}
                                />
                              </Form.Field>
                            </Col>
                            <Col md={4} lg={4}>
                              <Form.Field>
                                <label>Amazon Region</label>
                                <input
                                  placeholder="Ingrese región..."
                                  name="amazon_region"
                                  type="text"
                                  value={dataForm.amazon_region ? dataForm.amazon_region : ""}
                                  onChange={changeInfo}
                                  disabled={isAmazonStream === 0}
                                />
                              </Form.Field>
                            </Col>
                          </Form.Group>
                        </>
                        :
                        null
          }

          <div className="page-btn">

            {pageModal === 1 ? <div /> : <input type="button" className="btn btnAdd" value="Anterior" onClick={previousPage} />}
            {pageModal === 7 ? null : <input type="button" className="btn btnAdd" value="Siguiente" onClick={nextPage} />}

          </div>
          {
            pageModal === 7 ?
              <div className="row">
                <Button
                  positive
                  className="styleBtnAdd btn-block"
                  type="submit"
                  disabled={
                    dataForm.google_cordenate === "" ||
                    dataForm.dns_ip === "" ||
                    dataForm.num_cam === "" ||
                    dataForm.street === "" ||
                    dataForm.number === "" ||
                    dataForm.township === "" ||
                    dataForm.town === "" ||
                    dataForm.state === "" ||
                    // dataForm.between_streets === "" ||
                    dataForm.model_id === "" ||
                    dataForm.zip === "" ||
                    dataForm.userId === ""
                    // dataForm.id_camara === ""
                  }
                >
                  AGREGAR CÁMARA
                </Button>
              </div>
              :
              null
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

export default ModalRegisterCamera;
