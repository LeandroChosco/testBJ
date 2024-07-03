import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import MockupPlaca from './MockupPlaca';

// Socket placas
import { getIo } from '../../constants/socketplate';


export default function Placas(props) {

    const [plates, setPlates] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const arrayDetections = [];
    const io = getIo();
    const [selectedCamera, setSelectedCamera] = useState(`CAM${props.selectedCamera.dataCamValue.id}_${props.selectedCamera.dataCamValue.dns}`);
    const connection = props.reset;

    useEffect(() => {
        if (connection === false) {
            io.removeAllListeners();
            io.disconnect();
            io.on('disconnect', () => { console.log("Socket disconnected") })
        } if (connection === true) {
            if (props.selectedCamera.id !== selectedCamera.split("CAM")[1].split("_")[0]) {
                io.removeAllListeners();
                setPlates("")
                io.disconnect();
                io.on('disconnect', () => { console.log("Socket disconnected true") })
            }
            io.connect();
            io.on('connect', () => { console.log("Socket connected") })
            io.on("bj-create-plate-detection", (data) => {
                if (data.camera_ip === selectedCamera) {
                    setRefresh(true);
                    setPlates("");
                    let results = getPlates(data).slice(0, 100);
                    setPlates(results);
                }
            })
        }
    }, [selectedCamera])

    useEffect(() => {
        setSelectedCamera(`CAM${props.selectedCamera.dataCamValue.id}_${props.selectedCamera.dataCamValue.dns}`)
    }, [props.selectedCamera])

    useEffect(() => {

    }, []);

    const getPlates = (data) => {

        let timeStringToDate = `${data.timestamp.split(".")[0].split("T")[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')} ${data.timestamp.split(".")[0].split("T")[1].replace(/(\d{2})(\d{2})(\d{2})/g, '$1:$2:$3')} GMT-0000`;
        let parseDate = new Date(timeStringToDate).toLocaleString();

        let objDetection = {
            plate: data.plate_full,
            date: parseDate.replace(",", " -"),
            event_type: data.event_type
        }
        arrayDetections.unshift(objDetection);
        return arrayDetections;
    }

    const fakePlates = [
        {
            plate: "ABS231Y",
            date: "2023-12-01 15:37"
        },
        {
            plate: "FLS2121",
            date: "2023-11-29 22:15"
        },
        {
            plate: "YBU2144",
            date: "2023-11-29 05:51"
        },
        {
            plate: "LPM70100",
            date: "2023-11-28 13:59"
        },
        {
            plate: "DSA12321",
            date: "2023-11-27 20:02"
        },
    ]

    return (
        <>
            {
                loading ?
                    <>
                        <br />
                        <Spinner animation="border" variant="info" role="status" size="xl" />
                    </>
                    :
                    fakePlates.map((el, idx) => {
                        return (
                            <div key={idx}>
                                <Row style={{ border: "1px solid grey", borderRadius: "2px", marginTop: "10px", marginLeft: "3px", marginRight: "3px" }} className={idx === 0 ? "newPlate" : "oldPlates"} >
                                    <Col lg={12} md={12} style={{ marginTop: "20px" }}>
                                        <Row style={{ marginTop: "5px", justifyContent: "center" }}>
                                            <MockupPlaca plate={el.plate} idx={idx} />
                                        </Row>
                                        <Row style={{ marginTop: "10px", justifyContent: "center" }}>
                                            <p><b>Visto:</b> {el.date}</p>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })
            }
        </>
        // <>
        //     {
        //         connection ?
        //             plates.length > 0 && refresh ? plates.map((placa, idx) => {
        //                 return (
        //                     <div key={idx}>
        //                         <Row style={{ border: "1px solid grey", borderRadius: "2px", marginTop: "10px", marginLeft: "3px", marginRight: "3px" }} className={idx === 0 ? "newPlate" : "oldPlates"} >
        //                             <Col lg={12} md={12} style={{ marginTop: "20px" }}>
        //                                 <Row style={{ marginTop: "5px", justifyContent: "center" }}>
        //                                     <MockupPlaca plate={placa.plate} idx={idx} />
        //                                 </Row>
        //                                 <Row style={{ marginTop: "10px", justifyContent: "center" }}>
        //                                     <p><b>Visto:</b> {placa.date}</p>
        //                                 </Row>
        //                             </Col>
        //                         </Row>
        //                     </div>
        //                 )
        //             })
        //                 :
        //                 <>
        //                     <br />
        //                     <Spinner animation="border" variant="info" role="status" size="xl" />
        //                 </>
        //             : null}
        // </>
    )
}