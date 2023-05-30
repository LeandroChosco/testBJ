import React, { useState } from 'react';
import { Form } from 'semantic-ui-react'
import { Modal, Button, Col, Row } from 'react-bootstrap';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import conections from "../../conections"
import { ToastsStore } from "react-toasts";
import { useQuery } from '@apollo/client'
import { CAMERA_FILTER, CAT_ADDRESS } from '../../graphql/queries'

export default function renderCameraServer({ modalInputs }) {

    const token = JSON.parse(sessionStorage.getItem("isAuthenticated")).userInfo.token
    const [showModal, setShowModal, hideModalCameraInputs] = modalInputs;

    const [updateCheck, setUpdateCheck] = useState(0)
    const [updateData, setUpdateData] = useState(0)
    const [searchZip, setSearchZip] = useState(0)
    const [typeModal, setTypeModal] = useState(0)
    const [dataForm, setDataForm] = useState({
        update_data: 0,
        cs: {
            ipCamara: "",
            camUser: "",
            camPass: "",
            apiName: "",
            dnsApi: "",
            apiPort: "",
            apiProtocol: "",
            typeMbox: "light",
            dnsStream: "",
            streamPort: "",
            streamProtocol: "",
            vaultStorage: 0,
            dnsStorage: "",
            storagePort: "",
            clientBucket: "",
        },
        cp: {
            codigoPostal: "",
            asenta: "",
            tipoAsenta: "",
            municipio: "",
            estado: "",
            ciudad: "",
            codigoEstado: "",
            codigoTipoAsenta: null,
            codigoMunicipio: null,
            idAsenta: "",
            zona: "",
            codigoCVECiudad: "",
        }
    })

    const actions = (cell, row, rowIndex, formatExtraData) => {
        return (
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button onClick={() => {
                    if (row.ipCamara) {
                        setDataForm({
                            ...dataForm,
                            ipCamara: row.ipCamara,
                            camUser: row.camUser,
                            camPass: row.camPass,
                            apiName: row.apiName,
                            dnsApi: row.dnsApi,
                            apiPort: row.apiPort,
                            apiProtocol: row.apiProtocol,
                            typeMbox: row.typeMbox,
                            dnsStream: row.dnsStream,
                            streamPort: row.streamPort,
                            streamProtocol: row.streamProtocol,
                            vaultStorage: row.vaultStorage,
                            dnsStorage: row.dnsStorage,
                            storagePort: row.storagePort,
                            clientBucket: row.clientBucket,
                        })
                    }
                    if (row.codigoPostal) {
                        setDataForm({
                            ...dataForm,
                            codigoPostal: row.codigoPostal,
                            asenta: row.asenta,
                            tipoAsenta: row.tipoAsenta,
                            municipio: row.municipio,
                            estado: row.estado,
                            ciudad: row.ciudad,
                            codigoEstado: row.codigoEstado,
                            codigoTipoAsenta: row.codigoTipoAsenta,
                            codigoMunicipio: row.codigoMunicipio,
                            idAsenta: row.idAsenta,
                            zona: row.zona,
                            codigoCVECiudad: row.codigoCVECiudad,
                        })
                    }
                    setShowModal(false)
                    setTypeModal(0)
                }}>✔️</Button>
            </div>
        )
    }

    const changeUpdate = (event, data) => {
        if (data) {
            setUpdateData(data.value)
        }
        if (data.value === 0) {
            resetCamForm();
        }
    }
    const changeVault = (event, data) => {
        if (data) {
            setUpdateCheck(data.value)
        }
    }
    const changeZip = (event, data) => {
        if (data) {
            setSearchZip(data.value)
        }
        if (data.value === 0) {
            resetZipForm();
        }
    }

    const getAllCamerasToServers = () => {
        let { data, loading } = useQuery(CAMERA_FILTER, {
            variables: {
                userId: 6062,
                id_camara: 0
            },
            context: {
                headers: {
                    "Authorization": token ? token : "",
                }
            }
        })

        const arrayResponse = []

        if (!loading && data) {
            data.getCamaraFilter.response.forEach((el) => {
                arrayResponse.push({
                    id: el.id,
                    ipCamara: el.camera_ip,
                    camUser: el.cam_user,
                    camPass: el.cam_pass,
                    apiName: el.Url.name_instance,
                    dnsApi: el.Url.dns_ip,
                    apiPort: el.Url.port,
                    apiProtocol: el.Url.protocol,
                    typeMbox: el.Url.tipombox,
                    dnsStream: el.UrlStreamMediaServer.ip_url_ms,
                    streamPort: el.UrlStreamMediaServer.output_port,
                    streamProtocol: el.UrlStreamMediaServer.protocol,
                    vaultStorage: el.UrlAPIStorage.is_bold_storage,
                    dnsStorage: el.UrlAPIStorage.dns_bold,
                    storagePort: el.UrlAPIStorage.port,
                    clientBucket: el.UrlAPIStorage.client_bucket_bold,
                })
            })
        }
        return arrayResponse;
    }
    const allCamerasToServers = getAllCamerasToServers();

    const getAllZips = () => {
        let { data, loading } = useQuery(CAT_ADDRESS, {
            variables: {
                userId: 6062
            },
            context: {
                headers: {
                    "Authorization": token ? token : "",
                }
            }
        })

        const arrayResponse = []

        if (!loading && data) {
            data.getCatAddress.response.forEach((el) => {
                arrayResponse.push({
                    codigoPostal: el.d_codigo,
                    asenta: el.d_asenta,
                    tipoAsenta: el.d_tipo_asenta,
                    municipio: el.d_mnpio,
                    estado: el.d_estado,
                    ciudad: el.d_ciudad,
                    codigoEstado: el.c_estado,
                    codigoTipoAsenta: el.c_tipo_asenta,
                    codigoMunicipio: el.c_mnpio,
                    idAsenta: el.id_asenta_cpcons,
                    zona: el.d_zona,
                    codigoCVECiudad: el.c_cve_ciudad,

                })
            })
        }
        return arrayResponse;
    }
    const allZips = getAllZips();

    const resetCamForm = () => {
        setDataForm({
            ...dataForm,
            ipCamara: "",
            camUser: "",
            camPass: "",
            apiName: "",
            dnsApi: "",
            apiPort: "",
            apiProtocol: "",
            typeMbox: "light",
            dnsStream: "",
            streamPort: "",
            streamProtocol: "",
            vaultStorage: 0,
            dnsStorage: "",
            storagePort: "",
            clientBucket: "",
        })
    }

    const resetZipForm = () => {
        setDataForm({
            ...dataForm,
            codigoPostal: "",
            asenta: "",
            tipoAsenta: "",
            municipio: "",
            estado: "",
            ciudad: "",
            codigoEstado: "",
            codigoTipoAsenta: "",
            codigoMunicipio: "",
            idAsenta: "",
            zona: "",
            codigoCVECiudad: "",
        })
    }

    const resetForm = () => {
        setDataForm({
            ipCamara: "",
            camUser: "",
            camPass: "",
            apiName: "",
            dnsApi: "",
            apiPort: "",
            apiProtocol: "",
            typeMbox: "light",
            dnsStream: "",
            streamPort: "",
            streamProtocol: "",
            vaultStorage: 0,
            dnsStorage: "",
            storagePort: "",
            clientBucket: "",
            codigoPostal: "",
            asenta: "",
            tipoAsenta: "",
            municipio: "",
            estado: "",
            ciudad: "",
            codigoEstado: "",
            codigoTipoAsenta: "",
            codigoMunicipio: "",
            idAsenta: "",
            zona: "",
            codigoCVECiudad: "",
        })
    }


    const columnsDns = [{
        dataField: "id",
        text: 'ID',
        filter: textFilter({
            placeholder: "🔎"
        })
    }, {
        dataField: "ipCamara",
        text: 'IP cámara',
        filter: textFilter({
            placeholder: "🔎"
        })
    }, {
        dataField: "apiName",
        text: 'Nombre API',
        filter: textFilter({
            placeholder: "🔎"
        })
    }, {
        dataField: "dnsApi",
        text: 'DNS API',
        filter: textFilter({
            placeholder: "🔎"
        })
    }, {
        dataField: "typeMbox",
        text: 'Tipo MBOX',
        filter: textFilter({
            placeholder: "🔎"
        })
    }, {
        dataField: "actions",
        text: '',
        formatter: actions,
    }];

    const columnsZip = [{
        dataField: "codigoPostal",
        text: 'Código Postal',
        filter: textFilter({
            placeholder: "🔎"
        })
    }, {
        dataField: "estado",
        text: 'Estado',
        filter: textFilter({
            placeholder: "🔎"
        })
    }, {
        dataField: "ciudad",
        text: 'Ciudad',
        filter: textFilter({
            placeholder: "🔎"
        })
    }, {
        dataField: "idAsenta",
        text: 'ID Asenta',
        filter: textFilter({
            placeholder: "🔎"
        })
    }, {
        dataField: "actions",
        text: '',
        formatter: actions,
    }];


    const createRelation = async () => {
        try {
            let data = {
                update_data: updateData,
                cs: {
                    ipCamara: dataForm.ipCamara,
                    camUser: dataForm.camUser,
                    camPass: dataForm.camPass,
                    apiName: dataForm.apiName,
                    dnsApi: dataForm.dnsApi,
                    apiPort: dataForm.apiPort,
                    apiProtocol: dataForm.apiProtocol,
                    typeMbox: dataForm.typeMbox,
                    dnsStream: dataForm.dnsStream,
                    streamPort: dataForm.streamPort,
                    streamProtocol: dataForm.streamProtocol,
                    vaultStorage: updateCheck,
                    dnsStorage: dataForm.typeMbox === "pro" ? null : dataForm.dnsStorage,
                    storagePort: dataForm.typeMbox === "pro" ? null : dataForm.storagePort,
                    clientBucket: dataForm.clientBucket,
                },
                cp: {
                    codigoPostal: dataForm.codigoPostal,
                    asenta: dataForm.asenta,
                    tipoAsenta: dataForm.tipoAsenta,
                    municipio: dataForm.municipio,
                    estado: dataForm.estado,
                    ciudad: dataForm.ciudad,
                    codigoEstado: dataForm.codigoEstado,
                    codigoTipoAsenta: dataForm.codigoTipoAsenta,
                    codigoMunicipio: dataForm.codigoMunicipio,
                    idAsenta: dataForm.idAsenta,
                    zona: dataForm.zona,
                    codigoCVECiudad: dataForm.codigoCVECiudad,
                }
            }
            await conections.camerasToServers(data);
            ToastsStore.success(`Servidor creado con éxito`);
            resetForm();
        }
        catch (error) {
            ToastsStore.error(`Por ahora ${error}`)
        }
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

    const handleSelect = (e) => {
        e.preventDefault();
        setShowModal(true);
        setTypeModal(e.target.name)
    }

    return (
        <>
            <Form onSubmit={createRelation}>
                {updateData === 1 && typeModal === "ipCamara" ?
                    <Modal size="xl" backdrop={"static"} show={showModal} onHide={hideModalCameraInputs} centered={true}>
                        <Modal.Header closeButton>
                            <h3>Elija IP</h3>
                        </Modal.Header>
                        <Modal.Body>
                            <BootstrapTable className="styleTable" hover="true" keyField='id' data={allCamerasToServers ? allCamerasToServers : []} columns={columnsDns} filter={filterFactory()} pagination={paginationFactory()} />
                        </Modal.Body>
                    </Modal>
                    :
                    searchZip === 1 && typeModal === "codigoPostal" ?
                        <Modal size="xl" backdrop={"static"} show={showModal} onHide={hideModalCameraInputs} centered={true}>
                            <Modal.Header closeButton>
                                <h3>Elija CP</h3>
                            </Modal.Header>
                            <Modal.Body>
                                <BootstrapTable className="styleTable" hover="true" keyField='id' data={allZips ? allZips : []} columns={columnsZip} filter={filterFactory()} pagination={paginationFactory()} />
                            </Modal.Body>
                        </Modal>
                        :
                        null
                }
                <Row>
                    <Col md={6} lg={6}>
                        <h2>Info Cámara</h2>
                        <br />
                    </Col>
                    <Col md={6} lg={6}>
                        <h2>Info Código Postal</h2>
                        <br />
                    </Col>
                </Row>
                <Row>
                    <Col md={6} lg={6}>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    {updateData === 1 ?
                                        <>
                                            <label>IP Cámara</label>
                                            <input
                                                placeholder="Ingrese IP..."
                                                name="ipCamara"
                                                type="button"
                                                onClick={handleSelect}
                                                value={dataForm.ipCamara ? dataForm.ipCamara : "Buscar"}
                                                className="btnSearch"
                                            />
                                        </>
                                        :
                                        <>
                                            <label>IP Cámara</label>
                                            <input
                                                placeholder="Ingrese IP..."
                                                name="ipCamara"
                                                type="text"
                                                value={dataForm.ipCamara}
                                                onChange={changeInfo}
                                            />
                                        </>
                                    }
                                </Form.Field>
                            </Col>
                            <Col md={5} lg={5}>
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
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Usuario</label>
                                    <input
                                        placeholder="Ingrese usuario..."
                                        name="camUser"
                                        type="text"
                                        value={dataForm.camUser}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Contraseña</label>
                                    <input
                                        placeholder="Ingrese contraseña..."
                                        name="camPass"
                                        type="text"
                                        value={dataForm.camPass}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                        </Form.Group>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Nombre API</label>
                                    <input
                                        placeholder="Ingrese nombre..."
                                        name="apiName"
                                        type="text"
                                        value={dataForm.apiName}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>DNS API</label>
                                    <input
                                        placeholder="Ingrese DNS..."
                                        name="dnsApi"
                                        type="text"
                                        value={dataForm.dnsApi}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                        </Form.Group>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Puerto API</label>
                                    <input
                                        placeholder="Ingrese puerto..."
                                        name="apiPort"
                                        type="number"
                                        value={dataForm.apiPort}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Protocolo API</label>
                                    <input
                                        placeholder="Ingrese protocolo..."
                                        name="apiProtocol"
                                        type="text"
                                        value={dataForm.apiProtocol}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                        </Form.Group>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>DNS Stream</label>
                                    <input
                                        placeholder="Ingrese DNS..."
                                        name="dnsStream"
                                        type="text"
                                        value={dataForm.dnsStream}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Tipo Mbox</label>
                                    <select name="typeMbox" onChange={changeInfo}>
                                        <option value="light">LIGHT</option>
                                        <option value="pro">PRO</option>
                                    </select>
                                </Form.Field>
                            </Col>
                        </Form.Group>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Puerto Stream</label>
                                    <input
                                        placeholder="Ingrese puerto..."
                                        name="streamPort"
                                        type="number"
                                        value={dataForm.streamPort}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Protocolo Stream</label>
                                    <input
                                        placeholder="Ingrese protocolo..."
                                        name="streamProtocol"
                                        type="text"
                                        value={dataForm.streamProtocol}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                        </Form.Group>
                        <Form.Group inline>
                            <label>Vault Storage?</label>
                            <Form.Radio
                                label="SÍ"
                                value={1}
                                checked={updateCheck === 1}
                                onChange={changeVault}
                            />
                            <Form.Radio
                                label="NO"
                                value={0}
                                checked={updateCheck === 0}
                                onChange={changeVault}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>DNS Storage</label>
                                    <input
                                        placeholder="Ingrese DNS..."
                                        name="dnsStorage"
                                        type="text"
                                        value={dataForm.dnsStorage}
                                        onChange={changeInfo}
                                        disabled={updateCheck === 0}
                                    />
                                </Form.Field>
                            </Col>
                            <Col md={2} lg={2}>
                                <Form.Field>
                                    <label>Puerto Storage</label>
                                    <input
                                        placeholder="Ingrese puerto..."
                                        name="storagePort"
                                        type="number"
                                        value={dataForm.storagePort}
                                        onChange={changeInfo}
                                        disabled={updateCheck === 0}
                                    />
                                </Form.Field>
                            </Col>
                            <Col md={4} lg={4}>
                                <Form.Field>
                                    <label>Client Bucket</label>
                                    <input
                                        placeholder="Ingrese bucket?..."
                                        name="clientBucket"
                                        type="text"
                                        value={dataForm.clientBucket}
                                        onChange={changeInfo}
                                        disabled={updateCheck === 0}
                                    />
                                </Form.Field>
                            </Col>
                        </Form.Group>

                    </Col>

                    {/* ------------------------------ */}

                    <Col md={6} lg={6}>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Buscar CP?</label>
                                    <Form.Radio
                                        label="NO"
                                        value={0}
                                        checked={searchZip === 0}
                                        onChange={changeZip}
                                    />
                                    <Form.Radio
                                        label="SÍ"
                                        value={1}
                                        checked={searchZip === 1}
                                        onChange={changeZip}
                                    />
                                </Form.Field>
                            </Col>
                        </Form.Group>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    {
                                        searchZip === 1 ?
                                            <>
                                                <label>Código Postal</label>
                                                <input
                                                    placeholder="Ingrese CP..."
                                                    name="codigoPostal"
                                                    type="button"
                                                    onClick={handleSelect}
                                                    value={dataForm.codigoPostal ? dataForm.codigoPostal : "Buscar"}
                                                    className="btnSearch"
                                                />
                                            </>
                                            :
                                            <>
                                                <label>Código Postal</label>
                                                <input
                                                    placeholder="Ingrese Código Postal..."
                                                    name="codigoPostal"
                                                    type="text"
                                                    value={dataForm.codigoPostal}
                                                    onChange={changeInfo}
                                                />
                                            </>
                                    }
                                </Form.Field>
                            </Col>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Zona</label>
                                    <input
                                        placeholder="Ingrese zona..."
                                        name="zona"
                                        type="text"
                                        value={dataForm.zona}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                        </Form.Group>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Asenta</label>
                                    <input
                                        placeholder="Ingrese Asenta..."
                                        name="asenta"
                                        type="text"
                                        value={dataForm.asenta}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>ID Asenta</label>
                                    <input
                                        placeholder="Ingrese ID..."
                                        name="idAsenta"
                                        type="text"
                                        value={dataForm.idAsenta}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                        </Form.Group>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Tipo Asenta</label>
                                    <input
                                        placeholder="Ingrese tipo..."
                                        name="tipoAsenta"
                                        type="text"
                                        value={dataForm.tipoAsenta}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Código Asenta</label>
                                    <input
                                        placeholder="Ingrese código..."
                                        name="codigoTipoAsenta"
                                        type="text"
                                        value={dataForm.codigoTipoAsenta}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                        </Form.Group>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Municipio</label>
                                    <input
                                        placeholder="Ingrese Municipio..."
                                        name="municipio"
                                        type="text"
                                        value={dataForm.municipio}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Código Municipio</label>
                                    <input
                                        placeholder="Ingrese código..."
                                        name="codigoMunicipio"
                                        type="text"
                                        value={dataForm.codigoMunicipio}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                        </Form.Group>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Estado</label>
                                    <input
                                        placeholder="Ingrese Estado..."
                                        name="estado"
                                        type="text"
                                        value={dataForm.estado}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Código Estado</label>
                                    <input
                                        placeholder="Ingrese código..."
                                        name="codigoEstado"
                                        type="text"
                                        value={dataForm.codigoEstado}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                        </Form.Group>
                        <Form.Group>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Ciudad</label>
                                    <input
                                        placeholder="Ingrese Ciudad..."
                                        name="ciudad"
                                        type="text"
                                        value={dataForm.ciudad}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                            <Col md={5} lg={5}>
                                <Form.Field>
                                    <label>Código CVE Ciudad</label>
                                    <input
                                        placeholder="Ingrese código..."
                                        name="codigoCVECiudad"
                                        type="text"
                                        value={dataForm.codigoCVECiudad}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <br />
                <Row>
                    <Button
                        className="styleBtnAdd btn-block"
                        type="submit"
                        style={{
                            display: "flex",
                            alignContent: "flex-start",
                            width: "auto",
                            padding: "12px"
                        }}
                        disabled={
                            dataForm.ipCamara === "" ||
                            dataForm.camUser === "" ||
                            dataForm.camPass === "" ||
                            dataForm.apiName === "" ||
                            dataForm.dnsApi === "" ||
                            dataForm.apiPort === "" ||
                            dataForm.apiProtocol === "" ||
                            dataForm.dnsStream === "" ||
                            dataForm.streamPort === "" ||
                            dataForm.streamProtocol === "" ||
                            dataForm.codigoPostal === "" ||
                            dataForm.asenta === "" ||
                            dataForm.tipoAsenta === "" ||
                            dataForm.municipio === "" ||
                            dataForm.estado === "" ||
                            dataForm.ciudad === "" ||
                            dataForm.codigoEstado === "" ||
                            dataForm.idAsenta === "" ||
                            dataForm.zona === "" ||
                            dataForm.codigoCVECiudad === ""
                        }
                    >
                        AGREGAR SERVIDOR
                    </Button>
                </Row>
            </Form >
        </>
    )
}
