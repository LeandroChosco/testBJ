import React, { Component } from "react";
import "../../assets/styles/util.css";
import "../../assets/styles/main.css";
import "../../assets/fonts/iconic/css/material-design-iconic-font.min.css";
import "./style.css";
import conections from "../../conections";
import { Text } from "recharts";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import { Tab } from "semantic-ui-react";
// import socketIOClient from 'socket.io-client';
// import sailsIOClient from 'sails.io.js';
import constants from '../../constants/constants';
import * as moment from "moment";
// import CameraPerPerson from "../../components/Dashboard/cameraPerPerson";
// import PeoplePerDay from "../../components/Dashboard/persons";
import Loading from "../../components/Loading/index";
import IntalledLastMonth from "../../components/Dashboard/camerasInstalledLastMonth";
// import AgeDetected from "../../components/Dashboard/ageDetected";
import PersonsMood from "../../components/Dashboard/personsMood";
import GenderDetected from "../../components/Dashboard/genderDetected";
// import DataCams from "../../components/Dashboard/dataCams";
import DataCamsDash from "../../components/Dashboard/dataCamDash";
import CamsInstalledByMonth from "../../components/Dashboard/camsInstalledByMonth";
// import DataTickets from "../../components/Dashboard/dataTickets";
import DataTicketsDash from "../../components/Dashboard/dataTicketsDash";
import Placas from "../../components/Dashboard/Placas"
// import DataTicketsPerUser from "../../components/Dashboard/dataTicketsPerUser";
import DataTicketsPerUserRedesign from "../../components/Dashboard/dataTicketsPerUserRedesign";
import AgeDemographic from "../../components/Dashboard/AgeDemographic";
import RegisterMood from "../../components/Dashboard/RegisterMood";
import { IS_DEMOGRAPHIC, IS_LPR, MODE } from '../../constants/token';
import AttendedVSclosed from "../../components/Dashboard/attendedVScloded";
import LastCreadedCams from "../../components/Dashboard/lastCreatedCams";
import {
  // RiArrowDropUpLine,
  // RiCloseCircleFill,
  RiEye2Fill
} from "react-icons/ri";
let isLPR = localStorage.getItem(IS_LPR)
let isDemographic = localStorage.getItem(IS_DEMOGRAPHIC)

const MOODS = {
  neutral: "Neutral",
  happy: "Feliz",
  surprise: "Sorprendido",
  sad: "Triste",
  anger: "Enojado"
}

const style = {
  height: {
    height: "100%",
    backgroundColor: "#f5f5f5"
  },
  adjustX: {
    height: "100%",
    overflowX: "auto",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#2f5c81" : "transparent"
  },
};

class Dashboard extends Component {
  state = {
    loadingCams: true,
    dataCams: [],
    loadingTickets: true,
    dataTickets: [],
    embebedDashboard: [],
    dataTotalTickets: [],
    dataTicketsPerUser: {
      closed: [],
      attended: [],
      created: [],
    },
    setDropDown: [],
    drop: false,
    tags: [],
    conditionalRender: false,
    loadTotalRecognition: true,
    loadRecognitionAges: true,
    loadingRecognitionPerDay: true,
    loadingRecognitionMood: true,
    loadingRegisterMood: true,
    loadingCamsGrid: true,
    personsMood: [
      {
        mood: "Neutral",
        total: 0,
        fullMark: 100,
      },
      {
        mood: "Sorprendido",
        total: 0,
        fullMark: 100,
      },
      {
        mood: "Triste",
        total: 0,
        fullMark: 100,
      },
      {
        mood: "Feliz",
        total: 0,
        fullMark: 100,
      },
      {
        mood: "Enojado",
        total: 0,
        fullMark: 100,
      },
    ],
    registerMood: [],
    genderDetected: [],
    agesDetected: [],
    attendedVSclosed: [],
    lastAges: "",
    lastMood: "",
    lastGender: "",
    filterCam: "0",
    allFilters: [],
    panes: [
      {
        menuItem: "Cámaras",
        render: () => (
          <Tab.Pane style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black", transition: "all 0.2s linear" }} attached={false}>{this.renderCamsDashboard()}</Tab.Pane>
        ),
      },
      {
        menuItem: "Tickets",
        render: () => (
          <Tab.Pane style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black", transition: "all 0.2s linear" }} attached={false}>{this.renderTicketsDashboard()}</Tab.Pane>
        ),
      },
      isDemographic &&
      {
        menuItem: "Reconocimiento",
        render: () => (
          <Tab.Pane style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black", transition: "all 0.2s linear" }} attached={false}>
            {this.renderRecognitionDashboard()}
          </Tab.Pane>
        ),
      },
      constants.clientFirebase === "Modelorama" &&
      {
        menuItem: "Análisis",
        render: () => (
          <Tab.Pane style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black", transition: "all 0.2s linear" }} attached={false}>
            {this.renderEmebidoDashboard()}
          </Tab.Pane>
        ),
      },
      isLPR &&
      {
        menuItem: "LPR",
        render: () => (
          <Tab.Pane style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black", transition: "all 0.2s linear" }} attached={false}>
            {this.renderLPRDashboard()}
          </Tab.Pane>
        ),
      },
    ],
  };

