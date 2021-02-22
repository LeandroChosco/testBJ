import React, { Component } from 'react';
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import './style.css'
import conections from '../../conections';
import { Text } from 'recharts';
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from '../../components/Card/CardBody';
import { Tab } from 'semantic-ui-react'
// import socketIOClient from 'socket.io-client';
// import sailsIOClient from 'sails.io.js';
// import constants from '../../constants/constants';
import * as moment from 'moment';
import CameraPerPerson from '../../components/Dashboard/cameraPerPerson';
import PeoplePerDay from '../../components/Dashboard/persons';
import Loading from '../../components/Loading/index';
import IntalledLastMonth from '../../components/Dashboard/camerasInstalledLastMonth';
import AgeDetected from '../../components/Dashboard/ageDetected';
import PersonsMood from '../../components/Dashboard/personsMood';
import GenderDetected from '../../components/Dashboard/genderDetected';
import DataCams from '../../components/Dashboard/dataCams';
import CamsInstalledByMonth from '../../components/Dashboard/camsInstalledByMonth';
import DataTickets from '../../components/Dashboard/dataTickets';
import DataTicketsPerUser from '../../components/Dashboard/dataTicketsPerUser';
import AttendedVSclosed from '../../components/Dashboard/attendedVScloded';
import LastCreadedCams from '../../components/Dashboard/lastCreatedCams';


const MOODS = {
  "Happy": "Feliz",
  "Happiness": "Feliz",
  "Sad": "Triste",
  "Sadness": "Triste",
  "Angry": "Enojado",
  "Anger": "Enojado",
  "Surprised": "Sorprendido",
  "Surprise": "Sorprendido",
  "Disgusted": "Disgustado",
  "Contemptuous": "Desprecio",
}

