import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner';
import MockupPlaca from './MockupPlaca'

// Socket placas

import { getIo } from '../../constants/socketplate'


export default function Placas(props) {

    const [test, setTest] = useState("")
    const [refresh, setRefresh] = useState(false)
    const arrayDetections = []
    const io = getIo();
    const selectedCamera = props.selectedCamera
    const connection = props.reset

    useEffect(() => {
        if (connection === false) {
            io.disconnect();
            io.on('disconnect', () => { console.log("Socket disconnected") })
        } if (connection === true) {
            io.connect();
            io.on('connect', () => { console.log("Socket connected") })
            io.on("bj-create-plate-detection", (data) => {
                // if (data.ip === selectedCamera.dataCamValue.camera_ip) {
                if (data.timestamp) {
                    setRefresh(true)
                    setTest("")
                    let results = getPlates(data).slice(0, 100);
                    setTest(results);
                }
                // }
            })
        }
    }, [])

    const getPlates = (data) => {

        let timeStringToDate = `${data.timestamp.split(".")[0].split("T")[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')} ${data.timestamp.split(".")[0].split("T")[1].replace(/(\d{2})(\d{2})(\d{2})/g, '$1:$2:$3')} GMT-0000`;
        let parseDate = new Date(timeStringToDate).toLocaleString();

        let objDetection = {
            plate: data.listedInfo ? data.listedInfo.plate : "Match",
            date: parseDate.replace(",", " -"),
            event_type: data.event_type
        }
        if (objDetection.plate !== "Match") {
            arrayDetections.unshift(objDetection)
        }
        return arrayDetections
    }

    return (
        <>
            {
                connection ?
                    test.length > 0 && refresh ? test.map((placa, idx) => {
                        return (
                            <div key={idx}>
                                <Row style={{ border: "1px solid grey", borderRadius: "2px", marginTop: "10px", marginLeft: "3px", marginRight: "3px" }} className={idx === 0 ? "newPlate" : "oldPlates"} >
                                    <Col lg={12} md={12} style={{ marginTop: "20px" }}>
                                        <Row style={{ marginTop: "5px", justifyContent: "center" }}>
                                            <MockupPlaca plate={placa.plate} idx={idx} />
                                        </Row>
                                        <Row style={{ marginTop: "10px", justifyContent: "center" }}>
                                            <p><b>Visto:</b> {placa.date}</p>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })
                        :
                        <>
                            <br />
                            <Spinner animation="border" variant="info" role="status" size="xl" />
                        </>
                    : null}
        </>
    )
}