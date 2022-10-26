import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import { Col, Row } from 'reactstrap';
import {
  ResponsiveContainer
} from 'recharts';
import { ImMan, ImWoman } from 'react-icons/im'
import { HiArrowCircleDown, HiArrowCircleUp } from 'react-icons/hi'

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
  const { genderDetected } = props;
  const [options, setOptions] = useState();
  const [series, setSeries] = useState();

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

        colors: ['#00e396', '#008ffb'],
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
              <Row style={{marginBottom: "5%"}}>
                {/* <Col> */}
                  <Col>
                    <h1>
                      1.198
                    </h1>
                    <p>
                      Hombres
                    </p>
                  </Col>
                  <Col>
                    <HiArrowCircleUp style={{ color: "green", border: "none", width: "40px", height: "40px" }} />
                    <p>
                      +25%
                    </p>
                  </Col>
                {/* </Col> */}
                {/* <Col> */}
                  <Col>
                    <h1>
                      302
                    </h1>
                    <p>
                      Mujeres
                    </p>
                  </Col>
                  <Col>
                    <HiArrowCircleDown style={{ color: "red", border: "none", width: "40px", height: "40px" }} />
                    <p>
                      -10%
                    </p>
                  </Col>
                {/* </Col> */}
              </Row>
              <br />
              <Row>
                <Col className='col-4'><ImMan style={{ color: "#008ffb", border: "none", width: "100%", height: "50%" }} /></Col>
                <Col className='col-8'>
                  <Row>
                    <p>
                      De los <b style={{color: "#008ffb"}}>1.198</b> hombres:
                    </p>
                  </Row>
                  <Row>
                    <p>
                      <b>50%</b> tienen entre 18-30 años y,
                    </p>
                  </Row>
                  <Row>
                    <p>
                      <b>30%</b> en un horario de 11 am a 1 pm.
                    </p>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col className='col-4'><ImWoman style={{ color: "#00e396", border: "none", width: "100%", height: "50%" }} /></Col>
                <Col className='col-8'>
                <Row>
                    <p>
                      De las <b style={{color: "#00e396"}}>302</b> mujeres:
                    </p>
                  </Row>
                  <Row>
                    <p>
                      <b>50%</b> tienen entre 18-30 años y,
                    </p>
                  </Row>
                  <Row>
                    <p>
                      <b>30%</b> en un horario de 11 am a 1 pm.
                    </p>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          :
          <div style={styles.noData}>No hay datos dispononibles</div>

      }

    </ResponsiveContainer>
  )
}

export default GenderDetected;