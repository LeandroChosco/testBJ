import React, { useEffect, useState } from "react";
import conections from "../../../conections";
import "./styles.css";
// import { Icon } from "semantic-ui-react";
import { MODE } from "../../../constants/token";
const SummaryCount = () => {
  // Variables Auxiliares
  let incrementWeek = 0;
  let incrementMonth = 0;
  // Variables de Estado
  const [totalDay, setTotalDay] = useState(0);
  const [totalWeek, setTotalWeek] = useState(0);
  const [totalMonth, setTotalMonth] = useState(0);
  const [totalAlerts, setTotalAlerts] = useState(0);

  const init = async () => {
    const perDay = await conections.getLPRTotalDay();
    if (perDay.data && perDay.data.msg === "ok" && perDay.data.success && Object.keys(perDay.data.data).length > 0) {
      perDay.data.data.forEach((element) => {
        setTotalDay(element.total);
      });
    }
    const perWeek = await conections.getLPRTotalWeek();
    if (perWeek.data && perWeek.data.msg === "ok" && perWeek.data.success && Object.keys(perWeek.data.data).length > 0) {
      perWeek.data.data.forEach((element) => {
        incrementWeek += element.total;
      });
      setTotalWeek(incrementWeek);
    }

    const perMonth = await conections.getLPRTotalMonth();
    if (perMonth.data && perMonth.data.msg === "ok" && perMonth.data.success && Object.keys(perMonth.data.data).length > 0) {
      perMonth.data.data.forEach((element) => {
        incrementMonth += element.total;
      });
      setTotalMonth(incrementMonth);
    }

    const total = await conections.getLPRTotalAlerts();
    if (total.data && total.data.msg === "ok" && total.data.success) {
      setTotalAlerts(total.data.data.total);
    }
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
                  {totalAlerts}
                </div>
                <p className="mb-0  pt-4 text-xxs text-center text-black" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black" }}>
                  Coincidencias por <b>mes</b>
                </p>
              </div>
              {/* <div className="ml-3  column position-relative">
              <Icon
                name="sort up"
                size="big"
                className="text-success"
                // className={!this.state.small ? "matches-arrow-display-none" : null}
              />
              <p className="text-center text-success" >+10%</p>
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
