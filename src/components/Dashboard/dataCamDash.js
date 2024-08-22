import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import { Col, Row } from 'reactstrap';
import {
    ResponsiveContainer
} from 'recharts';
import { BsCameraVideoFill, BsCameraVideoOffFill, BsCameraVideoOff } from 'react-icons/bs'
import { MODE } from '../../constants/token';

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

const DataCamsDash = (props) => {
    const { dataCams } = props;

    // console.log(dataCams)

    const [options, setOptions] = useState();
    const [series, setSeries] = useState();

    // const getTotal = () => {
    //     if (totalTickets !== 0) {
    //         let total = 0
    //         dataCams.map((el) => {
    //             total = total + el.value
    //         })
    //         return total
    //     }
    // }

    // let totalTickets = getTotal()

    useEffect(() => {
        let xAxis = [], yAxis = [];

        if (dataCams.length > 0) {
            dataCams.forEach((item) => {
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
                                filename: 'Estatus de tickets',
                                columnDelimiter: ',',
                                headerCategory: 'Estatus de tickets',
                                headerValue: 'Total'
                            },
                            svg: {
                                filename: 'Estatus de tickets',
                            },
                            png: {
                                filename: 'Estatus de tickets',
                            }
                        },
                    },
                },

                colors: ['#098f62', '#008ffb', '#f2833e'],
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
                    <Row style={{color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666"}}>
                        <Col>
                            {
                                (series[0] === 0 && series[1] === 0 && series[2] === 0) ?
                                    <div style={styles.noData}>No hay datos disponibles</div>
                                    :
                                    <Chart options={options} series={series} type="donut" height={320} />
                            }
                        </Col>
                        <Col>
                            <br />
                            <Row>
                                <Col className='col-4'><BsCameraVideoFill style={{ color: "#098f62", border: "none", width: "70%", height: "50%" }} /></Col>
                                <Col className='col-8'>
                                    <Row style={{ marginTop: "0.75rem" }}>
                                        <p>
                                            <b style={{ color: "#098f62" }}>{dataCams.filter((el) => el.name === "Activas")[0].value} cámaras</b> activas
                                        </p>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='col-4'><BsCameraVideoOffFill style={{ color: "#008ffb", border: "none", width: "70%", height: "50%" }} /></Col>
                                <Col className='col-8'>
                                    <Row style={{ marginTop: "0.75rem" }}>
                                        <p>
                                            <b style={{ color: "#008ffb" }}>{dataCams.filter((el) => el.name === "Inactivas")[0].value} cámaras</b> inactivas
                                        </p>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='col-4'><BsCameraVideoOff style={{ color: "#f2833e", border: "none", width: "70%", height: "50%" }} /></Col>
                                <Col className='col-8'>
                                    <Row style={{ marginTop: "0.75rem" }}>
                                        <p>
                                            <b style={{ color: "#f2833e" }}>{dataCams.filter((el) => el.name === "Desconectadas")[0].value} cámaras</b> desconectadas
                                        </p>
                                    </Row>
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

export default DataCamsDash;