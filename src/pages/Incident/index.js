import React, { useState,useEffect } from "react";
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
import { ContactSupportOutlined } from "@material-ui/icons";
import './style.css'



export default function Incident(props) {
  const dataMap = props.dataMap;
  const [dataMapState, setDataMapState] = useState(dataMap);
  const dayWeek = [];
  const week = [];
  const incident = [];
  if ((dataMap && dataMap.length > 0)) {

    dataMap.map((days) => {
      dayWeek.push(days.creationDate.toDate());
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

  function handleSearch(value) {

    let auxArray = [];
    value.map((element) => {
      let results = (dataMap.filter((data) => data.tag === element));
      results.map((data) => {
        auxArray.push(data);
      })  
      console.log(results)
    })
    if(auxArray.length > 0){
      auxArray.sort((a,b) => {
        if(a.lastModification.seconds > b.lastModification.seconds){
          return -1;
        }
        if(a.lastModification.seconds < b.lastModification.seconds){
          return 1;
        }
      })
      setDataMapState(auxArray);
    } else {
      setDataMapState(dataMap);
    }
  }

  function handleReset(){
    setDataMapState(dataMap);
  }

  return (
    <Container fluid>
      <Row>
        <Col lg={6} md={6} className="justify-content-center">
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
              {(dataMap && dataMap.length > 0) &&(
                <MapaGoogle dataMap={dataMapState.length > 0 ? dataMapState : dataMap} />
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} md={6}>
          <Col>
          <Row style={{marginTop: '5px'}}>
            <Col lg={12} md={12}>
            <SearchBar data={(dataMap && dataMap.length > 0)? tagsFilter : null} handleSearch={handleSearch} handleReset={handleReset} />
            <TotalIncidents dataMap = {dataMap} tags = {conjuntoIncidentes} />
            </Col>
          </Row>
            <Row>
              <Col style={{height: '230px'}}>
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
            </Row>
            <Row>
              <Card
                bg={"white"}
                text={"black"}
                style={{
                  width: "100%",
                  height: "450px",
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
                <TimeLine data = {(dataMap && dataMap.length > 0) ? dataMapState : dataMap} />
              </Card>
            </Row>
          </Col>
        </Col>
      </Row>
    </Container>
  );
}