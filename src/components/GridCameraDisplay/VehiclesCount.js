import Chart from "react-apexcharts";
import React, { useEffect, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner';
import conections from "../../conections"
// import './styles.css'

export const VehiclesCount = (props) => {

    let dataArraySeriesGrid = [];
    let dataArrayCategoriesGrid = [];
    const [seriesGrid, setSeriesGrid] = useState([])
    const [categoriesGrid, setCategoriesGrid] = useState([])

    const init = async () => {

        const vehiclesCount = await conections.getVehiclesCount();

        if (vehiclesCount.data.data && vehiclesCount.data.msg === 'ok' && vehiclesCount.data.success) {
            const sortVehiclesCount = await vehiclesCount.data.data.sort((a, b) => a.date > b.date ? 1 : -1)
            sortVehiclesCount.forEach(element => {

                const inCount = element.data.find(el => el.type === "inCountVehicle")
                const graphicDate = element.date.split("-")[1] + "/" + element.date.split("-")[2]

                dataArraySeriesGrid.push(inCount.total_detections)
                dataArrayCategoriesGrid.push(graphicDate)
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