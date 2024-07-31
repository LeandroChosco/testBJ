import Chart from "react-apexcharts";
import React, { useEffect, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner';
import conections from "../../../conections";
import moment from "moment";
import './styles.css'

export const CurveGridCamera = (props) => {

    // let dataArraySeriesGrid = [];
    // let dataArrayCategoriesGrid = [];
    const [seriesGrid, setSeriesGrid] = useState([]);
    const [categoriesGrid, setCategoriesGrid] = useState([]);

    const [showData, setShowData] = useState(1);

    const handleChange = (data) => {
        setShowData(data);
        setSeriesGrid([]);
        setCategoriesGrid([]);
        setTimeout(() => {
            if (data !== 1) {
                // let dataArraySeriesGrid = [45, 41, 19, 28, 34, 65, 11, 20, 24, 19, 55, 35, 62, 12, 70, 15, 64, 52, 33, 60, 45, 58, 41, 20, 36, 29, 54, 65, 21, 22];
                // let dataArrayCategoriesGrid = ["01/06", "02/06", "03/06", "04/06", "05/06", "06/06", "07/06", "08/06", "09/06", "10/06", "11/06", "12/06", "13/06", "14/06", "15/06", "16/06", "17/06", "18/06", "19/06", "20/06", "21/06", "22/06", "23/06", "24/06", "25/06", "26/06", "27/06", "28/06", "29/06", "30/06"];

                let dataArraySeriesGrid = [];
                let dataArrayCategoriesGrid = [];

                let end_date = moment().format("YYYY-MM-DD");
                let start_date = moment().subtract(data, "days").format("YYYY-MM-DD");

                conections.getLPRPerDay(props.camera.id, start_date, end_date).then(response => {
                    const arrayData = response.data.data[0].dates;
                    const current_year = moment().format("YYYY-");
                    arrayData.forEach(el => {
                        dataArraySeriesGrid.push(el.total);
                        dataArrayCategoriesGrid.push(el.date.split(current_year).join(""));
                    });
                })
                    .catch(err => console.log(err));


                setTimeout(() => {
                    setSeriesGrid(dataArraySeriesGrid);
                    setCategoriesGrid(dataArrayCategoriesGrid);
                }, 2000);

            } else {
                // let dataArraySeriesGrid = [7, 5, 2, 0, 9, 1, 0, 2, 4, 3, 4, 1,];
                // let dataArrayCategoriesGrid = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

                let dataArraySeriesGrid = []
                let dataArrayCategoriesGrid = []

                conections.getLPRPerHour(props.camera.id).then(response => {
                    const arrayData = response.data.data;
                    arrayData.forEach(el => {
                        dataArraySeriesGrid.push(el.total)
                        dataArrayCategoriesGrid.push(el.hour)
                    })
                })
                    .catch(err => console.log(err));


                setTimeout(() => {
                    setSeriesGrid(dataArraySeriesGrid);
                    setCategoriesGrid(dataArrayCategoriesGrid);
                }, 2000);
            };
        }, 1000);
    }

    useEffect(() => {
        handleChange(1)
    }, [props.camera.id]);

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
    };


    return (
        <div style={{ paddingTop: "1.5rem", height: "100%" }}>
            <>
                <div style={{ padding: "1rem 0", display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input type={"radio"} value={"day"} checked={showData === 1} onClick={() => handleChange(1)} />
                        <p style={{ marginLeft: "0.5rem", marginRight: "1.5rem" }}>Últimas 24 horas</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input type={"radio"} value={"weeks"} checked={showData === 15} onClick={() => handleChange(15)} />
                        <p style={{ marginLeft: "0.5rem", marginRight: "1.5rem" }}>Últimos 15 días</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input type={"radio"} value={"month"} checked={showData === 30} onClick={() => handleChange(30)} />
                        <p style={{ marginLeft: "0.5rem" }}>Últimos 30 días</p>
                    </div>
                </div>
                {
                    seriesGrid.length > 0 ?
                        <div style={{ height: "55%" }}>
                            <Chart
                                options={data.options}
                                series={data.series}
                                type="area"
                                width="100%"
                                height={'100%'}
                            />
                        </div>
                        :
                        <Spinner style={{ marginTop: "3rem" }} animation="border" variant="info" role="status" size="xl" />
                }
            </>
        </div>
    )
}