import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { CircleSpinner } from 'react-spinners-kit';
import { Form, Button } from "semantic-ui-react";
import { CSVLink } from 'react-csv';
import conections from '../../conections';
import moment from 'moment';

const ModalDownloadCSV = ({ modal, hide, current_camera, current_page, last_page, showNotification, renderLoading }) => {

    const [dataToDownload, setDataToDownload] = useState([]);
    const [dataQuantity, setDataQuantity] = useState(50);
    const [loading, setLoading] = useState(false);
    const [renderDays, setRenderDays] = useState(false);
    const [currentDay, setCurrentDay] = useState(null);
    const [arrayWeek, setArrayWeek] = useState([]);

    function changeInfo(event, data) {
        if (data) {
            setDataQuantity(data.value);
        } else {
            setDataQuantity(event.target.value);
        };
    };

    function downloadData() {

        setLoading(true);
        let body = {
            cam_id: current_camera,
            date: currentDay,
            limit: parseInt(dataQuantity),
        };

        conections.getHistorialToDownload(body).then(response => {
            if (response.data.success) {
                let data = response.data.data;
                if (data.length > 0) {
                    let arrayToConvert = data.map((el) => {
                        return {
                            status_router: el.camera.router.active === 1 ? "online" : "offline",
                            status_camera: el.camera.ip.active === 1 ? "online" : "offline",
                            date: el.createdAt
                        };
                    });
                    setDataToDownload(arrayToConvert);

                    setTimeout(() => {
                        document.getElementById("csvLink").click();
                        setLoading(false);
                        hide();
                        showNotification({
                            message: "Descarga realizada con éxito",
                            level: "success",
                            position: 'tc',
                            title: "Descarga de CSV",
                            autoDismiss: 4,
                        });
                    }, 1000);
                } else {
                    setTimeout(() => {
                        setLoading(false);
                        hide();
                        showNotification({
                            message: "No hay registros para la fecha indicada.",
                            level: "warning",
                            position: 'tc',
                            title: "No hay registros",
                            autoDismiss: 4,
                        });
                    }, 1000);
                }
            } else {
                setTimeout(() => {
                    setLoading(false);
                    hide();
                    showNotification({
                        message: "No es posible descargar registros para esa fecha. Pruebe con otra.",
                        level: "warning",
                        position: 'tc',
                        title: "Registros no disponibles",
                        autoDismiss: 4,
                    });
                }, 1000);

            }
        }).catch(err => {
            console.log(err);
            setTimeout(() => {
                setLoading(false);
                hide();
                showNotification({
                    message: "No es posible descargar registros para esa fecha. Pruebe con otra.",
                    level: "warning",
                    position: 'tc',
                    title: "Registros no disponibles",
                    autoDismiss: 4,
                });
            }, 1000);
        });
    };

    function renderDaysButtons(firstDay, lastDay) {
        let arrayDates = [];
        let totalDays = moment(firstDay).diff(lastDay, 'days');

        if (totalDays > 7) {
            for (let i = 0; i < 7; i++) {
                let dateToPush = moment(firstDay).subtract(i, 'days').startOf('date').format().split("T")[0];
                arrayDates.unshift(dateToPush);
            };
        } else {
            for (let i = 0; i <= totalDays; i++) {
                let dateToPush = moment(firstDay).subtract(i, 'days').startOf('date').format().split("T")[0];
                arrayDates.unshift(dateToPush);
            };
        };

        setArrayWeek(arrayDates);
    }

    useEffect(() => {

        moment.locale('es');

        setRenderDays(true);

        conections.getHistorialConection(current_camera, last_page).then(response => {
            let last_day = response.data.current_page[0].createdAt.split(" ")[0];

            conections.getHistorialConection(current_camera, 0).then(resp => {
                let first_day = resp.data.current_page[0].createdAt.split(" ")[0];
                setCurrentDay(first_day);
                renderDaysButtons(first_day, last_day);

                setTimeout(() => {
                    setRenderDays(false);
                }, 500);
            }).catch(err => console.log(err));

        }).catch(err => console.log(err));
    }, []);

    return (
        <Modal size="lg" backdrop={"static"} show={modal} onHide={hide}>
            <Modal.Header closeButton>
                <h2>
                    Descarga de CSV
                </h2>
            </Modal.Header>
            {
                renderDays ?
                    <div style={{ display: "flex", justifyContent: "center", alignContent: "center", padding: "5rem" }}>
                        {renderLoading()}
                    </div>
                    :
                    <Modal.Body style={{ padding: "1.5rem" }}>
                        <Form onSubmit={downloadData}>
                            <div style={{ marginBottom: "1rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    {
                                        arrayWeek.map((el, idx) => {
                                            let buttonDate = moment(el).format('ll');
                                            return (
                                                <button type='button' key={idx} className={currentDay === el ? "btn btn-primary ml-auto mr-auto mb-2" : "btn btn-outline-primary ml-auto mr-auto mb-2"} onClick={() => setCurrentDay(el)} >{buttonDate.split(" de ")[0] + " " + buttonDate.split(" de ")[1].split(".")[0].slice(0, 1)[0].toUpperCase() + buttonDate.split(" de ")[1].split(".")[0].slice(1)}</button>
                                            );
                                        })
                                    }
                                </div>
                                <div style={{ display: "flex", padding: "1rem" }}>
                                    <p style={{ alignSelf: "center", paddingRight: "1rem", margin: "0" }}>
                                        Descargar los últimos
                                    </p>
                                    <select onChange={changeInfo} style={{ width: "6rem" }}>
                                        <option value={50}>{50}</option>
                                        <option value={100}>{100}</option>
                                        <option value={""}>Todos</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ padding: "0 1rem" }}>
                                <Button
                                    type="submit"
                                >
                                    Descargar
                                </Button>
                            </div>
                        </Form>
                        <CSVLink
                            id="csvLink"
                            data={dataToDownload}
                            filename={`CSV-Report_${dataQuantity}/DATE-${currentDay}@${current_page[0].camera.zerotier.zerotier_network}/CAM_ID_${current_page[0].camera.id}`}
                            style={{ display: "none" }}
                        >Descarga</CSVLink>
                    </Modal.Body>
            }
            {loading && (
                <div style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                }}>
                    <CircleSpinner size={30} color="#D7DBDD" loading={loading} />
                </div>
            )
            }
        </Modal >
    );
};

export default ModalDownloadCSV;