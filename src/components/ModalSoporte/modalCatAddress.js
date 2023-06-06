import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";
import { useMutation } from '@apollo/client'
import { CAT_ADDRESS, DELETE_ADDRESS } from '../../graphql/mutations'
import { TOKEN_FIX, RADAR_ID } from '../../constants/token';

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

export default function ModalCatAddress(props) {

    const { showModalCatAddress, setShowModalCatAddress, hide, currentData, setCurrentData } = props
    const token = TOKEN_FIX;

    let userId = parseInt(localStorage.getItem(RADAR_ID));

    const [createUpdateAddress] = useMutation(CAT_ADDRESS)
    const [deleteAddress] = useMutation(DELETE_ADDRESS)

    const [isLoading, setIsloading] = useState(false);

    const [dataForm, setDataForm] = useState({
        userId: userId,
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
        update_data: 0,
        address_id: 0,
    });

    useEffect(() => {
        if (currentData) {
            setDataForm({
                userId: userId,
                codigoPostal: currentData.d_cp,
                asenta: currentData.d_asenta,
                tipoAsenta: currentData.d_tipo_asenta,
                municipio: currentData.d_mnpio,
                estado: currentData.d_estado,
                ciudad: currentData.d_ciudad,
                codigoEstado: currentData.c_estado,
                codigoTipoAsenta: currentData.c_tipo_asenta,
                codigoMunicipio: currentData.c_mnpio,
                idAsenta: currentData.id_asenta_cpcons,
                zona: currentData.d_zona,
                codigoCVECiudad: currentData.c_cve_ciudad,
                update_data: 1,
                address_id: currentData.id,
            })
        }
        else {
            setDataForm({
                userId: userId,
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
                update_data: 0,
                address_id: 0,
            })
        }
    }, [currentData])

    const addCatAddress = (event) => {
        event.preventDefault();
        setIsloading(true);
        if (showModalCatAddress === "Agregar Cat Address" || showModalCatAddress === "Actualizar Cat Address") {
            createUpdateAddress({
                variables: {
                    userId: userId,
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
                    update_data: dataForm.update_data,
                    address_id: dataForm.address_id,
                },
                context: {
                    headers: {
                        "Authorization": token ? token : "",
                    }
                },
            })
                .then(response => {
                    if(response.data && response.data.CreateUpdateCatAddress.success){
                        setTimeout(() => {
                            setIsloading(false);
                            if (showModalCatAddress === "Agregar Cat Address") {
                                ToastsStore.success("Cat Address creado con éxito");
                            }
                            if (showModalCatAddress === "Actualizar Cat Address") {
                                ToastsStore.success("Cat Address actualizado con éxito");
                            }
                            setShowModalCatAddress(false);
                            setCurrentData(false);
                        }, 2000);
                    } else {
                        setTimeout(() => {
                            setIsloading(false);
                            if (showModalCatAddress === "Agregar Cat Address") {
                                ToastsStore.error("No se pudo agregar el Cat Address. Reintente o contáctese con soporte");
                            }
                            if (showModalCatAddress === "Actualizar Cat Address") {
                                ToastsStore.error("No se pudo actualizar el Cat Address. Reintente o contáctese con soporte");
                            }
                            setShowModalCatAddress(false);
                            setCurrentData(false);
                        }, 2000);
                    }
                })
                .catch(err => {
                    console.log(err);
                    setTimeout(() => {
                        setIsloading(false);
                        ToastsStore.error(`Algo falló. Contáctese con soporte`);
                        setShowModalCatAddress(false);
                        setCurrentData(false);
                    }, 2000);
                })
        }
        if (showModalCatAddress === "Eliminar Cat Address") {
            deleteAddress({
                variables: {
                    userId: userId,
                    address_id: dataForm.address_id
                },
                context: {
                    headers: {
                        "Authorization": token ? token : "",
                    }
                },
            })
                .then(response => {
                    if(response.data && response.data.DeleteCatAddress.success){
                        setTimeout(() => {
                            setIsloading(false);
                            ToastsStore.success("Cat Address eliminado con éxito");
                            setShowModalCatAddress(false);
                            setCurrentData(false);
                        }, 2000);
                    } else {
                        setTimeout(() => {
                            setIsloading(false);
                            ToastsStore.error("No se pudo eliminar el Cat Address. Reintente o contáctese con soporte");
                            setShowModalCatAddress(false);
                            setCurrentData(false);
                        }, 2000);
                    }
                })
                .catch(err => {
                    console.log(err);
                    setTimeout(() => {
                        setIsloading(false);
                        ToastsStore.error(`Algo falló. Contáctese con soporte`);
                        setShowModalCatAddress(false);
                        setCurrentData(false);
                    }, 2000);
                })

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
            {showModalCatAddress === "Agregar Cat Address" || showModalCatAddress === "Actualizar Cat Address" ?
                <Modal size="md" backdrop={"static"} show={showModalCatAddress ? true : false} onHide={hide}>
                    <Modal.Header closeButton>
                        {
                            showModalCatAddress === "Agregar Cat Address" ?
                                <h3>Nuevo Cat Address</h3>
                                :
                                showModalCatAddress === "Actualizar Cat Address" ?
                                    <h3>Actualizar Cat Address</h3>
                                    :
                                    null
                        }
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={addCatAddress}>

                            <Form.Group>
                                <Form.Field>
                                    <label>Código Postal</label>
                                    <input
                                        placeholder="Ingrese Código Postal..."
                                        name="codigoPostal"
                                        type="text"
                                        value={dataForm.codigoPostal}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
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
                            </Form.Group>
                            <Form.Group>
                                <Form.Field>
                                    <label>Asenta</label>
                                    <input
                                        placeholder="Ingrese asenta..."
                                        name="asenta"
                                        type="text"
                                        value={dataForm.asenta}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
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
                            </Form.Group>
                            <Form.Group>
                                <Form.Field>
                                    <label>Tipo asenta</label>
                                    <input
                                        placeholder="Ingrese tipo..."
                                        name="tipoAsenta"
                                        type="text"
                                        value={dataForm.tipoAsenta}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Código Tipo Asenta</label>
                                    <input
                                        placeholder="Ingrese código..."
                                        name="codigoTipoAsenta"
                                        type="text"
                                        value={dataForm.codigoTipoAsenta}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
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
                            </Form.Group>
                            <Form.Group>
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
                                <Form.Field>
                                    <label>Código Ciudad</label>
                                    <input
                                        placeholder="Ingrese código..."
                                        name="codigoCVECiudad"
                                        type="text"
                                        value={dataForm.codigoCVECiudad}
                                        onChange={changeInfo}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
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
                            </Form.Group>
                            {
                                showModalCatAddress === "Agregar Cat Address" ?
                                    <Button
                                        className="styleBtnAdd btn-block"
                                        type="submit"
                                        disabled={
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
                                        AGREGAR CAT ADDRESS
                                    </Button>
                                    :
                                    showModalCatAddress === "Actualizar Cat Address" ?
                                        <Button
                                            className="styleBtnAdd btn-block"
                                            type="submit"
                                            disabled={
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
                                            ACTUALIZAR CAT ADDRESS
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
                    )
                    }
                </Modal>
                :
                showModalCatAddress === "Eliminar Cat Address" ?
                    <Modal size="md" backdrop={"static"} show={showModalCatAddress ? true : false} onHide={hide}>
                        <Modal.Header closeButton>
                            <h3>Eliminar Cat Address</h3>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={addCatAddress}>
                                <Form.Field>
                                    <label>Está seguro que desea eliminar este Código Postal?</label>
                                    <input
                                        placeholder="Ingrese nombre..."
                                        name="codigoPostal"
                                        type="text"
                                        value={dataForm.codigoPostal}
                                        readOnly
                                    />
                                </Form.Field>
                                <Form.Group inline>
                                    <Button onClick={() => setShowModalCatAddress(false)}>
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
                        )
                        }
                    </Modal>
                    :
                    null
            }
        </>
    )
}
