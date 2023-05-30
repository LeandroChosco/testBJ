import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";
import { useMutation } from '@apollo/client'
import { URL_STREAM, DELETE_STREAM } from '../../graphql/mutations'
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

export default function ModalUrlStream(props) {

    const { showModalUrlStream, setShowModalUrlStream, hide, currentData, setCurrentData } = props
    const token = TOKEN_FIX;

    const [createUpdateStream] = useMutation(URL_STREAM)
    const [deleteStream] = useMutation(DELETE_STREAM)

    const [isLoading, setIsloading] = useState(false);

    const [dataForm, setDataForm] = useState({
        userId: 1,
        ip_url_ms: "",
        output_port: "",
        name: "",  // !
        autenticacion: 0, // DEFAULT 0
        secretkey: "",
        protocol: "",
        update_data: 0,
        stream_id: 0,
    });

    useEffect(() => {
        if (currentData) {
            setDataForm({
                userId: 1,
                ip_url_ms: currentData.ip_url_ms,
                output_port: currentData.output_port,
                name: currentData.name,
                autenticacion: currentData.autenticacion,
                secretkey: currentData.secretkey,
                protocol: currentData.protocol,
                update_data: 1,
                stream_id: currentData.id
            })
        }
        else {
            setDataForm({
                userId: 1,
                ip_url_ms: "",
                output_port: "",
                name: "",
                autenticacion: 0,
                secretkey: "",
                protocol: "",
                update_data: 0,
                stream_id: 0,
            })
        }
    }, [currentData])

    const addUrlStream = (event) => {
        event.preventDefault();
        // let data = {
        //     userId: 1,
        //     ip_url_ms: dataForm.ip_url_ms,
        //     output_port: parseInt(dataForm.output_port),
        //     name: dataForm.name,
        //     autenticacion: parseInt(dataForm.autenticacion),
        //     secretkey: dataForm.secretkey !== "" ? dataForm.secretkey : null,
        //     protocol: dataForm.protocol,
        //     update_data: dataForm.update_data,
        //     stream_id: dataForm.stream_id
        // }

        // VERIFICAR SI SE PUEDE ENVIAR DATA EN VARIABLES MÁS ADELANTE...

        if (showModalUrlStream === "Agregar Url Stream" || showModalUrlStream === "Actualizar Url Stream") {
            createUpdateStream({
                variables: {
                    userId: 1,
                    ip_url_ms: dataForm.ip_url_ms,
                    output_port: parseInt(dataForm.output_port),
                    name: dataForm.name,
                    autenticacion: parseInt(dataForm.autenticacion),
                    secretkey: dataForm.secretkey,
                    protocol: dataForm.protocol,
                    update_data: dataForm.update_data,
                    stream_id: dataForm.stream_id
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
                if (showModalUrlStream === "Agregar Url Stream") {
                    ToastsStore.success("Url Stream creado con éxito")
                }
                if (showModalUrlStream === "Actualizar Url Stream") {
                    ToastsStore.success("Url Stream actualizado con éxito")
                }
                setShowModalUrlStream(false);
                setCurrentData(false)
            }, 2000);
        }
        if (showModalUrlStream === "Eliminar Url Stream") {
            deleteStream({
                variables: {
                    userId: 1,
                    stream_id: dataForm.stream_id
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
                ToastsStore.success("Url Stream eliminado con éxito")
                setShowModalUrlStream(false);
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
            {showModalUrlStream === "Agregar Url Stream" || showModalUrlStream === "Actualizar Url Stream" ?
                <Modal size="md" backdrop={"static"} show={showModalUrlStream ? true : false} onHide={hide}>
                    <Modal.Header closeButton>
                        {
                            showModalUrlStream === "Agregar Url Stream" ?
                                <h3>Nuevo Url Stream</h3>
                                :
                                showModalUrlStream === "Actualizar Url Stream" ?
                                    <h3>Actualizar Url Stream</h3>
                                    :
                                    null
                        }
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={addUrlStream}>
                            <Form.Group>
                                <Form.Field>
                                    <label>Nombre</label>
                                    <input
                                        placeholder="Ingrese nombre..."
                                        name="name"
                                        type="text"
                                        value={dataForm.name}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>IP URL</label>
                                    <input
                                        placeholder="Ingrese IP..."
                                        name="ip_url_ms"
                                        type="text"
                                        value={dataForm.ip_url_ms}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field>
                                    <label>Puerto</label>
                                    <input
                                        placeholder="Ingrese puerto..."
                                        name="output_port"
                                        type="text"
                                        value={dataForm.output_port}
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
                                    <label>Autenticación</label>
                                    <input
                                        placeholder="Ingrese autenticación..."
                                        name="autenticacion"
                                        type="text"
                                        value={dataForm.autenticacion}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Form.Group>
                            {
                                showModalUrlStream === "Agregar Url Stream" ?
                                    <Button
                                        className="styleBtnAdd btn-block"
                                        type="submit"
                                        disabled={
                                            dataForm.ip_url_ms === "" ||
                                            dataForm.output_port === "" ||
                                            dataForm.name === "" ||
                                            dataForm.protocol === ""
                                        }
                                    >
                                        AGREGAR URL STREAM
                                    </Button>
                                    :
                                    showModalUrlStream === "Actualizar Url Stream" ?
                                        <Button
                                            className="styleBtnAdd btn-block"
                                            type="submit"
                                            disabled={
                                                dataForm.ip_url_ms === "" ||
                                                dataForm.output_port === "" ||
                                                dataForm.name === "" ||
                                                dataForm.protocol === ""
                                            }
                                        >
                                            ACTUALIZAR URL STREAM
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
                showModalUrlStream === "Eliminar Url Stream" ?
                    <Modal size="md" backdrop={"static"} show={showModalUrlStream ? true : false} onHide={hide}>
                        <Modal.Header closeButton>
                            <h3>Eliminar Url Api</h3>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={addUrlStream}>
                                <Form.Field>
                                    <label>Está seguro que desea eliminar esta url?</label>
                                    <input
                                        placeholder="Ingrese nombre..."
                                        name="ip_url_ms"
                                        type="text"
                                        value={dataForm.ip_url_ms}
                                        readOnly
                                    />
                                </Form.Field>
                                <Form.Group inline>
                                    <Button onClick={() => setShowModalUrlStream(false)}>
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
}