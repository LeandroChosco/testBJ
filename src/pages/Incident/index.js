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
import dataMap from './dataMapById.json';
import './style.css'
import FilterButtons from "./FilterButtons";
import conections from "../../conections";



export default function Incident(props) {
  // const dataMap = props.dataMap;
  const [loading, setLoading] = useState(false);
  const [dataMapState, setDataMapState] = useState(dataMap.sort((a, b) => a.creationDate > b.creationDate ? -1 : 1));
  const dayWeek = [];
  const week = [];
  const incident = [];
  if ((dataMap && dataMap.length > 0)) {

    dataMap.map((days) => {
      dayWeek.push(days.creationDate);
      if (days.tag) {
        incident.push(days.tag);
      }
    });
    dayWeek
      .filter((week) => moment(week).format("l") < moment().format("l"))
      .filter(
        (week) =>
          moment(week).format("l") > moment().subtract(10, "days").calendar()
      )
      .map((days) => week.push(days));
  }
  const tagsFilter = [...new Set(incident)];
  let countTag = [];
  let conjuntoIncidentes = [];
  if ((dataMap && dataMap.length > 0)) {
    tagsFilter.map((tag, index) => {
      let count = dataMap.filter((data) => data.tag === tag);
      countTag.push(count.length);
      conjuntoIncidentes.push({
        tag: tag,
        total: count.length,
      });
    });

  }

  // function handleSearch(value) {

  //   let auxArray = [];
  //   value.map((element) => {
  //     let results = (dataMap.filter((data) => data.tag === element));
  //     results.map((data) => {
  //       auxArray.push(data);
  //     })
  //     // console.log(results)
  //   })
  //   if (auxArray.length > 0) {
  //     auxArray.sort((a, b) => {
  //       if (a.creationDate > b.creationDate) {
  //         return -1;
  //       }
  //       if (a.creationDate < b.creationDate) {
  //         return 1;
  //       }
  //     })
  //     setDataMapState(auxArray);
  //   } else {
  //     setDataMapState(dataMap);
  //   }
  // }

  function handleReset() {
    setDataMapState(dataMap);
  };

  function loadData(filter){
    setLoading(true);
    // Acá dentro hay que hacer el endpoint.
    conections.getIncidentsMap(filter).then(response => {
      if(response.data.success){
        let incidentsMap = response.data.data.sort((a, b) => a.creationDate > b.creationDate ? -1 : 1);
        setDataMapState(incidentsMap);
      };
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    })
    .catch(err => console.log(err));
  };

  useEffect(() => {
    loadData();
  },[]);

  return (
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
              overflow: "scroll",
              overflowX: "hidden",
              alignItems: "center"
            }}
          >
            <Card.Header
              style={{ textAlign: "center", fontWeight: "bold", backgroundColor: "white", border: "none" }}
            >
              TIME LINE
            </Card.Header>
            <TimeLine data={(dataMap && dataMap.length > 0) ? dataMapState : dataMap} />
          </Card>
        </Col>
        <Col lg={8} md={8}>
          <Col style={{ height: "100%" }}>
            <Row style={{ marginTop: '5px' }}>
              <Col lg={12} md={12} style={{ padding: "1.5rem 0" }}>
                {/* <SearchBar data={(dataMap && dataMap.length > 0) ? tagsFilter : null} handleSearch={handleSearch} handleReset={handleReset} /> */}
                {/*<TotalIncidents dataMap={dataMap} tags={conjuntoIncidentes} />*/}
                <FilterButtons handleSearch={loadData} handleReset={handleReset} />
              </Col>
            </Row>
            <Row style={{ height: "85%" }}>
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
                  {(dataMap && dataMap.length > 0) && (
                    <MapaGoogle dataMap={dataMapState.length > 0 ? dataMapState : dataMap} />
                  )}
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