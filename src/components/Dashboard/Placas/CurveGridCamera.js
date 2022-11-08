import Chart from "react-apexcharts";
import React, { useEffect, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner';
import conections from "../../../conections";
import './styles.css'

export const CurveGridCamera = (props) => {

    let dataArraySeriesGrid = [];
    let dataArrayCategoriesGrid = [];
    const [seriesGrid, setSeriesGrid] = useState([])
    const [categoriesGrid, setCategoriesGrid] = useState([])

    const init = async () => {
        const alertPerHour = await conections.getLPRPerHour(props.camera.id);
        if (alertPerHour.data && alertPerHour.data.msg === 'ok' && alertPerHour.data.success) {
            const sortAlertPerHour = await alertPerHour.data.data.sort((a, b) => {
                if (a.hour > b.hour) return 1
                if (a.hour < b.hour) return -1
            })

            sortAlertPerHour.forEach(element => {
                dataArraySeriesGrid.push(element.total)
                dataArrayCategoriesGrid.push(`${element.hour}:00`)
            });
            setSeriesGrid(dataArraySeriesGrid)
            setCategoriesGrid(dataArrayCategoriesGrid)
        }
    }

    useEffect(() => {

        setSeriesGrid([]);
        setCategoriesGrid([]);

        setTimeout(() => {
            init()
        }, 500);

    }, [props.camera])

    const data = {
        options: {
            stroke: {
                curve: 'smooth',
            },
            chart: {
                id: "smooth"
            },
            xaxis: {
                categories: categoriesGrid
            },
            colors: ["#EE8B05"],
        },

        series: [
            {
                name: "Camara 1",
                data: seriesGrid
            }
        ]
    }
    return (
        <>
            {
                seriesGrid.length > 0 ?
                    <Chart
                        options={data.options}
                        series={data.series}
                        type="area"
                        width="100%"
                        height='180px'
                    />
                    :
                    <Spinner style={{ marginTop: "3rem" }} animation="border" variant="info" role="status" size="xl" />
            }
        </>
    )
}