  renderCamsDashboard() {
    // const c = shuffle(COLORS);
    return (
      <div className="container-flex">
        <h1>Logística de cámaras</h1>
        <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear" }}>Powered by Radar ®</p>
        <hr />
        <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear" }}>La logística de Radar realiza un recuento del estado y registro de cámaras en la alcaldía. De esta manera, los monitoristas tienen un control más eficaz de las instalaciones.</p>
        <br />
        <div className="row">
          <div className="col chart overflow table-responsive" align="center">
            {this.state.loadingCamsGrid ? (
              <Loading />
            ) : this.state.lastCreatedCams ? (
              <LastCreadedCams lastCreatedCams={this.state.lastCreatedCams} />
            ) : null}
          </div>
          <div className="col chart" align="center">
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <h3>Estado de cámaras</h3>
              <div>
                <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear" }}>Filtrar por modelo</p>
                <select name="filterCam" onChange={this.changeFilter} className="selectFilter" >
                  <option key={0} value={0} className="optionsFilter">TODAS</option>
                  {
                    this.state.allFilters ? this.state.allFilters.map((el) => {
                      return (
                        <option key={el.id} value={el.id} className="optionsFilter">{el.name.toUpperCase()}</option>
                      )
                    }) : null
                  }
                </select>
              </div>
            </div>
            {this.state.loadingCams ? (
              <Loading />
            ) : (
              <DataCamsDash dataCams={this.state.dataCams} />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-6 chart" align="center">
            <h3>Cámaras activas instaladas por mes</h3>
            {this.state.loadingCams ? (
              <Loading />
            ) : (
              <CamsInstalledByMonth
                installed_by_moth={this.state.installed_by_moth}
              />
            )}
          </div>

          <div className="col-6 chart" align="center">
            <h3>Cámaras activas instaladas el último mes</h3>
            {this.state.loadingCams ? (
              <Loading />
            ) : (
              <IntalledLastMonth
                installed_last_moth={this.state.installed_last_moth}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
  renderLPRDashboard() {
    return (
      <div className='container-flex'>
        <h1>Licence Plate Recognition</h1>
        <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear" }}>Powered by Radar ®</p>
        <hr />
        <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear" }}>El análisis de reconocimiento de matrículas (LPR) de Radar lee
          automáticamente la información de matrículas y la vincula a videos en
          vivo y grabados. Gracias a esto, los operadores de seguridad pueden
          buscar y encontrar rápidamente videos específicos de matrículas de
          vehículos capturadas para su verificación e investigación.</p>
        <br />
        <Placas />
      </div>
    )
  }

  renderEmebidoDashboard() {

    return (
      <div className="row  content-center items-center center center-block ">
        {
          this.state.embebedDashboard.map((item) => (

            <div className="card  bg-white  m-2 self-center  " style={{ width: "180px" }} key={item.id} >
              <div className="card-header bg-white" style={{ height: '50px', 'white-space': 'pre-line', overflow: 'hidden', 'text-overflow': "ellipsis" }} >
                <div className="card-title" >
                  {item.nombre}
                </div>

              </div>
              <button
                className="btn btn-default btn-lg align-content-start"
                onClick={async () => {
                  const data = await conections.getDetailDashboard(item.id);
                  // console.log(data.data.data[0]);
                  const script = data.data.data[0].script;
                  window.open(script, 'vizContainer', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no')
                }}>
                <RiEye2Fill />
              </button>
            </div>



          ))

        }
      </div>
    )
  }
  renderTicketsDashboard() {
    return (
      <div className="container-flex">
        <h1>Bitácora de tickets</h1>
        <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear" }}>Powered by Radar ®</p>
        <hr />
        <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear" }}>La bitácora de Radar exhibe el estado de los tickets de atención a los ciudadanos de la alcaldía, facilitando un histórico del desempeño de cada monitorista.</p>
        <br />
        <div className="row">
          <div className='col-6 chart overflow table-responsive' style={{ height: "375px" }} align='center'>
            <h3>Tickets creados por usuario</h3>
            {this.state.loadingTickets ? (
              <Loading />
            ) : (
              <DataTicketsPerUserRedesign
                dataTicketsPerUser={this.state.dataTicketsPerUser}
                customLabel={customLabel}
              />
            )}
          </div>
          <div className="col-6 chart" align="center">
            <h3>Estado de tickets</h3>
            {this.state.loadingTickets ? (
              <Loading />
            ) : (
              <DataTicketsDash
                dataTickets={this.state.dataTickets}
                dataTotalTickets={this.state.dataTotalTickets}
              />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12 chart" align="center">
            <h3>Tickets atendidos y cerrados por usuario</h3>
            {this.state.loadingTickets ? (
              <Loading />
            ) : (
              <AttendedVSclosed
                attendedVSclosed={this.state.attendedVSclosed}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  renderRecognitionDashboard() {
    // console.log(this.state.loadingRecognitionMood)
    return (
      <div className='container-flex'>
        <h1>Reconocimiento Facial</h1>
        <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear" }}>Powered by Radar ®</p>
        <hr />
        <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear" }}>El sistema de reconocimiento de Radar utiliza inteligencia artificial para detectar expresiones faciales en las personas y registrarlas en tiempo real. Los monitoristas pueden seccionar por tiempo los eventos almacenados, diferenciándolos por sexo o edad.</p>
        <div className='row'>
          <div className='col-12 chart' style={{ height: "auto" }} align='center'>
            <Card style={{
              height: "100%",
              overflowX: "auto",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#2f5c81" : "transparent"
            }}>
              <CardBody>
                {
                  // this.state.loadingRecognitionMood ?
                  //   <Loading />
                  //   :
                  <PersonsMood personsMood={this.state.personsMood} />
                }
              </CardBody>
            </Card>
          </div>
        </div>

        <div style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "transparent" : "#f5f5f5", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black", transition: "all 0.2s linear", padding: "4rem" }}>
          <div className='row'>
            <Card style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#2f5c81" : "transparent" }}>
              <CardHeader>
                <h3 className="pt-2" style={{ display: "flex", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black", transition: "all 0.2s linear" }}>Emociones registradas</h3>
                {
                  this.state.lastMood &&
                  <p><i>Actualizado el {this.state.lastMood.split(" ")[0]} a las {this.state.lastMood.split(" ")[1]}.</i></p>
                }
              </CardHeader>
              <div className='col-12 chart' align='center'>
                {
                  // this.state.loadingRegisterMood ?
                  //   <Loading />
                  //   :
                  <RegisterMood registerMood={this.state.registerMood} />
                }
              </div>
            </Card>
            <br />
          </div>
          <div className='row'>
            <div className='col-6 chart' align='center'>
              <Card style={{ height: "30rem", background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#2f5c81" : "transparent", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black", transition: "all 0.2s linear" }}>
                <CardHeader>
                  <h3 className="pt-2" style={{ display: "flex" }}>Personas registradas</h3>
                  {
                    this.state.lastAges &&
                    <p><i>Actualizado el {this.state.lastAges.split(" ")[0]} a las {this.state.lastAges.split(" ")[1]}.</i></p>
                  }
                </CardHeader>          {
                  // this.state.loadTotalRecognition ?
                  //   <Loading />
                  //   :
                  <GenderDetected agesDetected={this.state.agesDetected} genderDetected={this.state.genderDetected} lastAges={this.state.lastAges} />
                }
              </Card>
            </div>
            <div className='col-6 chart' align='center'>
              <Card style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#2f5c81" : "transparent", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black", transition: "all 0.2s linear", height: "30rem" }}>
                <CardHeader>
                  <h3 style={{ display: "flex" }}>Edades registradas</h3>
                  {
                    this.state.lastAges &&
                    <p><i>Actualizado el {this.state.lastAges.split(" ")[0]} a las {this.state.lastAges.split(" ")[1]}.</i></p>
                  }
                </CardHeader>
                {
                  // this.state.loadRecognitionAges ?
                  //   <Loading />
                  //   :
                  <AgeDemographic agesDetected={this.state.agesDetected} genderDetected={this.state.genderDetected} lastAges={this.state.lastAges} />
                }
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }


  render() {
    return (
      <div
        className={!this.props.showMatches ? "hide-matches" : "show-matches"}
      >
        <div
          className={this.props.showMatches ? "hide-matches" : "show-matches"}
        >
          <button className="btn clear pull-right" onClick={this.loadData} style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear" }}>
            <i className={"fa fa-repeat"}></i>Actualizar
          </button>
        </div>
        <Tab
          menu={{ secondary: true, pointing: true, inverted: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) }}
          panes={this.state.panes}
        ></Tab>
      </div>
    );
  }

  componentWillUnmount() {
    if (this.state.io) {
      if (this.state.io.socket.isConnected()) {
        this.state.io.socket.disconnect();
      }
    }
  }

  loadData = () => {
    this.setState({
      loadingCams: true,
      loadingTickets: true,
      loadTotalRecognition: true,
      loadRecognitionAges: true,
      loadingRecognitionPerDay: true,
      loadingRecognitionMood: true,
      loadingRegisterMood: true,
      loadingCamsGrid: true,
      loadingPeoplePerCamera: true,
      loadingPersons: true,
    });
    conections.dashboardCams(this.state.filterCam).then((response) => {
      const data = response.data;
      this.setState({
        loadingCams: false,
        dataCams: [
          { name: "Activas", value: data.active },
          { name: "Inactivas", value: data.deactive },
          { name: "Desconectadas", value: data.disconnected },
        ],
        installed_by_moth: data.installed_by_moth.sort((a, b) => {
          if (a.fecha > b.fecha) {
            return 1
          } else {
            return -1
          }
        }).map((v) => {
          v.fecha = moment(v.fecha).format("MMM-YYYY");
          return v;
        }),
        installed_last_moth: data.installed_last_moth.sort((a, b) => {
          if (a.fecha > b.fecha) {
            return 1
          } else {
            return -1
          }
        }).map((v) => {
          v.fecha = moment(v.fecha).format("DD-MM-YYYY");
          return v;
        }),
        lastCreatedCams: data.return_all_cams.sort((a, b) => a.num_cam - b.num_cam),
        loadingCamsGrid: false
      });
    });
    conections.dashboardRecognitionMood().then(this.processMood);
    // conections.dashboardDemographicFilter().then(this.processRegisterMood);
    conections.dashboardTotalRecognition().then(this.processDetected);
    conections.dashboardTickets().then(this.processTicketsData);
    conections.dashboardRecognitionAges().then(this.processAges);
    // conections
    //   .loadCams()
    //   .then(this.lastCreatedCams)
    //   .catch((err) => {
    //     console.log("Cargando camaras", err);
    //   });
    conections.dashboardCameraPerPerson().then(this.getPersonsPerCamera);
    conections.dashboardPersons().then(this.getPersons);
    conections.getDashboardEmbebed().then(this.getDashboardEmbebed);
    conections.getCameraTypes().then(response => this.setState({ allFilters: response.data }))
    /*let io;
    if (socketIOClient.sails) {
      io = socketIOClient;
      if(!io.socket.isConnected()&&!io.socket.isConnecting()) {
        io.socket.reconnect()
      }
    } else {
      io = sailsIOClient(socketIOClient);
    }
    this.setState({io:io})    
    io.sails.url = constants.sails_url+':1337';
    io.socket.get('/cams?sort=num_cam asc&active=1&limit=10000', this.lastCreatedCams) */
  };

  /*  processDropDown = (response) => {
    let data []
    let indexes= []
    response.data.data
  } */

  processMood = (response) => {
    let data = [];
    let indexes = [];

    response.data.data && response.data.data.current_date && response.data.data.current_date.length > 0 && response.data.data.current_date.forEach((v) => {
      if (v && v.mood !== "") {
        v.mood = MOODS[v.mood] ? MOODS[v.mood] : v.mood;
        if (indexes.indexOf(v.mood) > -1) {
          data[indexes.indexOf(v.mood)].percentage =
            (v.percentage + data[indexes.indexOf(v.mood)].percentage) / 2;
        } else {
          data.push(v);
          indexes.push(v.mood);
        }
      }
    });


    const personsMood_copy = [...this.state.personsMood];
    const aux = personsMood_copy.map((item) => {
      const found = data.find((d) => d.mood === item.mood);
      if (found) {

        return found;
      } else {
        item["percentage"] = null;
        return item;
      }
    });

    this.setState({ personsMood: aux, loadingRecognitionMood: false });
  };

  getDashboardEmbebed = (response) => {
    const data = response.data;
    let newData = [];
    if (data && data.data) {

      data.data.map((item) => {
        if (item.id === 18) {
          return (

            newData.push({
              id: item.id,
              nombre: item.nombre,
              script: item.script,
              token: item.token
            })
          )
        } else {
          return (
            null
          )
        }


      });
      this.setState({ embebedDashboard: newData });
    }
  }

  processDetected = (response) => {
    const data = response.data.data;
    // console.log(data)
    if (data && Object.keys(data).length > 0) {
      this.setState({
        genderDetected: [
          {
            name: "Mujer",
            value: data.femeleData[0].currentAgeRange.total,
            rangeAge: ["-18", "18-30", "31-50", "+50"],
            detectedArray: [data.femeleData[0].currentAgeRange.women_under_18, data.femeleData[0].currentAgeRange.women_between_18_30, data.femeleData[0].currentAgeRange.women_between_31_50, data.femeleData[0].currentAgeRange.women_over_50]
          },
          {
            name: "Hombre",
            value: data.maleData[0].currentAgeRange.total,
            rangeAge: ["-18", "18-30", "31-50", "+50"],
            detectedArray: [data.maleData[0].currentAgeRange.men_under_18, data.maleData[0].currentAgeRange.men_between_18_30, data.maleData[0].currentAgeRange.men_between_31_50, data.maleData[0].currentAgeRange.men_over_50]
          },
        ],
        loadTotalRecognition: false,
      });
    } else {
      this.setState({ genderDetected: [], loadTotalRecognition: false });
    }
  };

  processAges = (response) => {
    const data = response.data.data;

    this.setState({
      lastAges: data.date_update
    })

    if (Object.keys(data).length > 0) {

      this.setState({
        agesDetected: [
          {
            name: "-18",
            total: data.total_under_18,
            Hombres: data.men_under_18,
            Mujeres: data.women_under_18,
          },
          {
            name: "18-30",
            total: data.total_between_18_30,
            Hombres: data.men_between_18_30,
            Mujeres: data.women_between_18_30,
          },
          {
            name: "31-50",
            total: data.total_between_31_50,
            Hombres: data.men_between_31_50,
            Mujeres: data.women_between_31_50,
          },
          {
            name: "50+",
            total: data.total_over_50,
            Hombres: data.men_over_50,
            Mujeres: data.women_over_50,
          },
        ],
        loadRecognitionAges: false,
      });
      if (data.date_update) {
        this.setState({
          lastAges: data.date_update
        })
      }
    } else {
      this.setState({ agesDetected: [], loadRecognitionAges: false });
    }
  };

  changeFilter = (event, data) => {
    if (data) {
      this.setState({ filterCam: data.value })
      // conections.dashboardCams(data.value);
    } else {
      this.setState({ filterCam: event.target.value })
      // conections.dashboardCams(event.target.value);
    }
    setTimeout(() => {
      this.loadData()
    }, 0);
  };

  processRegisterMood = (response) => {
    const data = response.data.data

    this.setState({
      lastMood: data[data.length - 1] ? data[data.length - 1].date_update : "XX NN"
    })

    if (Object.keys(data).length > 0) {

      let dataNeutral = []
      let dataSorprendido = []
      let dataTriste = []
      let dataFeliz = []
      let dataEnojado = []

      let dates = []

      data.forEach(element => {

        if (dataNeutral.length < dates.length) {
          dataNeutral.push(0)
        }
        if (dataSorprendido.length < dates.length) {
          dataSorprendido.push(0)
        }
        if (dataTriste.length < dates.length) {
          dataTriste.push(0)
        }
        if (dataFeliz.length < dates.length) {
          dataFeliz.push(0)
        }
        if (dataEnojado.length < dates.length) {
          dataEnojado.push(0)
        }

        const newDate = element.date.split("-").reverse()[0] + "/" + element.date.split("-").reverse()[1]
        dates.push(newDate)

        element.data.forEach(el => {

          switch (el.mood) {
            case "neutral":
              dataNeutral.push(el.total)
              break;
            case "sad":
              dataTriste.push(el.total)
              break;
            case "anger":
              dataEnojado.push(el.total)
              break;
            case "happy":
              dataFeliz.push(el.total)
              break;
            case "surprise":
              dataSorprendido.push(el.total)
              break;
            default:
              break;
          }

        })
      })

      if (dataNeutral.length < dates.length) {
        dataNeutral.push(0)
      }
      if (dataSorprendido.length < dates.length) {
        dataSorprendido.push(0)
      }
      if (dataTriste.length < dates.length) {
        dataTriste.push(0)
      }
      if (dataFeliz.length < dates.length) {
        dataFeliz.push(0)
      }
      if (dataEnojado.length < dates.length) {
        dataEnojado.push(0)
      }

      const series = [
        {
          name: "Neutral",
          data: dataNeutral
        },
        {
          name: "Sorprendido",
          data: dataSorprendido
        },
        {
          name: "Triste",
          data: dataTriste
        },
        {
          name: "Feliz",
          data: dataFeliz
        },
        {
          name: "Enojado",
          data: dataEnojado
        },
      ]


      this.setState({
        registerMood: {
          series: series,
          dates: dates
        },
        loadingRegisterMood: false,
      });
    } else {
      this.setState({ registerMood: [], loadingRegisterMood: false });
    }
  }

  componentDidMount() {
    this.loadData();
  }

  // lastCreatedCams = (response) => {
  //   const data = response.data;
  //   this.setState({ lastCreatedCams: data, loadingCamsGrid: false });
  // };

  getPersonsPerCamera = (response) => {
    const data = response.data;
    let newData = [];
    let dropDownData = [];
    if (data && data.results) {
      let { results } = data;
      results && results.length > 0 &&
        results.map((item) => {
          return (
            newData.push({
              x: item.endpoint_name ? item.endpoint_name : item.camera_name,
              y: item.total_face,
            })
          )
        });

      results && results.length > 0 &&
        results.map((item) => {
          if (item.endpoint_name || item.camera_name) {
            dropDownData.push({
              name: item.endpoint_name || item.camera_name,
            })
          }
          return dropDownData;
        });
      this.setState({
        personsPerCamera: newData,
        setDropDown: dropDownData,
        loadingPeoplePerCamera: false,
      });
    }
  };

  getPersons = (response) => {
    const data = response.data;
    let newData = [];
    if (data && data.data) {
      data.data.map((item) => {
        return (
          newData.push({
            fecha: item.date,
            total: item.total,
          })
        )

      });
      this.setState({ persons: newData, loadingPersons: false });
    }
  };

  processTicketsData = (response) => {
    const dataTickets = response.data;
    const ticketStatus = [
      {
        name: "Abiertos",
        value: dataTickets.open,
      },
      {
        name: "En proceso",
        value: dataTickets.process,
      },
      {
        name: "Cerrados",
        value: dataTickets.closed,
      },
    ];
    const totaltickets = [
      {
        name: "Total",
        value: dataTickets.total,
      },
    ];

    let attendedVSclosed = dataTickets.total_closed_tickets_by_user.map((v) => {
      let found = false;
      v.Cerrados = parseInt(v.total.toString());
      for (
        let index = 0;
        index < dataTickets.total_attended_tickets_by_user.length;
        index++
      ) {
        const element = dataTickets.total_attended_tickets_by_user[index];
        if (element.name === v.name) {
          found = true;
          v.Proceso = element.total;
          break;
        }
      }
      if (!found) {
        v.Proceso = 0;
      }
      delete v.total;
      return v;
    });
    dataTickets.total_attended_tickets_by_user.map((v) => {
      let found = false;
      for (let index = 0; index < attendedVSclosed.length; index++) {
        const element = attendedVSclosed[index];
        if (element.name === v.name) {
          found = true;
          break;
        }
      }
      if (!found) {
        attendedVSclosed.push({ name: v.name, Cerrados: 0, Proceso: v.total });
      }
      return v;
    });
    this.setState({
      loadingTickets: false,
      dataTickets: ticketStatus,
      dataTotalTickets: totaltickets,
      dataTicketsPerUser: {
        created: dataTickets.total_created_tickets_by_user,
        attended: dataTickets.total_attended_tickets_by_user,
        closed: dataTickets.total_closed_tickets_by_user,
      },
      attendedVSclosed: attendedVSclosed,
    });
  };
}

function customLabel(p) {
  return (
    <Text
      fontSizeAdjust="true"
      verticalAnchor="middle"
      width={300}
      height={p.height}
      x={p.x + 5}
      y={p.y + 10}
    >
      {p.value}
    </Text>
  );
}

// function shuffle(array) {
//   var currentIndex = array.length, temporaryValue, randomIndex;

//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {

//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;

//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }

//   return array;
// }

export default Dashboard;
