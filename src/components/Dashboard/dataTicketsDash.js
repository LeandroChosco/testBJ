import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import { Col, Row } from 'reactstrap';
import {
    ResponsiveContainer
} from 'recharts';
import { BsEnvelopeOpenFill, BsFillFileEarmarkCheckFill } from 'react-icons/bs'
import { FaLayerGroup } from 'react-icons/fa'
import { MdAccessTimeFilled } from 'react-icons/md'

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

const DataTicketsDash = (props) => {
    const { dataTickets } = props;

    const [options, setOptions] = useState();
    const [series, setSeries] = useState();

    const getTotal = () => {
        if (totalTickets !== 0) {
            let total = 0
            dataTickets.map((el) => {
                total = total + el.value
            })
            return total
        }
    }

    let totalTickets = getTotal()

    useEffect(() => {
        let xAxis = [], yAxis = [];

        if (dataTickets.length > 0) {
            dataTickets.forEach((item) => {
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

                colors: ['#00e396', '#f2833e', '#008ffb'],
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
                            <Row>
                                <Col className='col-4'><FaLayerGroup style={{ color: "#02004c", border: "none", width: "70%", height: "50%" }} /></Col>
                                <Col className='col-8'>
                                    <Row style={{marginTop: "0.75rem"}}>
                                        <p>
                                            <b style={{ color: "#02004c" }}>{totalTickets} tickets</b> en total
                                        </p>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='col-4'><BsEnvelopeOpenFill style={{ color: "#00e396", border: "none", width: "70%", height: "50%" }} /></Col>
                                <Col className='col-8'>
                                    <Row style={{marginTop: "0.75rem"}}>
                                        <p>
                                            <b style={{ color: "#00e396" }}>{dataTickets.filter((el) => el.name === "Abiertos")[0].value} tickets</b> abiertos
                                        </p>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='col-4'><BsFillFileEarmarkCheckFill style={{ color: "#008ffb", border: "none", width: "70%", height: "50%" }} /></Col>
                                <Col className='col-8'>
                                    <Row style={{marginTop: "0.75rem"}}>
                                        <p>
                                            <b style={{ color: "#008ffb" }}>{dataTickets.filter((el) => el.name === "Cerrados")[0].value} tickets</b> cerrados
                                        </p>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='col-4'><MdAccessTimeFilled style={{ color: "#f2833e", border: "none", width: "70%", height: "50%" }} /></Col>
                                <Col className='col-8'>
                                    <Row style={{marginTop: "0.75rem"}}>
                                        <p>
                                            <b style={{ color: "#f2833e" }}>{dataTickets.filter((el) => el.name === "En proceso")[0].value} tickets</b> en proceso
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

export default DataTicketsDash;