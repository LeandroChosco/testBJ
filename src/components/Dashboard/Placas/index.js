import React from "react";
import {
  BubleChart,
  ColumnChart,
  CurveDash,
  DonoutDash,
  HeatMapChart,
} from "./graphic";
import SummaryCount from "./summaryCount";
import TableD from "./table";
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";
const Placas = () => {
  return (
    <div className="container-fluid py-4 ">
      <span className="text-h1">Licence Plate Recognition</span>
      <p className="pb-4">Powered by Radar </p>

      <p className="pr-intro pb-2">
        El análisis de reconocimiento de matrículas (LPR) de Radar lee
        automáticamente la información de matrículas y la vincula a videos en
        vivo y grabados. Gracias a esto, los operadores de seguridad pueden
        buscar y encontrar rápidamente videos específicos de matrículas de
        vehículos capturadas para su verificación e investigación
      </p>
      <SummaryCount />
      <Row className="py-4">
        <Col xl={3}>
          <Row>
            <Col xl={9} className="mb-2">
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
            </Col>
            <Col xl={6} className="mt-5">
              <span className="text-h1  text-porcent mb-4">30%</span>
              <p className="">Col. Del Valle Sur.</p>
            </Col>
            <Col xl={6} className="mt-5">
              <span className="text-h1  text-porcent mb-4">30%</span>
              <p className="">Col. Del Valle Sur.</p>
            </Col>
            <Col xl={6} className="mt-5">
              <span className="text-h1  text-porcent mb-4">30%</span>
              <p className="">Col. Del Valle Sur.</p>
            </Col>
            <Col xl={6} className="mt-5">
              <span className="text-h1  text-porcent mb-4">30%</span>
              <p className="">Col. Del Valle Sur.</p>
            </Col>
            <Col xl={6} className="mt-5">
              <span className="text-h1  text-porcent mb-4">30%</span>
              <p className="">Col. Del Valle Sur.</p>
            </Col>
            <Col xl={6} className="mt-5">
              <span className="text-h1  text-porcent mb-4">30%</span>
              <p className="">Col. Del Valle Sur.</p>
            </Col>
          </Row>
        </Col>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardBody>
              <BubleChart />
            </CardBody>
          </Card>
        </Col>
        <Col xl={3}>
          <Row>
            <Col className="py-4" xl={8}>
              <h3>Calle 12, Col. del Valle Sur</h3>
            </Col>
            <Col xl={6}>
              <span className="text-h1">6,090</span>
              <p>Conteo</p>
            </Col>
            <Col xl={6}>
              <span className="text-h1">6,090</span>
              <p>Conteo</p>
            </Col>
            <Col className="py-3">
              <h5>
                <b>Ranking Placas</b>
              </h5>

              <thead className="">
                <tr className="">
                  <th  >Placa</th>
                  <th className="px-5">Coincidencia</th>
                  <th>Vehículo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>JJ229</td>
                  <td className="px-5 pt-2">129</td>
                  <td>Motocicleta</td>
                </tr>
                <tr>
                  <td>JS123V</td>
                  <td className="px-5 pt-2">394</td>
                  <td>Carro</td>
                </tr>
                <tr>
                  <td>EE182H</td>
                  <td className="px-5 pt-2">201</td>
                  <td>Carro</td>
                </tr>
              </tbody>
            </Col>
          </Row>
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
                checked
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
              />
              <label class="form-check-label" for="exampleRadios2">
                Mes
              </label>
            </div>
          </Row>
          <span className="text-xxs">Mes de octubre</span>
        </div>

        <Row className="py-4 px-5">
          <Col xl={6} lg={12} md={12}>
            <Card>
              <CardHeader>Coincidencias por Placa</CardHeader>
              <CardBody>
                <ColumnChart />
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
                {/* <CurveDash/> */}
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
