import React, { useState } from "react";
import { useEffect } from "react";
import {
    Card,
    Col
} from "react-bootstrap";
import conections from "../../conections";

export default function TotalIncidents() {

    const [dataWidgets, setDataWidgets] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        conections.getDataWidgets().then(response => {
            if (response.data.success) {
                const newDataWidgets = {
                    totalCount: response.data.total_items,
                    mostReported: `${response.data.most_used_tag._id.toUpperCase()} (${response.data.most_used_tag.count})`
                };
                setDataWidgets(newDataWidgets);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        })
    }, [])

    return (
        <>
            <div className="search">
                <Col lg={4} md={4}>
                    <Card
                        bg={"secondary"}
                        text={"white"}
                        style={{
                            height: "100%",
                            textAlign: "center",
                            justifyContent: "center",
                            boxShadow: '5px 5px lightgrey',
                        }}
                        className="mb-2"
                    >
                        <b>
                            {loading ? "Cargando datos" : `TOTAL DE INCIDENTES : ${dataWidgets.totalCount || "NO DATA"}`}
                        </b>

                    </Card>
                </Col>
                <Col lg={8} md={8}>
                    <Card
                        bg={"secondary"}
                        text={"white"}
                        style={{
                            height: "100%",
                            textAlign: "center",
                            justifyContent: "center",
                            boxShadow: '5px 5px lightgrey',
                        }}
                        className="mb-2"
                    >
                        <b>
                            {loading ? "Cargando datos" : `INCIDENTE MÁS REPORTADO : ${dataWidgets.mostReported || "NO DATA"}`}
                        </b>

                    </Card>
                </Col>
            </div>
        </>
    )
}