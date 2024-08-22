import React, { useState } from "react";
import { Row } from "reactstrap";

export default function VehiclesSelector(props) {

    const [filterGraphic, setFilterGraphic] = useState("week")

    const changeFilter = (event) => {
        if (event.target.value) {
            setFilterGraphic(event.target.value)
        }
    }

    return (
        <div style={{ padding: "1rem" }}>
            <p style={{ display: "flex", justifyContent: "flex-start" }}>Filtrar por:</p>
            <Row>
                <input type={"radio"} value={"week"} checked={filterGraphic === "week"} onClick={changeFilter} />
                <label style={{marginLeft: "0.5rem"}}>Semana</label>
            </Row>
            <Row>
                <input type={"radio"} value={"day"} checked={filterGraphic === "day"} onClick={changeFilter} />
                <label style={{marginLeft: "0.5rem"}}>Día</label>
            </Row>
        </div>
    )
}