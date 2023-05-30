import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";
import { useMutation } from '@apollo/client'
import { URL_API, DELETE_API } from '../../graphql/mutations'
import { TOKEN_FIX } from '../../constants/token';

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

export default function ModalUrlApi(props) {

    const { showModalUrlApi, setShowModalUrlApi, hide, currentData, setCurrentData } = props
    const token = TOKEN_FIX;

    const [createUpdateApi] = useMutation(URL_API)
    const [deleteApi] = useMutation(DELETE_API)

    const [isLoading, setIsloading] = useState(false);

    const [dataForm, setDataForm] = useState({
        userId: 6062,
        name_instance: "",
        dns_ip: "",
        port: "",
        protocol: "",
        secretkey: "",
        tipombox: "light",
        update_data: 0,
        url_id: 0,
    });

    useEffect(() => {
        if (currentData) {
            setDataForm({
                userId: 6062,
                name_instance: currentData.name_instance,
                dns_ip: currentData.dns_ip,
                port: currentData.port,
                protocol: currentData.protocol,
                secretkey: currentData.secretkey,
                tipombox: currentData.tipombox,
                update_data: 1,
                url_id: currentData.id
            })
        }
        else {
            setDataForm({
                userId: 6062,
                name_instance: "",
                dns_ip: "",
                port: "",
                protocol: "",
                secretkey: "",
                tipombox: "light",
                update_data: 0,
                url_id: 0
            })
        }
    }, [currentData])

    const addUrlApi = (event) => {
        event.preventDefault();
        // let data = {
        //     userId: 6062,
        //     name_instance: dataForm.name_instance,
        //     dns_ip: dataForm.dns_ip,
        //     port: parseInt(dataForm.port),
        //     protocol: dataForm.protocol,
        //     secretkey: dataForm.secretkey,
        //     tipombox: dataForm.tipombox,
        //     update_data: dataForm.update_data,
        //     url_id: dataForm.url_id,
        // }

        // VERIFICAR SI SE PUEDE ENVIAR DATA EN VARIABLES MÁS ADELANTE...

        if (showModalUrlApi === "Agregar Url Api" || showModalUrlApi === "Actualizar Url Api") {
            createUpdateApi({
                variables: {
                    userId: 6062,
                    name_instance: dataForm.name_instance,
                    dns_ip: dataForm.dns_ip,
                    port: parseInt(dataForm.port),
                    protocol: dataForm.protocol,
                    secretkey: dataForm.secretkey,
                    tipombox: dataForm.tipombox,
                    update_data: dataForm.update_data,
                    url_id: dataForm.url_id,
                },
                context: {
                    headers: {
                        "Authorization": token ? token : "",
                    }
                },
            })
            setIsloading(true);
            setTimeout(() => {
                setIsloading(false);
                if (showModalUrlApi === "Agregar Url Api") {
                    ToastsStore.success("Url Api creada con éxito")
                }
                if (showModalUrlApi === "Actualizar Url Api") {
                    ToastsStore.success("Url Api actualizada con éxito")
                }
                setShowModalUrlApi(false);
                setCurrentData(false)
            }, 2000);
        }

        if (showModalUrlApi === "Eliminar Url Api") {
            deleteApi({
                variables: {
                    userId: 6062,
                    url_id: dataForm.url_id
                },
                context: {
                    headers: {
                        "Authorization": token ? token : "",
                    }
                },
            })
            setIsloading(true);
            setTimeout(() => {
                setIsloading(false);
                ToastsStore.success("Url Api actualizada con éxito")
                setShowModalUrlApi(false);
                setCurrentData(false)
            }, 2000);
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


    return (
        <>
            {showModalUrlApi === "Agregar Url Api" || showModalUrlApi === "Actualizar Url Api" ?
                <Modal size="md" backdrop={"static"} show={showModalUrlApi ? true : false} onHide={hide}>
                    <Modal.Header closeButton>
                        {
                            showModalUrlApi === "Agregar Url Api" ?
                                <h3>Nuevo Url Api</h3>
                                :
                                showModalUrlApi === "Actualizar Url Api" ?
                                    <h3>Actualizar Url Api</h3>
                                    :
                                    null
                        }
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={addUrlApi}>
                            <Form.Group>
                                <Form.Field>
                                    <label>Nombre instancia</label>
                                    <input
                                        placeholder="Ingrese nombre..."
                                        name="name_instance"
                                        type="text"
                                        value={dataForm.name_instance}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>DNS IP</label>
                                    <input
                                        placeholder="Ingrese DNS..."
                                        name="dns_ip"
                                        type="text"
                                        value={dataForm.dns_ip}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field>
                                    <label>Puerto</label>
                                    <input
                                        placeholder="Ingrese puerto..."
                                        name="port"
                                        type="text"
                                        value={dataForm.port}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Protocolo</label>
                                    <input
                                        placeholder="Ingrese protocolo..."
                                        name="protocol"
                                        type="text"
                                        value={dataForm.protocol}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field>
                                    <label>Clave Secreta</label>
                                    <input
                                        placeholder="Ingrese clave..."
                                        name="secretkey"
                                        type="text"
                                        value={dataForm.secretkey}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Tipo Mbox</label>
                                    <select name="tipombox" onChange={changeInfo}>
                                        <option key={1} value="light">light</option>
                                        <option key={2} value="pro">pro</option>
                                    </select>
                                </Form.Field>
                            </Form.Group>
                            {
                                showModalUrlApi === "Agregar Url Api" ?
                                    <Button
                                        className="styleBtnAdd btn-block"
                                        type="submit"
                                        disabled={
                                            dataForm.name_instance === "" ||
                                            dataForm.dns_ip === "" ||
                                            dataForm.port === "" ||
                                            dataForm.protocol === "" ||
                                            dataForm.tipombox === ""
                                        }
                                    >
                                        AGREGAR URL API
                                    </Button>
                                    :
                                    showModalUrlApi === "Actualizar Url Api" ?

                                        <Button
                                            className="styleBtnAdd btn-block"
                                            type="submit"
                                            disabled={
                                                dataForm.name_instance === "" ||
                                                dataForm.dns_ip === "" ||
                                                dataForm.port === "" ||
                                                dataForm.protocol === "" ||
                                                dataForm.tipombox === ""
                                            }
                                        >
                                            ACTUALIZAR URL API
                                        </Button>
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
                :
                showModalUrlApi === "Eliminar Url Api" ?
                    <Modal size="md" backdrop={"static"} show={showModalUrlApi ? true : false} onHide={hide}>
                        <Modal.Header closeButton>
                            <h3>Eliminar Url Api</h3>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={addUrlApi}>
                                <Form.Field>
                                    <label>Está seguro que desea eliminar esta url?</label>
                                    <input
                                        placeholder="Ingrese nombre..."
                                        name="name_instance"
                                        type="text"
                                        value={dataForm.name_instance}
                                        readOnly
                                    />
                                </Form.Field>
                                <Form.Group inline>
                                    <Button onClick={() => setShowModalUrlApi(false)}>
                                        CANCELAR
                                    </Button>
                                    <Button className="styleBtnAdd btn-block"
                                        type="submit"
                                    >
                                        BORRAR
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
                    :
                    null
            }
        </>
    )
};