const style = {
  height: {
    height: '100%'
  },
  adjustX: {
    height: '100%',
    overflowX: "auto",
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

class Dashboard extends Component {

  state = {
    loadingCams: true,
    dataCams: [],
    loadingTickets: true,
    dataTickets: [],
    dataTotalTickets: [],
    dataTicketsPerUser: {
      closed: [],
      attended: [],
      created: []
    },
    loadTotalRecognition: true,
    loadRecognitionAges: true,
    loadingRecognitionPerDay: true,
    loadingRecognitionMood: true,
    loadingCamsGrid: true,
    personsMood: [
      {
        "mood": "Neutral",
        "total": 0,
        "fullMark": 100
      },
      {
        "mood": "Sorprendido",
        "total": 0,
        "fullMark": 100
      },
      {
        "mood": "Triste",
        "total": 0,
        "fullMark": 100
      },
      {
        "mood": "Feliz",
        "total": 0,
        "fullMark": 100
      },
      {
        "mood": "Enojado",
        "total": 0,
        "fullMark": 100
      }
      // {
      //   "mood": "Procupado",
      //   "total": 0,
      //   "fullMark": 100
      // },
      // {
      //   "mood": "Ansioso",
      //   "total": 0,
      //   "fullMark": 100
      // }
    ],
    genderDetected: [],
    agesDetected: [],
    personsperDay: [],
    attendedVSclosed: [],
    panes: [
      { menuItem: 'Camaras', render: () => <Tab.Pane attached={false}>{this.renderCamsDashboard()}</Tab.Pane> },
      { menuItem: 'Tickets', render: () => <Tab.Pane attached={false}>{this.renderTicketsDashboard()}</Tab.Pane> },
      { menuItem: 'Reconocimiento', render: () => <Tab.Pane attached={false}>{this.renderRecognitionDashboard()}</Tab.Pane> },
    ]
  }

  renderCamsDashboard() {
    // const c = shuffle(COLORS);
    return (
      <div className='container-flex'>
        <div className='row'>
          <div className='col chart overflow table-responsive' align='center'>
            {
              this.state.loadingCamsGrid ?
                <Loading />
                :
                this.state.lastCreatedCams ?
                  <LastCreadedCams lastCreatedCams={this.state.lastCreatedCams} />
                  : null}

          </div>
          <div className='col chart' align='center'>
            <h3>Estatus de camaras</h3>
            {
              this.state.loadingCams ?
                <Loading />
                :
                <DataCams dataCams={this.state.dataCams} />
            }
          </div>
        </div>
        <div className="row">
          <div className='col-6 chart' align='center'>
            <h3>Camara  instaladas por mes</h3>
            {
              this.state.loadingCams ?
                <Loading />
                :
                <CamsInstalledByMonth installed_by_moth={this.state.installed_by_moth} />
            }
          </div>
          <div className='col-6 chart' align='center'>
            <h3>Camara instaladas Ultimo mes</h3>
            {
              this.state.loadingCams ?
                <Loading />
                :
                <IntalledLastMonth installed_last_moth={this.state.installed_last_moth} />
            }
          </div>
        </div>
      </div>
    );
  }


  renderTicketsDashboard() {
    return (
      <div className='container-flex'>
        <div className='row'>
          <div className='col chart' align='center'>
            <h3>Estatus de tickets</h3>
            {
              this.state.loadingTickets ?
                <Loading />
                :
                <DataTickets dataTickets={this.state.dataTickets} dataTotalTickets={this.state.dataTotalTickets} />
            }
          </div>
        </div>
        <div className='row'>
          <div className='col-6 chart2x' align='center'>
            <h3>Tickets creados por usuario</h3>
            {
              this.state.loadingTickets ?
                <Loading />
                :
                <DataTicketsPerUser dataTicketsPerUser={this.state.dataTicketsPerUser} customLabel={customLabel} />
            }
          </div>
          <div className='col-6 chart2x' align='center'>
            <h3>Tickets atendidos y cerrados por usuario</h3>
            {
              this.state.loadingTickets ?
                <Loading />
                :
                <AttendedVSclosed attendedVSclosed={this.state.attendedVSclosed} />
            }
          </div>
        </div>
      </div>
    );
  }

  renderRecognitionDashboard() {
    const { loadingPeoplePerCamera, personsPerCamera, persons, loadingPersons, loadingRecognitionMood } = this.state;

    return (
      <div className='container-flex'>
        <div className='row'>
          <div className='col-6 chart' align='center'>

          <Card style={style.height}>
          <CardHeader>
          <h3 className="pt-2">Personas detectadas</h3>
        </CardHeader>          {
            this.state.loadTotalRecognition ?
              <Loading />
              :
              <GenderDetected genderDetected={this.state.genderDetected} dataTickets={this.state.dataTickets} />
          }
        </Card>


          </div>
          <div className='col-6 chart' align='center'>
          <Card style={style.adjustX}>
          <CardHeader>
            <h3 className="pt-2">Estado de Animo</h3><br></br><br></br>
          </CardHeader>
          <CardBody>
         {
          this.state.loadingRecognitionMood ?
          <Loading />
          :
           <PersonsMood personsMood={this.state.personsMood} />
          }
          </CardBody>
        </Card>
            {/* {
              this.state.loadingRecognitionMood ?
                <ClassicSpinner
                  loading={true}
                  size={40}
                  color="#686769"
                /> : <ResponsiveContainer>
                  <RadarChart data={this.state.personsMood}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="mood" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="assaEstado de animo" dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />

                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>} */}

          </div>
        </div>
        <div className='row'>
          <div className='col-6 chart' align='center'>
          <h3>Rango de edades</h3>
            {
              this.state.loadRecognitionAges ?
                  <Loading />
                :
                <AgeDetected agesDetected={this.state.agesDetected} />
            }
          </div>
          <div className='col-6 chart' align='center'>
          <h3>Conteo de personas por cámara últimos 90 días</h3>
            {
              loadingPeoplePerCamera ?
                <Loading />
                :
                <CameraPerPerson data={personsPerCamera} />
            }
          </div>
        </div>

        <div className="row">
          <div className='col-12 chart' align='center' >
          <h3>Conteo de personas por día últimos 90 días </h3>
            {
              loadingPersons ?
                  <Loading />
                :
                <PeoplePerDay data={persons} />
            }
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={!this.props.showMatches ? "hide-matches" : "show-matches"}>
        <div className={this.props.showMatches ? "hide-matches" : "show-matches"}>

          <button className='btn clear pull-right' onClick={this.loadData}><i className={'fa fa-repeat'}></i>Actualizar</button>
        </div>
        <Tab menu={{ secondary: true, pointing: true }} panes={this.state.panes} />
      </div>
    )
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
      loadingCamsGrid: true,
      loadingPeoplePerCamera: true,
      loadingPersons: true
    })
    conections.dashboardCams().then(response => {
      const data = response.data;
      // console.log('datilla: ', data)
      this.setState({
        loadingCams: false,
        dataCams: [
          { name: 'Activas', value: data.active },
          { name: 'Inactivas', value: data.deactive },
          { name: 'Desconectadas', value: data.disconnected }
        ],
        installed_by_moth: data.installed_by_moth.map(v => { v.fecha = moment(v.fecha).format('MMM-YYYY'); return v }),
        installed_last_moth: data.installed_last_moth.map(v => { v.fecha = moment(v.fecha).format('DD-MM-YYYY'); return v })
      })
    })
    conections.dashboardTickets().then(this.processTicketsData)
    conections.dashboardTotalRecognition().then(this.processDetected)
    conections.dashboardRecognitionAges().then(this.processAges)
    conections.dashboardRecognitionPerDay('?enddate=' + moment().format('YYYY-MM-DD') + '&startdate=' + moment().add(-15, 'days').format('YYYY-MM-DD')).then(this.processPerDay)
    conections.dashboardRecognitionMood().then(this.processMood)
    conections.loadCams().then(this.lastCreatedCams).catch(err => {
      console.log('Cargando camaras', err)
    })
    conections.dashboardCameraPerPerson().then(this.getPersonsPerCamera);
    conections.dashboardPersons().then(this.getPersons);
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
    io.sails.url = constants.base_url+':1337';
    io.socket.get('/cams?sort=num_cam asc&active=1&limit=10000', this.lastCreatedCams) */
  }

  processMood = (response) => {
    let data = []
    let indexes = []
    response.data.data.forEach(v => {
      if (v && v.mood !== "") {
        v.mood = MOODS[v.mood] ? MOODS[v.mood] : v.mood
        if (indexes.indexOf(v.mood) > -1) {
          data[indexes.indexOf(v.mood)].percentage = (v.percentage + data[indexes.indexOf(v.mood)].percentage) / 2
        } else {
          data.push(v)
          indexes.push(v.mood)
        }
      }
    });

    const personsMood_copy = [...this.state.personsMood];
    const aux = personsMood_copy.map(item => {
      const found = data.find(d => d.mood === item.mood);
      if (found) {
        return found;
      } else {
        item['percentage'] = null;
        return item;
      }
    })
    this.setState({ personsMood: aux, loadingRecognitionMood: false })
  }

  processPerDay = (response) => {
    const data = response.data.data
    this.setState({ personsperDay: data, loadingRecognitionPerDay: false })
  }

  processDetected = (response) => {
    const data = response.data.data
    this.setState({
      genderDetected: [
        {
          name: 'Mujer',
          value: data.women_detected
        }, {
          name: 'Hombre',
          value: data.men_detected
        }
      ],
      loadTotalRecognition: false
    })
  }

  processAges = (response) => {
    const data = response.data.data
    this.setState({
      agesDetected: [
        {
          name: '-18',
          total: data.total_under_18,
          Hombres: data.men_under_18,
          Mujeres: data.women_under_18
        }, {
          name: '18-30',
          total: data.total_between_18_30,
          Hombres: data.men_between_18_30,
          Mujeres: data.women_between_18_30
        }, {
          name: '31-50',
          total: data.total_between_31_50,
          Hombres: data.men_between_31_50,
          Mujeres: data.women_between_31_50
        }, {
          name: '50+',
          total: data.total_over_50,
          Hombres: data.men_over_50,
          Mujeres: data.women_over_50
        }
      ],
      loadRecognitionAges: false
    })
  }

  componentDidMount() {
    this.loadData()
  }

  lastCreatedCams = (response) => {
    const data = response.data
    this.setState({ lastCreatedCams: data, loadingCamsGrid: false })
  }

  getPersonsPerCamera = (response) => {
    const data = response.data;
    let newData = [];
    if (data && data.results) {
      let { results } = data;
      results.map((item) => {
        newData.push({
          x: item.camera_name,
          y: item.total_face
        });
      });
      this.setState({ personsPerCamera: newData, loadingPeoplePerCamera: false });
    };

  }

  getPersons = (response) => {
    const data = response.data;
    let newData = [];
    if (data && data.data) {
      data.data.map((item) => {
        newData.push({
          fecha: item.date,
          total: item.total
        });
      });
      this.setState({ persons: newData, loadingPersons: false });
    };
  }

  processTicketsData = (response) => {
    const dataTickets = response.data;
    const ticketStatus = [{
      name: 'Abiertos', value: dataTickets.open
    }, {
      name: 'En proceso', value: dataTickets.process
    }, {
      name: 'Cerrados', value: dataTickets.closed
    }]
    const totaltickets = [{
      name: 'Total', value: dataTickets.total
    }]


    let attendedVSclosed = dataTickets.total_closed_tickets_by_user.map(v => {
      let found = false
      v.Cerrados = parseInt(v.total.toString());
      for (let index = 0; index < dataTickets.total_attended_tickets_by_user.length; index++) {
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
      delete v.total
      return v;
    })
    dataTickets.total_attended_tickets_by_user.map(v => {
      let found = false
      for (let index = 0; index < attendedVSclosed.length; index++) {
        const element = attendedVSclosed[index];
        if (element.name === v.name) {
          found = true;
          break;
        }
      }
      if (!found) {
        attendedVSclosed.push({ name: v.name, Cerrados: 0, Proceso: v.total })
      }
      return v;
    })
    this.setState({
      loadingTickets: false,
      dataTickets: ticketStatus,
      dataTotalTickets: totaltickets,
      dataTicketsPerUser: {
        created: dataTickets.total_created_tickets_by_user,
        attended: dataTickets.total_attended_tickets_by_user,
        closed: dataTickets.total_closed_tickets_by_user
      },
      attendedVSclosed: attendedVSclosed
    });
  }

}

function customLabel(p) {
  return (
    <Text
      fontSizeAdjust='true'
      verticalAnchor='middle'
      width={300}
      height={p.height}
      x={p.x + 5}
      y={p.y + 10}
    >
      {p.value}
    </Text>
  )
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
