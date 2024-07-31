import React, { useEffect, useState } from "react";
import conections from "../../../conections";
// import { Icon } from "semantic-ui-react";
import { MODE } from "../../../constants/token";
import moment from 'moment';
import "./styles.css";


const SummaryCount = () => {

  const [totalDay, setTotalDay] = useState(0);
  const [totalWeek, setTotalWeek] = useState(0);
  const [totalMonth, setTotalMonth] = useState(0);
  // const [totalAlerts, setTotalAlerts] = useState(0);

  const init = () => {

    conections.getLPRTotalDay().then(response => {
      if (response.data.success) {
        setTotalDay(response.data.data.total)
      }
    }).catch(err => console.error(err));

    let end_date = moment().format("YYYY-MM-DD");
    let start_date_month = moment().subtract(30, "days").format("YYYY-MM-DD");
    let start_date_week = moment().subtract(7, "days").format("YYYY-MM-DD");

    const weekData = {
      start_date: start_date_week,
      end_date
    };

    const monthData = {
      start_date: start_date_month,
      end_date
    };

    conections.getLPRFilterWeek(weekData).then(response => {
      if (response.data.success && response.data.data) {
        const totalWeek = response.data.data.reduce((acc, el) => acc + el.total, 0);
        setTotalWeek(totalWeek);
      }
    }).catch(err => console.error(err));

    conections.getLPRFilterWeek(monthData).then(response => {
      if (response.data.success && response.data.data) {
        const totalMonth = response.data.data.reduce((acc, el) => acc + el.total, 0);
        setTotalMonth(parseInt(totalMonth * 4.175));
      }
    }).catch(err => console.error(err));

    // Div de coincidencias por mes

    // //   <div className="mb-8   col-xl-3 col-sm-6 mb-xl-0">
    // //   <div className="ml-5">
    // //     {/* <div className="p-3 pt-2 card-header"> */}
    // //     <div className="text-center icon icon-lg icon-shape bg-gradient-dark shadow-dark border-radius-xl mt-n4 position-absolute">
    // //       {/* <i className="material-icons opacity-10">weekend</i> */}
    // //     </div>
    // //     <div className="pt-1 d-flex flex-column text-end">
    // //       <div className="flex-row d-flex justify-content-between"></div>
    // //       <div className="row">
    // //         <div>
    // //           <div className="top-0 mb-0 textSize text-black text-start" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black" }}>
    // //             {totalAlerts}
    // //           </div>
    // //           <p className="mb-0  pt-4 text-xxs text-center text-black" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black" }}>
    // //             Coincidencias por <b>mes</b>
    // //           </p>
    // //         </div>
    // //         {/* <div className="ml-3  column position-relative">
    // //         <Icon
    // //           name="sort up"
    // //           size="big"
    // //           className="text-success"
    // //           // className={!this.state.small ? "matches-arrow-display-none" : null}
    // //         />
    // //         <p className="text-center text-success" >+10%</p>
    // //         </div> */}
    // //       </div>
    // //     </div>
    // //     {/* </div> */}
    // //   </div>
    // // </div>

  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div className="row justify-content-around px-4 mb-4 ">
      <div className="mb-8   col-xl-3 col-sm-6 mb-xl-0">
        <div className="ml-5">
          {/* <div className="p-3 pt-2 card-header"> */}
          <div className="text-center icon icon-lg icon-shape bg-gradient-dark shadow-dark border-radius-xl mt-n4 position-absolute">
            {/* <i className="material-icons opacity-10">weekend</i> */}
          </div>
          <div className="pt-1 d-flex flex-column text-end">
            <div className="flex-row d-flex justify-content-between"></div>
            <div className="row">
              <div>
                <div className="top-0 mb-0 textSize text-black text-start" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black" }}>
                  {totalDay}
                </div>
                <p className="mb-0  pt-4 text-xxs text-center text-black" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black" }}>
                  Conteo por <b>día</b>
                </p>
              </div>
              {/* <div className="ml-3  column position-relative">
              <Icon
                name="sort down"
                size="big"
                className="text-danger"
                // className={!this.state.small ? "matches-arrow-display-none" : null}
              />
              <p className="text-center text-danger" >-10%</p>
              </div> */}
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
      <div className="mb-8   col-xl-3 col-sm-6 mb-xl-0">
        <div className="ml-5">
          {/* <div className="p-3 pt-2 card-header"> */}
          <div className="text-center icon icon-lg icon-shape bg-gradient-dark shadow-dark border-radius-xl mt-n4 position-absolute">
            {/* <i className="material-icons opacity-10">weekend</i> */}
          </div>
          <div className="pt-1 d-flex flex-column text-end">
            <div className="flex-row d-flex justify-content-between"></div>
            <div className="row">
              <div>
                <div className="top-0 mb-0 textSize text-black text-start" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black" }}>
                  {totalWeek}
                </div>
                <p className="mb-0  pt-4 text-xxs text-center text-black" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black" }}>
                  Conteo por <b>semana</b>
                </p>
              </div>
              {/* <div className="ml-3  column position-relative">
              <Icon
                name="sort up"
                size="big"
                className="text-success"
                // className={!this.state.small ? "matches-arrow-display-none" : null}
              />
              <p className="text-center text-success" >10%</p>
              </div> */}
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
      <div className="mb-8   col-xl-3 col-sm-6 mb-xl-0">
        <div className="ml-5">
          {/* <div className="p-3 pt-2 card-header"> */}
          <div className="text-center icon icon-lg icon-shape bg-gradient-dark shadow-dark border-radius-xl mt-n4 position-absolute">
            {/* <i className="material-icons opacity-10">weekend</i> */}
          </div>
          <div className="pt-1 d-flex flex-column text-end">
            <div className="flex-row d-flex justify-content-between"></div>
            <div className="row">
              <div>
                <div className="top-0 mb-0 textSize text-black text-start" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black" }}>
                  {totalMonth}
                </div>
                <p className="mb-0  pt-4 text-xxs text-center text-black" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black" }}>
                  Conteo por <b>mes</b>
                </p>
              </div>
              {/* <div className="ml-3  column position-relative">
              <Icon
                name="sort up"
                size="big"
                className="text-success"
                // className={!this.state.small ? "matches-arrow-display-none" : null}
              />
              <p className="text-center text-success" >+20%</p>
              </div> */}
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default SummaryCount;