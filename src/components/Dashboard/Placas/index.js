import React, { useState } from "react";
import {
  ColumnChart,
  CurveDash,
  HeatMapChart,
} from "./graphic";
import SummaryCount from "./summaryCount";
import TableD from "./table";
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";

import MapaGoogle from "./map";

const Placas = () => {
  const [isWeek, setIsWeek] = useState(true)
  const [market, setMarket] = useState({})
  // const coords ={lat: parseFloat(data.google_cordenate.split(',')[0]), lng: parseFloat(data.google_cordenate.split(',')[1])}
  const mapBuble = [
    {
      "id": "1234",
      "name": "Colonia del Valle del Norte",
      "minName": "Col. Vall Norte",
      "addres": "Calle Juan",
      "totalCount": 40,
      "totalCoinc": 20,
      "coord": {
        "longitude":"19.3761905",
        "latitude":"-99.1830844"
      },
      "plates": [
        {
          "id": "123",
          "plate": "jj229V",
          "totalCoinc": 15,
          "typeVehicule": "Camioneta"
        },
        {
          "id": "1234",
          "plate": "aby1234",
          "totalCoinc": 5,
          "typeVehicule": "Motocicleta"
        }
      ]
    },
    {
      "id": "123",
      "name": "Colonia del Valle del Sur",
      "minName": "Col. Vall Sur",
      "addres": "Calle 12",
      "totalCount": 50,
      "totalCoinc": 30,
      "coord": {
        "longitude": "19.40086539280686",
        "latitude": "-99.15939603892132"
      },
      "plates": [
        {
          "id": "123",
          "plate": "jj229V",
          "totalCoinc": 30,
          "typeVehicule": "Camioneta"
        }
      ]
    }
  ]
  return (
    <div className="container-fluid py-4 ">
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
            <CardBody  style={{ padding: "0px", width: "100%", height: "400px" }}>
              <MapaGoogle dataMap={mapBuble} setMarket={setMarket} />
            </CardBody>
          </Card>
        </Col>
        { 
          market.coord ? 
          <Col xl={3} >
          <div className="infoMap" >   
          <Row >
            <Col className="py-4" xl={8}>
              <h3>{market.addres} {market.name}</h3>
            </Col>
            <Col xl={6}>
              <span className="text-h">{market.totalCount}</span>
              <p>Conteo</p>
            </Col>
            <Col xl={6}>
              <span className="text-h">{market.totalCoinc}</span>
              <p>Coincidencias</p>
            </Col>
            <Col className="py-3">
              <h5>
                <b>Ranking Placas</b>
              </h5>

              <thead className="table">
                <tr className="tr">
                  <th  className="th" >Placa</th>
                  <th className="px-5 th">Coincidencia</th>
                  <th className="th" >Vehículo</th>
                </tr>
              </thead>
              <tbody>
              {
                market.plates.map(placa=>(
                  <tr className="tr">
                    <td className="th" >{placa.plate}</td>
                    <td className="px-5 pt-2 th">{placa.totalCoinc}</td>
                    <td className="th" >{placa.typeVehicule}</td>
                  </tr>
                ))
              }
              </tbody>
            </Col>
          </Row>
          </div>

        </Col>
        : null
        }

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
                onClick={()=>{
                  console.log('trew')
                  setIsWeek(true)
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
                onClick={()=>{
                  console.log('false')
                  setIsWeek(false)
                }}
              />
              <label class="form-check-label" for="exampleRadios2">
                Mes
              </label>
            </div>
          </Row>
          <span className="text-xxs">Mes de octubre</span>
          <Row>
          <div className="px-4 mt-3 mr-1">
          <label for="inputState">Camara</label>
          <select id="inputState" class="form-control">
            <option selected>Choose...</option>
            <option>Camara 1</option>
          </select>
          </div>
        
          </Row>
        </div>

        <Row className="py-4 px-5">
          <Col xl={6} lg={12} md={12}>
            <Card>
              <CardHeader>Coincidencias por Placa</CardHeader>
              <CardBody>
                <ColumnChart isWeek={isWeek} />
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
