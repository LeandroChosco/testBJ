import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";
import { useMutation } from '@apollo/client'
import { CAT_CARRIER, DELETE_CARRIER } from '../../graphql/mutations'
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

export default function ModalCatCarrier(props) {

    const { showModalCatCarrier, setShowModalCatCarrier, hide, currentData, setCurrentData } = props
    const token = TOKEN_FIX;

    const [createUpdateCarrier] = useMutation(CAT_CARRIER)
    const [deleteCarrier] = useMutation(DELETE_CARRIER)

    const [isLoading, setIsloading] = useState(false);

    const [dataForm, setDataForm] = useState({
        userId: 6062,
        carrier: "",
        update_data: 0,
        carrier_id: 0
    });

    useEffect(() => {
        if (currentData) {
            setDataForm({
                userId: 6062,
                carrier: currentData.carrier,
                update_data: 1,
                carrier_id: currentData.id
            })
        }
        else {
            setDataForm({
                userId: 6062,
                carrier: "",
                update_data: 0,
                carrier_id: 0
            })
        }
    }, [currentData]);

    const addCatCarrier = (event) => {
        event.preventDefault();
        // let data = {
        //     userId: 6062,
        //     carrier: dataForm.carrier,
        //     update_data: dataForm.update_data,
        //     carrier_id: dataForm.carrier_id,
        // }

        // VERIFICAR SI SE PUEDE ENVIAR DATA EN VARIABLES MÁS ADELANTE...

        if (showModalCatCarrier === "Agregar Cat Carrier" || showModalCatCarrier === "Actualizar Cat Carrier") {
            createUpdateCarrier({
                variables: {
                    userId: 6062,
                    carrier: dataForm.carrier,
                    update_data: dataForm.update_data,
                    carrier_id: dataForm.carrier_id
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
                if (showModalCatCarrier === "Agregar Cat Carrier") {
                    ToastsStore.success("Cat Carrier creado con éxito")
                }
                if (showModalCatCarrier === "Actualizar Cat Carrier") {
                    ToastsStore.success("Cat Carrier actualizado con éxito")
                }
                setShowModalCatCarrier(false);
                setCurrentData(false)
            }, 2000);
        }
        if (showModalCatCarrier === "Eliminar Cat Carrier") {
            deleteCarrier({
                variables: {
                    userId: 6062,
                    carrier_id: dataForm.carrier_id
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
                ToastsStore.success("Cat Carrier eliminado con éxito")
                setShowModalCatCarrier(false);
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
            {showModalCatCarrier === "Agregar Cat Carrier" || showModalCatCarrier === "Actualizar Cat Carrier" ?
                <Modal size="md" backdrop={"static"} show={showModalCatCarrier ? true : false} onHide={hide}>
                    <Modal.Header closeButton>
                        {
                            showModalCatCarrier === "Agregar Cat Carrier" ?
                                <h3>Nuevo Cat Carrier</h3>
                                :
                                showModalCatCarrier === "Actualizar Cat Carrier" ?
                                    <h3>Actualizar Cat Carrier</h3>
                                    :
                                    null
                        }
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={addCatCarrier}>
                            <Form.Field>
                                <label>Carrier</label>
                                <input
                                    placeholder="Ingrese carrier..."
                                    name="carrier"
                                    type="text"
                                    value={dataForm.carrier}
                                    onChange={changeInfo}
                                />
                            </Form.Field>
                            {
                                showModalCatCarrier === "Agregar Cat Carrier" ?
                                    <Button
                                        className="styleBtnAdd btn-block"
                                        type="submit"
                                        disabled={
                                            dataForm.carrier === ""
                                        }
                                    >
                                        AGREGAR CAT CARRIER
                                    </Button>
                                    :
                                    showModalCatCarrier === "Actualizar Cat Carrier" ?
                                        <Button
                                            className="styleBtnAdd btn-block"
                                            type="submit"
                                            disabled={
                                                dataForm.carrier === ""
                                            }
                                        >
                                            ACTUALIZAR CAT CARRIER
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
                showModalCatCarrier === "Eliminar Cat Carrier" ?
                    <Modal size="md" backdrop={"static"} show={showModalCatCarrier ? true : false} onHide={hide}>
                        <Modal.Header closeButton>
                            <h3>Eliminar Cat Carrier</h3>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={addCatCarrier}>
                                <Form.Field>
                                    <label>Está seguro que desea eliminar este carrier?</label>
                                    <input
                                        placeholder="Ingrese nombre..."
                                        name="carrier"
                                        type="text"
                                        value={dataForm.carrier}
                                        readOnly
                                    />
                                </Form.Field>
                                <Form.Group inline>
                                    <Button onClick={() => setShowModalCatCarrier(false)}>
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