import React, { useEffect, useState } from "react";
import {
  ColumnChart,
  ColumnMonthChart,
  CurveDash,
  HeatMapChart,
} from "./graphic";
import SummaryCount from "./summaryCount";
import TableD from "./table";
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";

import conections from "../../../conections";

import MapaGoogle from "./map";
import { MODE } from "../../../constants/token";

const Placas = () => {
  const date = new Date()
  const [isWeek, setIsWeek] = useState(true);
  const dateMonth = date.getMonth();
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const [actuallMonth, setActuallMonth] = useState("Enero");
  const [cam, setCam] = useState("5213")
  const [cameras, setCameras] = useState();

  const updateMonth = () => {
    setActuallMonth(months[dateMonth]);
  };
  const [bubbleMap, setBubbleMap] = useState(null)



  const init = async () => {
    const buble = await conections.getLPRBubble();
    if (
      buble.data &&
      buble.data.msg === "ok" &&
      buble.data.success
    ) {

      setBubbleMap(buble.data.data)
    } else {

    }
  }
  const initCameras = async () => {
    const camarasLPR = await conections.getLPRCameras();
    if (
      camarasLPR.data &&
      camarasLPR.data.success
    ) {
      setCameras(camarasLPR.data.data)
    } else {

    }
  }

  useEffect(() => {
    updateMonth();
    init()
    initCameras();
  }, []);
  return (
    <div className="container-fluid py-4 ">

      <SummaryCount />
      <Row className="py-4">
        <Col xl={9} lg={12} md={12}>
          <Card>
            <CardBody
              style={{ padding: "0px", width: "100%", height: "400px" }}
            >
              {
                bubbleMap &&
                <MapaGoogle dataMap={bubbleMap} />
              }

            </CardBody>
          </Card>
        </Col>
      </Row>
      <br />
      <div style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "#f5f5f5" }}>
        <div className="py-4 px-5" style={{ background: "transparent" }}>
          <h6>Periodo</h6>
          <Row>
            <div className="form-check px-4 mt-3 mr-1" style={{ background: "transparent" }}>
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios1"
                value="option1"
                checked={isWeek}
                onClick={() => {
                  setIsWeek(true);
                }}
              />
              <label className="form-check-label" for="exampleRadios1">
                Semana
              </label>
            </div>
            <div className="form-check mt-3" style={{ background: "transparent" }}>
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios2"
                value="option2"
                checked={!isWeek}
                onClick={() => {
                  setIsWeek(false);
                }}
              />
              <label className="form-check-label" for="exampleRadios2">
                Mes
              </label>
            </div>
          </Row>
          <span className="text-xxs">Mes de {actuallMonth}</span>
          <Row>
            <div className="px-4 mt-3 mr-1" style={{ background: "transparent" }}>
              <label for="inputState">Camara</label>
              <select id="inputState" className="form-control" onChangeCapture={(value) => {
                setCam(value.target.value)
              }}>
                {
                  cameras ?
                    cameras.sort((a, b) => b.num_cam - a.num_cam).map((camera) => (
                      <option value={camera.id} >{camera.num_cam}</option>
                    )) :
                    null
                }


              </select>
            </div>
          </Row>
        </div>

        <Row className="py-4 px-5">
          <Col xl={6} lg={12} md={12}>
            <Card style={{ background: "transparent" }}>
              <CardHeader>Conteo de placas por semana</CardHeader>
              <CardBody>
                {isWeek ? (
                  <ColumnChart cam={cam} month={dateMonth} />
                ) : (
                  <ColumnMonthChart month={dateMonth} cam={cam} />
                )}
              </CardBody>
            </Card>
          </Col>
          <Col className="" xl={6} lg={12} md={12}>
            <div className="hfull card " style={{ background: "transparent" }}>
              <div className="card-header">Conteo de placas por día</div>
              <div className="w-100 center">
                <CurveDash camId={cam} />
              </div>
            </div>
          </Col>
        </Row>
        <Row className="py-4 px-5">
          <Col xl={12} lg={12} md={12}>
            <Card style={{ background: "transparent" }}>
              <CardHeader>Mapa de calor semanal</CardHeader>
              <CardBody>
                <HeatMapChart camId={cam} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      <TableD />
    </div>
  );
};

export default Placas;
