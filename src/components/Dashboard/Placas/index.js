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

const Placas = () => {
  const [isWeek, setIsWeek] = useState(true);
  const dateMonth = new Date().getMonth();
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
  const updateMonth = () => {
    setActuallMonth(months[dateMonth]);
  };
  const [bubbleMap, setBubbleMap] = useState(null)
  const init =async ()=>{
    const buble = await conections.getLPRBubble();
    if (
      buble.data &&
      buble.data.msg === "ok" &&
      buble.data.success
    ) {
        console.log(buble.data.data);
        setBubbleMap(buble.data.data)
    }
  }
 
  useEffect(() => {
    updateMonth();
    init()
  }, []);
  return (
    <div className="container-fluid py-4 ">
    
      <SummaryCount />
      <Row className="py-4">
        {/* <Col xl={3}>
          <Row> */}
            {/* <Col xl={9} className="mb-2">
              <h6>Periodo</h6>
              <div class="dropdown">
                <button
                  class="btn dropdwon-btn dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  Periodo
                </button>
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="#">
                    Hoy
                  </a>
                  <a class="dropdown-item" href="#">
                    Martes
                  </a>
                  <a class="dropdown-item" href="#">
                    Miercoles
                  </a>
                </div>
              </div>
              <span className="text-xxs text-gray">
                Hoy 31 de Octubre, hasta las 4:30 pm
              </span>
            </Col> */}
            {/* { 
              bubbleMap &&
              bubbleMap.map((location)=>(
                <Col xl={6} className="mt-5">
                  <span className="text-h1  text-porcent mb-4">{porcent(location.totalCount)} %</span>
                  <p className="">{minName(location.minName)}</p>
                </Col>
              ))
            } */}
          {/* </Row>
        </Col> */}
        <Col xl={9} lg={12} md={12}>
          <Card>
            <CardBody
              style={{ padding: "0px", width: "100%", height: "400px" }}
            >
            {
              bubbleMap &&
              <MapaGoogle dataMap={bubbleMap}  />
            }
              
            </CardBody>
          </Card>
        </Col>
      </Row>
      <div className="bg-gray">
        <div className="py-4 px-5">
          <h6>Periodo</h6>
          <Row>
            <div class="form-check px-4 mt-3 mr-1">
              <input
                class="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios1"
                value="option1"
                checked={isWeek}
                onClick={() => {
                  setIsWeek(true);
                }}
              />
              <label class="form-check-label" for="exampleRadios1">
                Semana
              </label>
            </div>
            <div class="form-check mt-3">
              <input
                class="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios2"
                value="option2"
                checked={!isWeek}
                onClick={() => {
                  setIsWeek(false);
                }}
              />
              <label class="form-check-label" for="exampleRadios2">
                Mes
              </label>
            </div>
          </Row>
          <span className="text-xxs">Mes de {actuallMonth}</span>
          <Row>
            <div className="px-4 mt-3 mr-1">
              <label for="inputState">Camara</label>
              <select id="inputState" class="form-control">
                <option>Camara 1</option>
              </select>
            </div>
          </Row>
        </div>

        <Row className="py-4 px-5">
          <Col xl={6} lg={12} md={12}>
            <Card>
              <CardHeader>Conteo por Placa</CardHeader>
              <CardBody>
                {isWeek ? (
                  <ColumnChart />
                ) : (
                  <ColumnMonthChart month={dateMonth} />
                )}
              </CardBody>
            </Card>
          </Col>
          <Col className="" xl={6} lg={12} md={12}>
            <div className="hfull card ">
              <div class="card-header">Conteo de Placas</div>
              <div className="w-100 center">
                <CurveDash />
              </div>
            </div>
          </Col>
        </Row>
        <Row className="py-4 px-5">
          <Col xl={12} lg={12} md={12}>
            <Card>
              <CardHeader>Conteo Por Placas por Día</CardHeader>
              <CardBody>
                <HeatMapChart />
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
