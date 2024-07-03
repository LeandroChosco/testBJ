import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import { Col, Row } from 'reactstrap';
import {
  ResponsiveContainer
} from 'recharts';
import { ImMan, ImWoman } from 'react-icons/im'
import { MODE } from '../../constants/token';
// import { Icon } from "semantic-ui-react";

const styles = {
  noData: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    display: "flex"
  }
}

const GenderDetected = (props) => {
  // const { genderDetected } = props;
  const [options, setOptions] = useState();
  const [series, setSeries] = useState();


  const genderDetected = [
    {
      name: "Hombre",
      value: 416,
      rangeAge: ["-18", "18-30", "31-50", "+50"],
      detectedArray: [120, 55, 201, 40]
    },
    {
      name: "Mujer",
      value: 337,
      rangeAge: ["-18", "18-30", "31-50", "+50"],
      detectedArray: [54, 207, 48, 28]
    },
  ]

  useEffect(() => {
    let xAxis = [], yAxis = [];
    if (genderDetected.length > 0) {
      genderDetected.forEach((item) => {
        xAxis.push(item.name);
        yAxis.push(item.value)
      })
      let options = {
        labels: xAxis,
        chart: {
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              customIcons: []
            },
            export: {
              csv: {
                filename: 'Personas detectadas',
                columnDelimiter: ',',
                headerCategory: 'Personas detectadas',
                headerValue: 'Total'
              },
              svg: {
                filename: 'Personas detectadas',
              },
              png: {
                filename: 'Personas detectadas',
              }
            },
          },
        },
        theme: {
          mode: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? 'dark' : "light",
          palette: 'palette1',
          monochrome: {
            enabled: false,
            color: '#255aee',
            shadeTo: 'light',
            shadeIntensity: 0.65
          },
        },

        // colors: ['#098f62', '#008ffb'],
        legend: {
          show: true,
          showForSingleSeries: false,
          showForNullSeries: true,
          showForZeroSeries: true,
          position: 'bottom',
          horizontalAlign: 'center',
          floating: false,
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial',
          fontWeight: 400,
          formatter: undefined,
          inverseOrder: false,
          width: undefined,
          height: undefined,
          tooltipHoverFormatter: undefined,
          offsetX: 0,
          offsetY: 0,
          labels: {
            colors: undefined,
            useSeriesColors: false
          },
          markers: {
            width: 12,
            height: 12,
            strokeWidth: 0,
            strokeColor: '#fff',
            fillColors: undefined,
            radius: 12,
            customHTML: undefined,
            onClick: undefined,
            offsetX: 0,
            offsetY: 0
          },
          itemMargin: {
            horizontal: 5,
            vertical: 0
          },
          onItemClick: {
            toggleDataSeries: true
          },

        }
      }

      let series = yAxis
      setOptions(options);
      setSeries(series)
    }
  }, [])




  return (
    <ResponsiveContainer >

      {
        options && series ?
          <Row>
            <Col>
              <Chart options={options} series={series} type="donut" height={320} />
            </Col>
            <Col>
              <Row style={{ marginBottom: "5%" }}>
                {/* <Col> */}
                <Col>
                  <h1>
                    {genderDetected.find(el => el.name === "Hombre").value}
                  </h1>
                  <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
                    Hombres
                  </p>
                </Col>
                <Col>
                  {/* <Icon
                    name="sort up"
                    size="big"
                    className="text-success"
                  />
                  <p>
                    +25%
                  </p> */}
                </Col>
                {/* </Col> */}
                {/* <Col> */}
                <Col>
                  <h1>
                    {genderDetected.find(el => el.name === "Mujer").value}
                  </h1>
                  <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
                    Mujeres
                  </p>
                </Col>
                <Col>
                  {/* <Icon
                    name="sort down"
                    size="big"
                    className="text-danger"
                  />
                  <p>
                    -10%
                  </p> */}
                </Col>
                {/* </Col> */}
              </Row>
              <br />
              <Row style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
                <Col className='col-4'><ImMan style={{ color: "#008ffb", border: "none", width: "100%", height: "50%" }} /></Col>
                <Col className='col-8'>
                  <Row>
                    <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
                      De los <b style={{ color: "#008ffb" }}>{genderDetected.find(el => el.name === "Hombre").value}</b> hombres:
                    </p>
                  </Row>
                  {
                    genderDetected[1].detectedArray.map((el, idx) => {
                      return (

                        <Row>
                          <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
                            <b>{Math.round((el / genderDetected[1].value) * 100)} %</b> tienen {genderDetected[1].rangeAge[idx]} años
                          </p>
                        </Row>
                      )
                    })
                  }
                  {/* <Row>
                    <p>
                      <b>50%</b> tienen entre 18-30 años y,
                    </p>
                  </Row>
                  <Row>
                    <p>
                      <b>30%</b> en un horario de 11 am a 1 pm.
                    </p>
                  </Row> */}
                </Col>
              </Row>
              <br />
              <Row style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
                <Col className='col-4'><ImWoman style={{ color: "#098f62", border: "none", width: "100%", height: "50%" }} /></Col>
                <Col className='col-8'>
                  <Row>
                    <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
                      De las <b style={{ color: "#098f62" }}>{genderDetected.find(el => el.name === "Mujer").value}</b> mujeres:
                    </p>
                  </Row>
                  {
                    genderDetected[0].detectedArray.map((el, idx) => {
                      return (

                        <Row>
                          <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
                            <b>{Math.round((el / genderDetected[0].value) * 100)} %</b> tienen {genderDetected[0].rangeAge[idx]} años
                          </p>
                        </Row>
                      )
                    })
                  }
                  {/* <Row>
                    <p>
                      <b>50%</b> tienen entre 18-30 años y,
                    </p>
                  </Row>
                  <Row>
                    <p>
                      <b>30%</b> en un horario de 11 am a 1 pm.
                    </p>
                  </Row> */}
                </Col>
              </Row>
            </Col>
          </Row>
          :
          <div style={styles.noData}>No hay datos disponibles</div>

      }

    </ResponsiveContainer>
  )
}

export default GenderDetected;