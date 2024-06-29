import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Image,
  Row,
  Col
} from "react-bootstrap";
import SearchBar from './searchBar'
import MapaGoogle from "./map"
import TimeLine from "./timeline"
import TotalIncidents from "./totalIncidents";
import GenderDetected from "../../components/Dashboard/genderDetected";
import PeoplePerDay from "../../components/Dashboard/persons";
import * as moment from "moment";
// import dataMap from './dataMapById.json';
import './style.css'
import FilterButtons from "./FilterButtons";
import LoadingLogo from "../../components/LoadingLogo";
import conections from "../../conections";



export default function Incident(props) {
  // const dataMap = props.dataMap;
  const [dataMapState, setDataMapState] = useState([]);
  const [rendered, setRendered] = useState(false);
  // const dayWeek = [];
  // const week = [];
  // const incident = [];

  // function handleReset() {
  //   setDataMapState(dataMap);
  // };

  function loadData(filter) {
    conections.getIncidentsMap(filter).then(response => {
      if (response.data.success) {
        let incidentsMap = response.data.data.sort((a, b) => a.creationDate > b.creationDate ? -1 : 1);
        setDataMapState(incidentsMap);
      };
      setTimeout(() => {
        if (!rendered) {
          setRendered(true);
        };
      }, 3000);
    })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadData();
    // setRendered(true);
  }, []);

  return (
    (!rendered) ?
      <LoadingLogo />
      :
      <Container fluid>
        <Row>
          <Col lg={4} md={4} className="justify-content-center">
            <Card
              bg={"white"}
              text={"black"}
              style={{
                width: "100%",
                height: "60rem",
                margin: "0px",
                padding: "0px",
                overflow: "hidden",
                alignItems: "center",
                border: "none"
              }}
            >
              <Card.Header
                style={{ textAlign: "center", fontWeight: "bold", backgroundColor: "white", border: "none" }}
              >
                COMUNIDAD
              </Card.Header>
              <Card.Body style={{ display: "grid" }}>
                <TimeLine />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={8} md={8}>
            <Col style={{ height: "100%" }}>
              <Row style={{ marginTop: '5px' }}>
                <Col lg={12} md={12} style={{ padding: "1.5rem 0" }}>
                  {/* <SearchBar data={(dataMap && dataMap.length > 0) ? tagsFilter : null} handleSearch={handleSearch} handleReset={handleReset} /> */}
                  <TotalIncidents />
                  <FilterButtons handleSearch={loadData} />
                </Col>
              </Row>
              <Row style={{ height: "75%" }}>
                <Card
                  bg={"white"}
                  text={"black"}
                  style={{
                    width: "100%",
                    height: "100%",
                    margin: "0px",
                    padding: "0px",
                  }}
                >
                  <Card.Header style={{ textAlign: "center", fontWeight: "bold" }}>
                    INCIDENT MAP
                  </Card.Header>
                  <Card.Body
                    style={{ padding: "0px", width: "100%", height: "100%" }}
                  >
                    <MapaGoogle dataMap={dataMapState} />
                    {/* {(dataMapState && dataMapState.length > 0) && (
                          <MapaGoogle dataMap={dataMapState.length > 0 ? dataMapState : dataMap} />
                        )} */}
                  </Card.Body>
                </Card>
              </Row>
              {/* <Row>
        <Col style={{ height: '230px' }}>
          {conjuntoIncidentes.length > 0 ? (
            <PeoplePerDay data={conjuntoIncidentes}
              filename="Incidents"
            />
          ) : (
            <div>
              <br />
              <h2 className="noDataFound">
                No data found
              </h2>
            </div>
          )}
        </Col>
      </Row> */}
            </Col>
          </Col>
        </Row>
      </Container>
  );
}