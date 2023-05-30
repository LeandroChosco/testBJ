import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";
import { useMutation } from '@apollo/client'
import { URL_STORAGE, DELETE_STORAGE } from '../../graphql/mutations'
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

export default function ModalUrlStorage(props) {

    const { showModalUrlStorage, setShowModalUrlStorage, hide, currentData, setCurrentData } = props
    const token = TOKEN_FIX;

    const [createUpdateStorage] = useMutation(URL_STORAGE)
    const [deleteStorage] = useMutation(DELETE_STORAGE)

    const [isLoading, setIsloading] = useState(false);
    const [vaultData, setVaultData] = useState(0)
    const [mboxData, setMboxData] = useState("light")

    const [dataForm, setDataForm] = useState({
        userId: 1,
        type_mbox: "light",
        ip_url: "",
        port: "",
        secretkey: "",
        is_bold_storage: parseInt(vaultData),
        dns_bold: "",
        region_bold: "",
        bucket_bold: "",
        client_bucket_bold: "",
        update_data: 0,
        storage_id: 0,
    });

    useEffect(() => {
        if (currentData) {
            setVaultData(currentData.is_bold_storage)
            setDataForm({
                userId: 1,
                type_mbox: currentData.type_mbox,
                ip_url: currentData.ip_url,
                port: currentData.port,
                secretkey: currentData.secretkey,
                is_bold_storage: currentData.is_bold_storage,
                dns_bold: currentData.dns_bold,
                region_bold: currentData.region_bold,
                bucket_bold: currentData.bucket_bold,
                client_bucket_bold: currentData.client_bucket_bold,
                update_data: 1,
                storage_id: currentData.id
            })
        }
        else {
            setDataForm({
                userId: 1,
                type_mbox: "light",
                ip_url: "",
                port: "",
                secretkey: "",
                is_bold_storage: parseInt(vaultData),
                dns_bold: "",
                region_bold: "",
                bucket_bold: "",
                client_bucket_bold: "",
                update_data: 0,
                storage_id: 0,
            })
        }
    }, [currentData])

    const addUrlStorage = (event) => {
        event.preventDefault();
        // let data = {
        //     userId: 1,
        //     type_mbox: dataForm.type_mbox,
        //     ip_url: dataForm.ip_url,
        //     port: parseInt(dataForm.port),
        //     secretkey: dataForm.secretkey,
        //     is_bold_storage: parseInt(vaultData),
        //     dns_bold: dataForm.dns_bold,
        //     region_bold: dataForm.region_bold,
        //     bucket_bold: dataForm.bucket_bold,
        //     client_bucket_bold: dataForm.client_bucket_bold,
        //     update_data: dataForm.update_data,
        //     storage_id: dataForm.storage_id
        // }

        // VERIFICAR SI SE PUEDE ENVIAR DATA EN VARIABLES MÁS ADELANTE...

        if (showModalUrlStorage === "Agregar Url Storage" || showModalUrlStorage === "Actualizar Url Storage") {
            createUpdateStorage({
                variables: {
                    userId: 1,
                    type_mbox: dataForm.type_mbox,
                    ip_url: dataForm.ip_url,
                    port: parseInt(dataForm.port),
                    secretkey: dataForm.secretkey,
                    is_bold_storage: parseInt(vaultData),
                    dns_bold: dataForm.dns_bold,
                    region_bold: dataForm.region_bold,
                    bucket_bold: dataForm.bucket_bold,
                    client_bucket_bold: dataForm.client_bucket_bold,
                    update_data: dataForm.update_data,
                    storage_id: dataForm.storage_id
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
                if (showModalUrlStorage === "Agregar Url Storage") {
                    ToastsStore.success("Url Storage creado con éxito")
                }
                if (showModalUrlStorage === "Actualizar Url Storage") {
                    ToastsStore.success("Url Storage actualizado con éxito")
                }
                setShowModalUrlStorage(false);
                setCurrentData(false)
            }, 2000);
        }
        if (showModalUrlStorage === "Eliminar Url Storage") {
            deleteStorage({
                variables: {
                    userId: 1,
                    storage_id: dataForm.storage_id
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
                ToastsStore.success("Url Storage eliminado con éxito")
                setShowModalUrlStorage(false);
                setCurrentData(false)
            }, 2000);
        }
    }

    const changeVault = (event, data) => {
        if (data) {
            setVaultData(data.value)
        }
        if (data.value === 0) {
            setDataForm({
                ...dataForm,
                region_bold: "",
                bucket_bold: "",
                client_bucket_bold: "",
            })
        }
    }

    const changeMbox = (event, data) => {
        if (data) {
            setMboxData(data.value)
        }
        if (data.value === "pro") {
            setDataForm({
                ...dataForm,
                ip_url: "",
                port: "",
                secretkey: "",
                is_bold_storage: 1,
            })

            setVaultData(1)
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
            {showModalUrlStorage === "Agregar Url Storage" || showModalUrlStorage === "Actualizar Url Storage" ?
                <Modal size="md" backdrop={"static"} show={showModalUrlStorage ? true : false} onHide={hide}>
                    <Modal.Header closeButton>
                        {
                            showModalUrlStorage === "Agregar Url Storage" ?
                                <h3>Nuevo Url Storage</h3>
                                :
                                showModalUrlStorage === "Actualizar Url Storage" ?
                                    <h3>Actualizar Url Storage</h3>
                                    :
                                    null
                        }
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={addUrlStorage}>
                            <Form.Group>
                                <Form.Field>
                                    <label>IP URL</label>
                                    <input
                                        placeholder="Ingrese IP..."
                                        name="ip_url"
                                        type="text"
                                        value={dataForm.ip_url}
                                        onChange={changeInfo}
                                        disabled={mboxData === "pro"}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Tipo Mbox</label>
                                    <Form.Radio
                                        label="light"
                                        value={"light"}
                                        checked={mboxData === "light"}
                                        onChange={changeMbox}
                                    />
                                    <Form.Radio
                                        label="pro"
                                        value={"pro"}
                                        checked={mboxData === "pro"}
                                        onChange={changeMbox}
                                    />
                                    {/* <label>Tipo Mbox</label>
                                    <select name="type_mbox" onChange={changeInfo}>
                                        <option key={1} value="light">light</option>
                                        <option key={2} value="pro">pro</option>
                                    </select> */}
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
                                        disabled={mboxData === "pro"}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Clave secreta</label>
                                    <input
                                        placeholder="Ingrese clave..."
                                        name="secretkey"
                                        type="text"
                                        value={dataForm.secretkey}
                                        onChange={changeInfo}
                                        disabled={mboxData === "pro"}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field>
                                    <label>Es Vault Storage?</label>
                                    <Form.Radio
                                        label="NO"
                                        value={0}
                                        checked={vaultData === 0}
                                        onChange={changeVault}
                                    />
                                    <Form.Radio
                                        label="SÍ"
                                        value={1}
                                        checked={vaultData === 1}
                                        onChange={changeVault}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>DNS</label>
                                    <input
                                        placeholder="Ingrese DNS..."
                                        name="dns_bold"
                                        type="text"
                                        value={dataForm.dns_bold}
                                        onChange={changeInfo}
                                        disabled={vaultData === 0}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field>
                                    <label>Región</label>
                                    <input
                                        placeholder="Ingrese región..."
                                        name="region_bold"
                                        type="text"
                                        value={dataForm.region_bold}
                                        onChange={changeInfo}
                                        disabled={vaultData === 0}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Bucket</label>
                                    <input
                                        placeholder="Ingrese bucket..."
                                        name="bucket_bold"
                                        type="text"
                                        value={dataForm.bucket_bold}
                                        onChange={changeInfo}
                                        disabled={vaultData === 0}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Cliente</label>
                                    <input
                                        placeholder="Ingrese cliente..."
                                        name="client_bucket_bold"
                                        type="text"
                                        value={dataForm.client_bucket_bold}
                                        onChange={changeInfo}
                                        disabled={vaultData === 0}
                                    />
                                </Form.Field>
                            </Form.Group>
                            {
                                showModalUrlStorage === "Agregar Url Storage" ?

                                    mboxData === "light" ?
                                        <Button
                                            className="styleBtnAdd btn-block"
                                            type="submit"
                                            disabled={
                                                dataForm.ip_url === "" ||
                                                dataForm.port === ""
                                            }
                                        >
                                            AGREGAR URL STORAGE
                                        </Button>
                                        :
                                        mboxData === "pro" ?
                                            <Button
                                                className="styleBtnAdd btn-block"
                                                type="submit"
                                                disabled={
                                                    dataForm.dns_bold === "" ||
                                                    dataForm.region_bold === "" ||
                                                    dataForm.bucket_bold === "" ||
                                                    dataForm.client_bucket_bold === ""
                                                }
                                            >
                                                AGREGAR URL STORAGE
                                            </Button>
                                            :
                                            null
                                    :
                                    showModalUrlStorage === "Actualizar Url Storage" ?
                                        mboxData === "light" ?
                                            <Button
                                                className="styleBtnAdd btn-block"
                                                type="submit"
                                                disabled={
                                                    dataForm.ip_url === "" ||
                                                    dataForm.port === ""
                                                }
                                            >
                                                ACTUALIZAR URL STORAGE
                                            </Button>
                                            :
                                            mboxData === "pro" ?
                                                <Button
                                                    className="styleBtnAdd btn-block"
                                                    type="submit"
                                                    disabled={
                                                        dataForm.dns_bold === "" ||
                                                        dataForm.region_bold === "" ||
                                                        dataForm.bucket_bold === "" ||
                                                        dataForm.client_bucket_bold === ""
                                                    }
                                                >
                                                    ACTUALIZAR URL STORAGE
                                                </Button>
                                                :
                                                null
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
                showModalUrlStorage === "Eliminar Url Storage" ?
                    <Modal size="md" backdrop={"static"} show={showModalUrlStorage ? true : false} onHide={hide}>
                        <Modal.Header closeButton>
                            <h3>Eliminar Url Storage</h3>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={addUrlStorage}>
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
                                    <Button onClick={() => setShowModalUrlStorage(false)}>
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